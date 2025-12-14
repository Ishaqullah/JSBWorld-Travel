import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { paymentService } from '../../services/paymentService';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ booking, total, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/payment/success', // Not used in this flow but required
      },
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        await onSuccess(paymentIntent.id);
      } catch (err) {
        setMessage('Payment succeeded but failed to update booking. Please contact support.');
        setIsProcessing(false);
      }
    } else {
      setMessage('An unexpected error occurred.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {message && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center text-sm">
          <AlertCircle size={16} className="mr-2" />
          {message}
        </div>
      )}
      <Button 
        type="submit" 
        variant="primary" 
        className="w-full" 
        loading={isProcessing}
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </Button>
    </form>
  );
};

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveBooking } = useBooking();
  const { booking, total } = location.state || {};

  const [clientSecret, setClientSecret] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!booking) {
      navigate('/tours');
      return;
    }

    const initPayment = async () => {
      try {
        // Create payment intent on backend
        // We need a booking ID first. If the booking isn't saved yet, we might need to save it as PENDING first.
        // Looking at the previous code, saveBooking was called AFTER payment.
        // But paymentService.createPaymentIntent requires a bookingId.
        // So we must save the booking first as PENDING/AWAITING_PAYMENT.
        
        // Let's check if we have a booking ID in location.state (maybe it was passed from a "Pay Now" button on a pending booking)
        // If not, we should probably create the booking now.
        
        let bookingId = booking.id;
        
        if (!bookingId) {
             // If we don't have an ID, it means it's a new booking flow.
             // We should save it first.
             const savedBooking = await saveBooking({
                 ...booking,
                 userId: user.id,
                 status: 'PENDING' // Assuming PENDING is a valid status for unpaid bookings
             });
             bookingId = savedBooking.id;
             // Update local state with the saved booking to have the ID
             booking.id = bookingId; 
        }

        const { clientSecret } = await paymentService.createPaymentIntent(bookingId);
        setClientSecret(clientSecret);
      } catch (err) {
        console.error('Error initializing payment:', err);
        setError('Failed to initialize payment. Please try again.');
      }
    };

    initPayment();
  }, [booking, navigate, saveBooking, user.id]);

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      await paymentService.confirmPayment(paymentIntentId, booking.id);
      setPaymentSuccess(true);
    } catch (err) {
      console.error('Error confirming payment:', err);
      setError('Payment confirmed but failed to update system.');
    }
  };

  if (!booking) return null;

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <Card className="p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="text-green-600" size={48} />
            </motion.div>
            <h2 className="text-3xl font-bold mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-8">
              Your booking has been confirmed. We've sent a confirmation email to{' '}
              {booking.email}.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => navigate('/tours')}>
                Browse More Tours
              </Button>
              <Button variant="primary" className="flex-1" onClick={() => navigate('/dashboard')}>
                View Dashboard
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">Complete Your Payment</h1>
        <p className="text-gray-600 mb-8">Enter your payment details to confirm your booking</p>

        {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
                <AlertCircle size={20} className="mr-2" />
                {error}
            </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              {clientSecret ? (
                <Elements options={{ clientSecret, appearance: { theme: 'stripe' } }} stripe={stripePromise}>
                  <CheckoutForm booking={booking} total={total} onSuccess={handlePaymentSuccess} />
                </Elements>
              ) : (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              )}
              
              <p className="text-xs text-gray-500 text-center mt-6">
                By completing this booking, you agree to our Terms of Service and Privacy Policy
              </p>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div>
                  <div className="font-semibold">{booking.tourTitle}</div>
                  <div className="text-sm text-gray-600">
                    {booking.adults} Adult{booking.adults > 1 ? 's' : ''}
                    {booking.children > 0 && `, ${booking.children} Child${booking.children > 1 ? 'ren' : ''}`}
                  </div>
                </div>
                <div className="text-sm text-gray-600">{booking.startDate}</div>
              </div>

              <div className="space-y-2 mb-6 pb-6 border-t border-b border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${(total / 1.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxes & Fees</span>
                  <span>${(total - total / 1.15).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-bold">Total</span>
                <span className="text-2xl font-bold text-primary-600">${total.toFixed(2)}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
