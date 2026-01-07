import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import { tourService } from '../../services/tourService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if redirected from booking page for payment
  const { from, returnToPayment, tourId } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      
      // Check if we need to redirect to payment with stored booking data
      if (returnToPayment && tourId) {
        const pendingBookingStr = sessionStorage.getItem('pendingBooking');
        if (pendingBookingStr) {
          try {
            const pendingBooking = JSON.parse(pendingBookingStr);
            
            // Fetch tour data to complete the booking object
            const tour = await tourService.getTourById(pendingBooking.tourId);
            
            const depositFeePerPerson = tour.depositFee ? parseFloat(tour.depositFee) : 0;
            const numberOfTravelers = pendingBooking.bookingData.adults + pendingBooking.bookingData.children;
            const totalDepositFee = depositFeePerPerson * numberOfTravelers;
            
            // Build the complete booking object
            const booking = {
              tourId: tour.id,
              tourDateId: pendingBooking.tourDateId,
              tourTitle: tour.title,
              userId: loggedInUser.id,
              ...pendingBooking.bookingData,
              flightOption: pendingBooking.flightOption,
              selectedAddOns: pendingBooking.selectedAddOns,
              addOnsTotal: pendingBooking.addOnsTotal,
              totalPrice: pendingBooking.total,
              isDepositPayment: pendingBooking.isDepositPayment,
              depositAmount: pendingBooking.isDepositPayment ? totalDepositFee : null,
              remainingBalance: pendingBooking.isDepositPayment ? (pendingBooking.total - totalDepositFee) : null,
              numberOfTravelers: numberOfTravelers,
              travelers: pendingBooking.travelers
            };
            
            // Clear the stored data
            sessionStorage.removeItem('pendingBooking');
            
            // Calculate payment amount
            const paymentAmount = pendingBooking.isDepositPayment ? totalDepositFee : pendingBooking.total;
            
            // Navigate to payment page with booking data
            navigate(`/payment/${tour.id}`, { 
              state: { 
                booking, 
                total: paymentAmount, 
                addOnsTotal: pendingBooking.addOnsTotal, 
                isDepositPayment: pendingBooking.isDepositPayment, 
                fullTotal: pendingBooking.total, 
                depositAmount: totalDepositFee, 
                remainingBalance: pendingBooking.total - totalDepositFee 
              } 
            });
            return;
          } catch (parseError) {
            console.error('Error processing pending booking:', parseError);
            sessionStorage.removeItem('pendingBooking');
          }
        }
      }
      
      // Default navigation - go to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 gradient-animated">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card glass className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              {returnToPayment 
                ? 'Please login to complete your booking'
                : 'Login to continue your adventure'}
            </p>
          </div>

          {returnToPayment && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <p className="text-blue-800 text-sm">
                Your booking details have been saved. Please login to proceed with payment.
              </p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start"
            >
              <AlertCircle className="text-red-600 mr-3 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-800 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

         

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              state={returnToPayment ? { returnToPayment, tourId } : undefined}
              className="font-semibold text-primary-600 hover:text-primary-700"
            >
              Sign up for free
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}

