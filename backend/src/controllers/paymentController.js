import Stripe from 'stripe';
import prisma from '../config/database.js';
import config from '../config/index.js';
import { asyncHandler } from '../middleware/error.middleware.js';

const stripe = new Stripe(config.stripe.secretKey);

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

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

  // Check if payment already exists
  const existingPayment = await prisma.payment.findUnique({
    where: { bookingId },
  });

  if (existingPayment && existingPayment.paymentStatus === 'COMPLETED') {
    return res.status(400).json({
      success: false,
      message: 'Booking has already been paid',
    });
  }

  // Create or update payment intent
  let paymentIntent;
  
  if (existingPayment?.stripePaymentIntentId) {
    // Retrieve existing payment intent
    paymentIntent = await stripe.paymentIntents.retrieve(
      existingPayment.stripePaymentIntentId
    );
  } else {
    // Create new payment intent
    paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalPrice * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        bookingId: booking.id,
        bookingNumber: booking.bookingNumber,
        userId: booking.userId,
        tourTitle: booking.tour.title,
      },
      description: `Payment for ${booking.tour.title} - Booking #${booking.bookingNumber}`,
    });

    // Generate payment number
    const paymentNumber = `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create or update payment record
    await prisma.payment.upsert({
      where: { bookingId },
      create: {
        paymentNumber,
        bookingId,
        userId: booking.userId,
        amount: booking.totalPrice,
        currency: 'USD',
        paymentMethod: 'CARD',
        paymentStatus: 'PENDING',
        stripePaymentIntentId: paymentIntent.id,
      },
      update: {
        stripePaymentIntentId: paymentIntent.id,
        paymentStatus: 'PENDING',
      },
    });
  }

  res.status(200).json({
    success: true,
    data: {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
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

  // Update payment and booking in transaction
  const result = await prisma.$transaction(async (tx) => {
    // Update payment
    const payment = await tx.payment.update({
      where: { stripePaymentIntentId: paymentIntentId },
      data: {
        paymentStatus: 'COMPLETED',
        paidAt: new Date(),
        stripeChargeId: paymentIntent.latest_charge,
        transactionId: paymentIntent.id,
      },
    });

    // Update booking status
    const booking = await tx.booking.update({
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

    // Create notification for user
    await tx.notification.create({
      data: {
        userId: req.user.id,
        type: 'PAYMENT',
        title: 'Payment Successful',
        message: `Your payment for ${booking.tour.title} has been confirmed. Booking #${booking.bookingNumber}`,
        link: `/bookings/${booking.id}`,
      },
    });

    return { payment, booking };
  });

  res.status(200).json({
    success: true,
    message: 'Payment confirmed successfully',
    data: result,
  });
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
