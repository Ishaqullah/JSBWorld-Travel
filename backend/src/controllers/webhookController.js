import Stripe from 'stripe';
import prisma from '../config/database.js';
import config from '../config/index.js';

const stripe = new Stripe(config.stripe.secretKey);

export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = config.stripe.webhookSecret;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook Signature Verification Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handlePaymentIntentSucceeded(paymentIntent);
      break;

    case 'payment_intent.payment_failed':
        const failedIntent = event.data.object;
        await handlePaymentIntentFailed(failedIntent);
        break;
    
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
};

const handlePaymentIntentSucceeded = async (paymentIntent) => {
  const { bookingId } = paymentIntent.metadata;

  if (!bookingId) {
    console.error('Webhook Error: Missing bookingId in payment intent metadata');
    return;
  }

  try {
    await prisma.$transaction(async (tx) => {
        // 1. Update Payment Record
        const payment = await tx.payment.update({
            where: { stripePaymentIntentId: paymentIntent.id },
            data: {
                paymentStatus: 'COMPLETED',
                paidAt: new Date(),
                stripeChargeId: paymentIntent.latest_charge,
                transactionId: paymentIntent.id,
            }
        });

        // 2. Update Booking Status
        const booking = await tx.booking.update({
            where: { id: bookingId },
            data: { status: 'CONFIRMED' },
            include: {
                tour: true
            }
        });

        // 3. Create Notification
        await tx.notification.create({
            data: {
                userId: booking.userId,
                type: 'PAYMENT',
                title: 'Payment Successful',
                message: `Your payment for ${booking.tour.title} has been confirmed via webhook. Booking #${booking.bookingNumber}`,
                link: `/bookings/${booking.id}`,
            }
        });
        
        console.log(`Successfully processed payment success for booking ${bookingId}`);
    });
  } catch (error) {
      console.error(`Error processing payment success webhook for booking ${bookingId}:`, error);
      // We don't throw here to avoid the webhook retrying indefinitely if it's a logic error 
      // (though transient DB errors might warrant a retry, for simplicity we log it)
  }
};

const handlePaymentIntentFailed = async (paymentIntent) => {
    const { bookingId } = paymentIntent.metadata;
    
    if (!bookingId) return;

    try {
        await prisma.payment.update({
            where: { stripePaymentIntentId: paymentIntent.id },
            data: {
                paymentStatus: 'FAILED',
            }
        });
        console.log(`Marked payment as failed for booking ${bookingId}`);
    } catch (error) {
        console.error(`Error processing payment failed webhook for booking ${bookingId}:`, error);
    }
}
