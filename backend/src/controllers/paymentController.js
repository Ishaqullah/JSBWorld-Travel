import Stripe from 'stripe';
import prisma from '../config/database.js';
import config from '../config/index.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { sendBookingConfirmation, sendBookingPendingEmail, sendBookingNotificationToAdmin } from '../services/emailService.js';

const stripe = new Stripe(config.stripe.secretKey);

// Card processing fee percentage
const CARD_FEE_PERCENTAGE = 0.03; // 3%

// Convert Prisma Decimal or any value to number for Stripe (amounts in dollars)
const toAmount = (v) => {
  if (v == null || v === '') return 0;
  const n = typeof v === 'number' && !Number.isNaN(v) ? v : Number(v);
  return Number.isNaN(n) ? 0 : n;
};

// @desc    Create payment intent (or return existing one)
// @route   POST /api/payments/create-intent
// @access  Private
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { bookingId, paymentMethod = 'CARD', amountInCents: requestedAmountInCents } = req.body;

  // Get booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tour: true,
      user: true,
    },
  });

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  // Check if booking is already confirmed (paid)
  if (booking.status === 'CONFIRMED') {
    return res.status(400).json({
      success: false,
      message: 'Booking is already confirmed and paid',
    });
  }

  // Check authorization
  if (booking.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  // Check if payment already exists and is completed
  const existingPayment = await prisma.payment.findUnique({
    where: { bookingId },
  });

  if (existingPayment && existingPayment.paymentStatus === 'COMPLETED') {
    return res.status(400).json({
      success: false,
      message: 'Booking has already been paid',
    });
  }

  // Calculate amounts - use deposit amount if this is a deposit payment (convert Prisma Decimal to number)
  let baseAmount = booking.isDepositPayment && booking.depositAmount
    ? toAmount(booking.depositAmount)
    : toAmount(booking.totalPrice);
  let cardFee = 0;
  let totalAmount = baseAmount;

  // Add 3% fee for card payments
  if (paymentMethod === 'CARD') {
    cardFee = baseAmount * CARD_FEE_PERCENTAGE;
    totalAmount = baseAmount + cardFee;
  }

  // Use frontend amount as source of truth when provided — user was shown this total; DB total can differ (rounding, different source).
  let amountCents = Math.round(totalAmount * 100);
  if (requestedAmountInCents != null && Number.isInteger(requestedAmountInCents) && requestedAmountInCents >= 50) {
    const bookingTotalCents = Math.round(baseAmount * 100);
    const maxAllowedCents = Math.max(bookingTotalCents * 3, 100000); // sanity: allow up to 3x booking or $1000 min
    if (requestedAmountInCents <= maxAllowedCents) {
      amountCents = requestedAmountInCents;
      totalAmount = requestedAmountInCents / 100;
      baseAmount = totalAmount / (1 + CARD_FEE_PERCENTAGE); // subtotal before 3% fee
      cardFee = totalAmount - baseAmount;
    }
  }

  // Create or reuse payment intent
  let paymentIntent;
  let needNewIntent = true;
  
  // Try to reuse existing Stripe PaymentIntent if available and valid
  if (existingPayment?.stripePaymentIntentId) {
    try {
      const existingIntent = await stripe.paymentIntents.retrieve(
        existingPayment.stripePaymentIntentId
      );
      
      // Check if payment method type matches
      const expectedType = paymentMethod === 'BANK_TRANSFER' ? 'us_bank_account' : 'card';
      const hasMatchingType = existingIntent.payment_method_types?.includes(expectedType);
      
      console.log(`Existing PaymentIntent status: ${existingIntent.status}, type matches: ${hasMatchingType}`);
      
      // Reuse if method type matches and intent is still usable
      if (hasMatchingType && !['canceled', 'succeeded'].includes(existingIntent.status)) {
        // Update amount if needed
        if (existingIntent.amount !== amountCents) {
          paymentIntent = await stripe.paymentIntents.update(
            existingPayment.stripePaymentIntentId,
            { amount: amountCents }
          );
          console.log('Updated existing PaymentIntent amount');
        } else {
          paymentIntent = existingIntent;
          console.log('Reusing existing PaymentIntent as-is');
        }
        needNewIntent = false;
      } else if (existingIntent.status === 'requires_payment_method') {
        // Cancel old intent since method type changed
        try {
          await stripe.paymentIntents.cancel(existingPayment.stripePaymentIntentId);
          console.log('Cancelled old PaymentIntent due to method type change');
        } catch (cancelError) {
          console.log('Could not cancel old PaymentIntent:', cancelError.message);
        }
      }
    } catch (error) {
      console.log('Error retrieving existing PaymentIntent, will create new one:', error.message);
    }
  }
  
  if (needNewIntent) {
    // Create new payment intent (amountCents = what user was shown, so Stripe UI matches)
    const paymentIntentData = {
      amount: amountCents,
      currency: 'usd',
      metadata: {
        bookingId: booking.id,
        bookingNumber: booking.bookingNumber,
        userId: booking.userId,
        tourTitle: booking.tour.title,
        paymentMethod: paymentMethod,
        baseAmount: baseAmount.toFixed(2),
        cardFee: cardFee.toFixed(2),
      },
      description: `Payment for ${booking.tour.title} - Booking #${booking.bookingNumber}`,
    };

    if (paymentMethod === 'BANK_TRANSFER') {
      paymentIntentData.payment_method_types = ['us_bank_account'];
      paymentIntentData.payment_method_options = {
        us_bank_account: {
          financial_connections: {
            permissions: ['payment_method'],
          },
        },
      };
    } else {
      paymentIntentData.payment_method_types = ['card'];
    }

    paymentIntent = await stripe.paymentIntents.create(paymentIntentData);
    console.log('Created new PaymentIntent:', paymentIntent.id);
  }

  // Always upsert the payment record to ensure it's in sync
  const paymentNumber = existingPayment?.paymentNumber || `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`;
  
  await prisma.payment.upsert({
    where: { bookingId },
    create: {
      paymentNumber,
      bookingId,
      userId: booking.userId,
      amount: totalAmount,
      currency: 'USD',
      paymentMethod: paymentMethod,
      paymentStatus: 'PENDING',
      stripePaymentIntentId: paymentIntent.id,
      metadata: {
        baseAmount: baseAmount,
        cardFee: cardFee,
      },
    },
    update: {
      stripePaymentIntentId: paymentIntent.id,
      paymentMethod: paymentMethod,
      amount: totalAmount,
      paymentStatus: 'PENDING',
      metadata: {
        baseAmount: baseAmount,
        cardFee: cardFee,
      },
    },
  });

  res.status(200).json({
    success: true,
    data: {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      baseAmount: baseAmount,
      cardFee: cardFee,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
    },
  });
});

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
export const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentIntentId, bookingId } = req.body;

  // Retrieve payment intent from Stripe
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== 'succeeded') {
    return res.status(400).json({
      success: false,
      message: 'Payment not completed',
    });
  }

  // First, verify the booking exists
  const existingBooking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tour: {
        include: {
          images: { take: 1 },
        },
      },
      tourDate: true,
    },
  });

  if (!existingBooking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  // Update payment and booking using separate queries instead of transaction
  // This avoids the transaction timeout issue
  try {
    // Update payment
    const payment = await prisma.payment.update({
      where: { bookingId: bookingId },
      data: {
        paymentStatus: 'COMPLETED',
        paidAt: new Date(),
        stripeChargeId: paymentIntent.latest_charge,
        transactionId: paymentIntent.id,
      },
    });

    // Update booking status
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
      include: {
        tour: {
          include: {
            images: { take: 1 },
          },
        },
        tourDate: true,
      },
    });

    // Create notification for user (non-critical, don't fail if this errors)
    try {
      await prisma.notification.create({
        data: {
          userId: req.user.id,
          type: 'PAYMENT',
          title: 'Payment Successful',
          message: `Your payment for ${booking.tour.title} has been confirmed. Booking #${booking.bookingNumber}`,
          link: `/bookings/${booking.id}`,
        },
      });
    } catch (notifError) {
      console.error('Failed to create notification:', notifError.message);
      // Don't throw - notification failure shouldn't fail the payment confirmation
    }

    // Send confirmation email to user and notification to admin (non-critical)
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (user) {
        await sendBookingConfirmation(booking, user);
        await sendBookingNotificationToAdmin(booking, user, 'COMPLETED');
      }
    } catch (emailError) {
      console.error('Failed to send booking emails:', emailError.message);
      // Don't throw - email failure shouldn't fail the payment confirmation
    }

    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully',
      data: { payment, booking },
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    
    // If payment update failed but Stripe shows success, log for manual review
    if (paymentIntent.status === 'succeeded') {
      console.error('CRITICAL: Stripe payment succeeded but DB update failed. BookingId:', bookingId, 'PaymentIntentId:', paymentIntentId);
    }
    
    throw error;
  }
});

// @desc    Get payment details
// @route   GET /api/payments/:id
// @access  Private
export const getPaymentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      booking: {
        include: {
          tour: true,
          tourDate: true,
        },
      },
    },
  });

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found',
    });
  }

  // Check authorization
  if (payment.userId !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  res.status(200).json({
    success: true,
    data: { payment },
  });
});

// @desc    Process refund
// @route   POST /api/payments/:id/refund
// @access  Private/Admin
export const processRefund = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, reason } = req.body;

  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { booking: true },
  });

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found',
    });
  }

  if (payment.paymentStatus !== 'COMPLETED') {
    return res.status(400).json({
      success: false,
      message: 'Cannot refund a payment that is not completed',
    });
  }

  // Create refund in Stripe
  const refund = await stripe.refunds.create({
    payment_intent: payment.stripePaymentIntentId,
    amount: amount ? Math.round(amount * 100) : undefined, // Partial or full refund
    reason: reason || 'requested_by_customer',
  });

  // Update payment record
  const updatedPayment = await prisma.payment.update({
    where: { id },
    data: {
      paymentStatus: 'REFUNDED',
      refundedAt: new Date(),
      refundAmount: amount || payment.amount,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Refund processed successfully',
    data: { payment: updatedPayment, refund },
  });
});

// @desc    Create bank transfer invoice
// @route   POST /api/payments/create-bank-transfer
// @access  Private
export const createBankTransferInvoice = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  // Get booking with user and tour details
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tour: true,
      user: true,
    },
  });

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  // Check authorization
  if (booking.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  // Check if payment already exists and is completed
  const existingPayment = await prisma.payment.findUnique({
    where: { bookingId },
  });

  if (existingPayment && existingPayment.paymentStatus === 'COMPLETED') {
    return res.status(400).json({
      success: false,
      message: 'Booking has already been paid',
    });
  }

  // Calculate amounts - use deposit amount if this is a deposit payment (convert Prisma Decimal)
  const totalAmount = booking.isDepositPayment && booking.depositAmount
    ? toAmount(booking.depositAmount)
    : toAmount(booking.totalPrice);

  try {
    // Step 1: Create or retrieve Stripe Customer
    let stripeCustomer;
    
    // Check if user already has a Stripe customer ID stored
    if (booking.user.stripeCustomerId) {
      stripeCustomer = await stripe.customers.retrieve(booking.user.stripeCustomerId);
    } else {
      // Create new Stripe customer
      stripeCustomer = await stripe.customers.create({
        email: booking.user.email,
        name: booking.user.name,
        metadata: {
          userId: booking.user.id,
        },
      });

      // Store Stripe customer ID in user record (optional - add this field to schema if needed)
      // await prisma.user.update({
      //   where: { id: booking.user.id },
      //   data: { stripeCustomerId: stripeCustomer.id },
      // });
    }

    // Step 2: Create Invoice with bank transfer payment method
    const invoice = await stripe.invoices.create({
      customer: stripeCustomer.id,
      payment_settings: {
        payment_method_types: ['customer_balance'],
        payment_method_options: {
          customer_balance: {
            funding_type: 'bank_transfer',
            bank_transfer: {
              type: 'us_bank_transfer', // For US ACH transfers
            },
          },
        },
      },
      collection_method: 'send_invoice',
      days_until_due: 7, // Invoice due in 7 days
      metadata: {
        bookingId: booking.id,
        bookingNumber: booking.bookingNumber,
      },
    });

    // Step 3: Add invoice item for the booking
    await stripe.invoiceItems.create({
      customer: stripeCustomer.id,
      invoice: invoice.id,
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      description: `Payment for ${booking.tour.title} - Booking #${booking.bookingNumber}`,
    });

    // Step 4: Finalize the invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

    // Step 5: Create or update payment record
    const paymentNumber = `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`;

    await prisma.payment.upsert({
      where: { bookingId },
      create: {
        paymentNumber,
        bookingId,
        userId: booking.userId,
        amount: totalAmount,
        currency: 'USD',
        paymentMethod: 'BANK_TRANSFER',
        paymentStatus: 'PENDING',
        stripePaymentIntentId: finalizedInvoice.payment_intent || invoice.id,
        metadata: {
          stripeInvoiceId: invoice.id,
          stripeCustomerId: stripeCustomer.id,
          hostedInvoiceUrl: finalizedInvoice.hosted_invoice_url,
        },
      },
      update: {
        paymentMethod: 'BANK_TRANSFER',
        paymentStatus: 'PENDING',
        metadata: {
          stripeInvoiceId: invoice.id,
          stripeCustomerId: stripeCustomer.id,
          hostedInvoiceUrl: finalizedInvoice.hosted_invoice_url,
        },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        invoiceId: invoice.id,
        hostedInvoiceUrl: finalizedInvoice.hosted_invoice_url,
        invoicePdf: finalizedInvoice.invoice_pdf,
        totalAmount: totalAmount,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: finalizedInvoice.status,
      },
    });
  } catch (error) {
    console.error('Bank transfer invoice error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create bank transfer invoice',
    });
  }
});

// @desc    Submit bank transfer with receipt
// @route   POST /api/payments/bank-transfer
// @access  Private
export const submitBankTransfer = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  // Check if receipt file was uploaded
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Payment receipt is required',
    });
  }

  // Get booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tour: true,
      user: true,
    },
  });

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  // Check authorization
  if (booking.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  // Check if booking is already confirmed
  if (booking.status === 'CONFIRMED') {
    return res.status(400).json({
      success: false,
      message: 'Booking is already confirmed',
    });
  }

  // Convert uploaded file to base64
  const base64Data = req.file.buffer.toString('base64');
  const mimeType = req.file.mimetype;
  const receiptData = `data:${mimeType};base64,${base64Data}`;

  // Generate payment number
  const paymentNumber = `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`;

  // Create or update payment record with AWAITING_VERIFICATION status
  const payment = await prisma.payment.upsert({
    where: { bookingId },
    create: {
      paymentNumber,
      bookingId,
      userId: booking.userId,
      amount: booking.isDepositPayment && booking.depositAmount
        ? toAmount(booking.depositAmount)
        : toAmount(booking.totalPrice),
      currency: 'USD',
      paymentMethod: 'BANK_TRANSFER',
      paymentStatus: 'AWAITING_VERIFICATION',
      receiptData,
      metadata: {
        submittedAt: new Date().toISOString(),
        originalFilename: req.file.originalname,
      },
    },
    update: {
      paymentMethod: 'BANK_TRANSFER',
      paymentStatus: 'AWAITING_VERIFICATION',
      receiptData,
      metadata: {
        submittedAt: new Date().toISOString(),
        originalFilename: req.file.originalname,
      },
    },
  });

  // Send pending email to user and notification to admin (non-critical)
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const bookingWithDetails = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { tour: true, tourDate: true },
    });
    if (user && bookingWithDetails) {
      await sendBookingPendingEmail(bookingWithDetails, user);
      await sendBookingNotificationToAdmin(bookingWithDetails, user, 'AWAITING_VERIFICATION');
    }
  } catch (emailError) {
    console.error('Failed to send bank transfer emails:', emailError.message);
    // Don't throw - email failure shouldn't fail the submission
  }

  res.status(200).json({
    success: true,
    message: 'Bank transfer submitted. Your booking is pending admin approval.',
    data: {
      payment: {
        id: payment.id,
        paymentNumber: payment.paymentNumber,
        status: payment.paymentStatus,
        receiptUrl: payment.receiptUrl,
      },
      booking: {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        status: booking.status,
      },
    },
  });
});

// @desc    Get bank details for bank transfer
// @route   GET /api/payments/bank-details
// @access  Private
export const getBankDetails = asyncHandler(async (req, res) => {
  // These would typically come from environment variables or database
  const bankDetails = {
    bankName: 'First National Bank',
    accountName: 'Travecations Ltd',
    accountNumber: '1234567890',
    sortCode: '12-34-56',
    swiftBic: 'FNBKUS33',
    currency: 'USD',
    reference: 'Use your Booking Number as reference',
  };

  res.status(200).json({
    success: true,
    data: bankDetails,
  });
});
