import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, CreditCard, Building2, Upload, Clock } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { paymentService } from '../../services/paymentService';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CARD_FEE_PERCENTAGE = 0.04; // 4%

// Bank Transfer Form Component
const BankTransferForm = ({ bookingId, bookingNumber, total, onSuccess }) => {
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const bankDetails = {
    bankName: 'First National Bank',
    accountName: 'Travecations Ltd',
    accountNumber: '1234567890',
    sortCode: '12-34-56',
    swiftBic: 'FNBKUS33',
    currency: 'USD',
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!receiptFile) {
      setError('Please upload a payment receipt');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await paymentService.submitBankTransfer(bookingId, receiptFile);
      onSuccess();
    } catch (err) {
      console.error('Error submitting bank transfer:', err);
      setError(err.message || 'Failed to submit bank transfer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Bank Details */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
        <h4 className="font-semibold text-blue-900 mb-4">Bank Account Details</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Bank Name:</span>
            <p className="font-medium">{bankDetails.bankName}</p>
          </div>
          <div>
            <span className="text-gray-600">Account Name:</span>
            <p className="font-medium">{bankDetails.accountName}</p>
          </div>
          <div>
            <span className="text-gray-600">Account Number:</span>
            <p className="font-medium">{bankDetails.accountNumber}</p>
          </div>
          <div>
            <span className="text-gray-600">Sort Code:</span>
            <p className="font-medium">{bankDetails.sortCode}</p>
          </div>
          <div>
            <span className="text-gray-600">SWIFT/BIC:</span>
            <p className="font-medium">{bankDetails.swiftBic}</p>
          </div>
          <div>
            <span className="text-gray-600">Amount:</span>
            <p className="font-bold text-primary-600">${total?.toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Reference:</strong> Please use <span className="font-mono bg-blue-100 px-2 py-1 rounded">{bookingNumber || 'Your Booking Number'}</span> as your payment reference
          </p>
        </div>
      </div>

      {/* Upload Receipt */}
      <form onSubmit={handleSubmit}>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          {receiptPreview ? (
            <div className="space-y-4">
              <img 
                src={receiptPreview} 
                alt="Receipt preview" 
                className="max-h-48 mx-auto rounded-lg shadow-md"
              />
              <p className="text-sm text-gray-600">{receiptFile.name}</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Image
              </Button>
            </div>
          ) : (
            <div 
              className="cursor-pointer py-8"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Upload your payment receipt</p>
              <p className="text-sm text-gray-400">Click to browse or drag and drop</p>
              <p className="text-xs text-gray-400 mt-2">PNG, JPG, GIF up to 5MB</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center text-sm">
            <AlertCircle size={16} className="mr-2" />
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-6"
          loading={isSubmitting}
          disabled={!receiptFile || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Bank Transfer'}
        </Button>
      </form>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Clock className="text-amber-600 mt-0.5" size={20} />
          <div>
            <p className="font-medium text-amber-800">Pending Approval</p>
            <p className="text-sm text-amber-700 mt-1">
              After submitting, your booking will be pending until our team verifies your payment receipt. 
              This usually takes 1-2 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

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
        return_url: window.location.origin + '/payment/success',
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
        {isProcessing ? 'Processing...' : `Pay $${total?.toFixed(2)}`}
      </Button>
    </form>
  );
};

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveBooking } = useBooking();
  const { 
    booking: initialBooking, 
    total: initialTotal, 
    addOnsTotal = 0,
    isDepositPayment = false,
    fullTotal = 0,
    depositAmount = 0,
    remainingBalance = 0
  } = location.state || {};

  // Use ref to store booking to persist across re-renders and prevent duplicates
  const bookingRef = useRef(initialBooking);
  const isCreatingBookingRef = useRef(false);
  const bookingCreatedRef = useRef(false);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('CARD');
  const [clientSecret, setClientSecret] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [bankTransferSuccess, setBankTransferSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingReady, setBookingReady] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    baseAmount: initialTotal || 0,
    cardFee: 0,
    totalAmount: initialTotal || 0,
  });

  // Calculate fee when payment method changes
  useEffect(() => {
    if (initialTotal) {
      const baseAmount = initialTotal;
      const cardFee = selectedPaymentMethod === 'CARD' ? baseAmount * CARD_FEE_PERCENTAGE : 0;
      const totalAmount = baseAmount + cardFee;
      setPaymentDetails({ baseAmount, cardFee, totalAmount });
    }
  }, [selectedPaymentMethod, initialTotal]);

  useEffect(() => {
    if (!initialBooking) {
      navigate('/tours');
      return;
    }
  }, [initialBooking, navigate]);

  // Create booking ONCE on mount - this ensures we always have a booking ID
  const createBookingOnce = useCallback(async () => {
    // Guard: If booking already has an ID, we're done
    if (bookingRef.current?.id) {
      console.log('Booking already exists with ID:', bookingRef.current.id);
      setBookingReady(true);
      return bookingRef.current.id;
    }

    // Guard: Prevent concurrent booking creation
    if (isCreatingBookingRef.current || bookingCreatedRef.current) {
      console.log('Booking creation already in progress or completed, skipping...');
      return null;
    }

    isCreatingBookingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      console.log('Creating new booking...');
      const savedBooking = await saveBooking({
        ...bookingRef.current,
        userId: user.id,
        status: 'PENDING'
      });
      
      // Store the booking data in ref
      bookingRef.current = { 
        ...bookingRef.current, 
        id: savedBooking.id, 
        bookingNumber: savedBooking.bookingNumber 
      };
      bookingCreatedRef.current = true;
      setBookingReady(true);
      console.log('Booking created with ID:', savedBooking.id);
      return savedBooking.id;
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to create booking. Please try again.');
      return null;
    } finally {
      setLoading(false);
      isCreatingBookingRef.current = false;
    }
  }, [saveBooking, user?.id]);

  // Initialize Stripe payment intent (only for card payments)
  const initializeStripePayment = useCallback(async (bookingId) => {
    if (!bookingId) return;
    
    setLoading(true);
    setError(null);

    try {
      const result = await paymentService.createPaymentIntent(bookingId, 'CARD');
      setClientSecret(result.clientSecret);
      setPaymentDetails({
        baseAmount: result.baseAmount,
        cardFee: result.cardFee,
        totalAmount: result.totalAmount,
      });
    } catch (err) {
      console.error('Error initializing Stripe payment:', err);
      setError(err.response?.data?.message || 'Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount: Create booking once, then initialize card payment by default
  useEffect(() => {
    const initialize = async () => {
      if (!initialBooking) return;
      
      const bookingId = await createBookingOnce();
      if (bookingId && selectedPaymentMethod === 'CARD') {
        await initializeStripePayment(bookingId);
      }
    };
    
    initialize();
  }, []); // Empty dependency - run only once on mount

  // Handle payment method change
  const handlePaymentMethodChange = async (method) => {
    if (method === selectedPaymentMethod) return;
    
    setSelectedPaymentMethod(method);
    setError(null);
    setClientSecret(''); // Clear any existing Stripe session
    
    // If switching to card, initialize Stripe payment
    if (method === 'CARD' && bookingRef.current?.id) {
      await initializeStripePayment(bookingRef.current.id);
    }
    // For bank transfer, booking is already created, no further action needed
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      await paymentService.confirmPayment(paymentIntentId, bookingRef.current.id);
      setPaymentSuccess(true);
    } catch (err) {
      console.error('Error confirming payment:', err);
      setError('Payment confirmed but failed to update system.');
    }
  };

  if (!initialBooking) return null;

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
              {initialBooking.email}.
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

  // Bank Transfer Submitted Success Screen
  if (bankTransferSuccess) {
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
              className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Clock className="text-amber-600" size={48} />
            </motion.div>
            <h2 className="text-3xl font-bold mb-4">Booking Submitted!</h2>
            <p className="text-gray-600 mb-4">
              Your bank transfer receipt has been uploaded successfully.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
              <p className="text-amber-800 text-sm">
                <strong>Pending Approval:</strong> Our team will verify your payment receipt within 1-2 business days. 
                You'll receive an email confirmation once your booking is confirmed.
              </p>
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
        <p className="text-gray-600 mb-8">Select your preferred payment method</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Method Selection & Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Show loader while booking is being created */}
            {!bookingReady && loading && (
              <Card className="p-12">
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                  <p className="text-gray-600 font-medium">Setting up your booking...</p>
                  <p className="text-sm text-gray-400 mt-2">Please wait while we prepare your payment</p>
                </div>
              </Card>
            )}

            {/* Show error with refresh option if booking creation failed */}
            {!bookingReady && !loading && error && (
              <Card className="p-12">
                <div className="flex flex-col items-center justify-center py-8">
                  <AlertCircle size={48} className="text-red-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Process</h3>
                  <p className="text-gray-600 text-center mb-6 max-w-md">
                    {error || 'Something went wrong while setting up your booking. Please try again.'}
                  </p>
                  <Button 
                    variant="primary"
                    onClick={async () => {
                      setError(null);
                      const bookingId = await createBookingOnce();
                      if (bookingId && selectedPaymentMethod === 'CARD') {
                        await initializeStripePayment(bookingId);
                      }
                    }}
                  >
                    Refresh & Try Again
                  </Button>
                </div>
              </Card>
            )}

            {/* Show payment options only when booking is ready */}
            {bookingReady && (
              <>
                {/* Payment Method Selection */}
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4">Select Payment Method</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Card Payment Option */}
                    <button
                      type="button"
                      onClick={() => handlePaymentMethodChange('CARD')}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedPaymentMethod === 'CARD'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <CreditCard className={selectedPaymentMethod === 'CARD' ? 'text-primary-600' : 'text-gray-600'} size={24} />
                        <span className="font-semibold">Credit/Debit Card</span>
                      </div>
                      <p className="text-sm text-gray-500">Visa, Mastercard, Amex</p>
                      <div className="mt-2 text-sm text-amber-600 font-medium">
                        +4% processing fee
                      </div>
                    </button>

                    {/* Bank Transfer Option */}
                    <button
                      type="button"
                      onClick={() => handlePaymentMethodChange('BANK_TRANSFER')}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedPaymentMethod === 'BANK_TRANSFER'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Building2 className={selectedPaymentMethod === 'BANK_TRANSFER' ? 'text-primary-600' : 'text-gray-600'} size={24} />
                        <span className="font-semibold">Bank Transfer</span>
                      </div>
                      <p className="text-sm text-gray-500">Direct bank payment</p>
                      <div className="mt-2 text-sm text-green-600 font-medium">
                        No additional fees
                      </div>
                    </button>
                  </div>
                </Card>

                {/* Payment Form */}
                <Card className="p-8">
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                  ) : selectedPaymentMethod === 'BANK_TRANSFER' ? (
                    // Bank Transfer Form
                    <BankTransferForm 
                      bookingId={bookingRef.current?.id}
                      bookingNumber={bookingRef.current?.bookingNumber}
                      total={paymentDetails.baseAmount}
                      onSuccess={() => setBankTransferSuccess(true)}
                    />
                  ) : clientSecret ? (
                    // Stripe Card Payment
                    <Elements options={{ clientSecret, appearance: { theme: 'stripe' } }} stripe={stripePromise}>
                      <CheckoutForm booking={initialBooking} total={paymentDetails.totalAmount} onSuccess={handlePaymentSuccess} />
                    </Elements>
                  ) : error ? (
                    <div className="text-center py-8">
                      <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                      <p className="text-red-600">{error}</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={async () => {
                          setError(null);
                          const bookingId = await createBookingOnce();
                          if (bookingId) {
                            await initializeStripePayment(bookingId);
                          }
                        }}
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 text-center mt-6">
                    By completing this booking, you agree to our Terms of Service and Privacy Policy
                  </p>
                </Card>
              </>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div>
                  <div className="font-semibold">{initialBooking.tourTitle}</div>
                  <div className="text-sm text-gray-600">
                    {initialBooking.adults} Adult{initialBooking.adults > 1 ? 's' : ''}
                    {initialBooking.children > 0 && `, ${initialBooking.children} Child${initialBooking.children > 1 ? 'ren' : ''}`}
                  </div>
                </div>
                <div className="text-sm text-gray-600">{initialBooking.startDate}</div>
              </div>

              <div className="space-y-2 mb-6 pb-6 border-t border-b border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${(paymentDetails.baseAmount / 1.15)?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxes & Fees</span>
                  <span>${(paymentDetails.baseAmount - paymentDetails.baseAmount / 1.15)?.toFixed(2)}</span>
                </div>
                {paymentDetails.cardFee > 0 && (
                  <div className="flex justify-between text-sm text-amber-600">
                    <span>Card Processing Fee (4%)</span>
                    <span>${paymentDetails.cardFee.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="font-bold">{isDepositPayment ? 'Deposit Amount' : 'Total'}</span>
                <span className="text-2xl font-bold text-primary-600">${paymentDetails.totalAmount?.toFixed(2)}</span>
              </div>

              {isDepositPayment && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700">Full Booking Total</span>
                    <span className="font-medium">${fullTotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700">Deposit (paying now)</span>
                    <span className="font-medium text-primary-600">${depositAmount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-amber-200">
                    <span className="text-gray-700 font-medium">Remaining Balance</span>
                    <span className="font-bold text-amber-700">${remainingBalance?.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-amber-700 mt-3">Remaining balance is due before your tour start date.</p>
                </div>
              )}

              {selectedPaymentMethod === 'BANK_TRANSFER' && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm text-green-700">
                  <strong>No fees!</strong> Bank transfer does not include any processing fees.
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
