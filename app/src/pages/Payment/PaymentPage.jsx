import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveBooking } = useBooking();
  const { booking, total } = location.state || {};

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!booking) {
    navigate('/tours');
    return null;
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Save booking
    const completedBooking = saveBooking({
      ...booking,
      userId: user.id,
    });

    setProcessing(false);
    setPaymentSuccess(true);
  };

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
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="text-sm text-gray-600 mb-2">Booking Reference</div>
              <div className="text-2xl font-bold text-primary-600">
                {`BK${Date.now().toString().slice(-8)}`}
              </div>
            </div>
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <div className="flex items-center mb-6 p-4 bg-blue-50 rounded-lg">
                <Lock className="text-blue-600 mr-3" size={20} />
                <span className="text-sm text-blue-800">
                  Your payment information is secure and encrypted
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Card Number"
                  icon={CreditCard}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />

                <Input
                  label="Cardholder Name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="JOHN DOE"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry Date"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                  <Input
                    label="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="123"
                    maxLength={3}
                    required
                  />
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <Button type="submit" variant="primary" className="w-full" loading={processing}>
                    {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                  </Button>
                </div>
              </form>

              <p className="text-xs text-gray-500 text-center mt-4">
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
