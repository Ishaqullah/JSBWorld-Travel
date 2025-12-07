import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { Calendar, Users, CreditCard, ArrowRight, ArrowLeft } from 'lucide-react';
import { getTourById } from '../../data/tours';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveBooking } = useBooking();
  const tour = getTourById(id);

  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    startDate: tour?.availableDates[0] || '',
    adults: 2,
    children: 0,
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    specialRequests: '',
  });

  if (!tour) {
    navigate('/tours');
    return null;
  }

  const adults = bookingData.adults;
  const children = bookingData.children;
  const tourPrice = tour.price * adults + tour.price * 0.5 * children;
  const taxesAndFees = tourPrice * 0.15;
  const total = tourPrice + taxesAndFees;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    const booking = {
      tourId: tour.id,
      tourTitle: tour.title,
      userId: user.id,
      ...bookingData,
      totalPrice: total,
    };
    navigate(`/payment/${tour.id}`, { state: { booking, total } });
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    s <= step
                      ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-20 h-1 mx-2 transition-all ${
                      s < step ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-20 mt-2 text-sm">
            <span className={step >= 1 ? 'text-primary-600 font-semibold' : 'text-gray-500'}>
              Select Details
            </span>
            <span className={step >= 2 ? 'text-primary-600 font-semibold' : 'text-gray-500'}>
              Your Information
            </span>
            <span className={step >= 3 ? 'text-primary-600 font-semibold' : 'text-gray-500'}>
              Review
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              {/* Step 1: Select Details */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Select Your Details</h2>

                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <select
                      className="input"
                      value={bookingData.startDate}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, startDate: e.target.value })
                      }
                    >
                      {tour.availableDates.map((date) => (
                        <option key={date} value={date}>
                          {format(new Date(date), 'MMMM dd, yyyy')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Adults (18+)</label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setBookingData({
                              ...bookingData,
                              adults: Math.max(1, bookingData.adults - 1),
                            })
                          }
                          className="w-10 h-10 rounded-lg border-2 border-primary-500 text-primary-600 font-bold hover:bg-primary-50"
                        >
                          -
                        </button>
                        <span className="text-xl font-bold w-12 text-center">
                          {bookingData.adults}
                        </span>
                        <button
                          onClick={() =>
                            setBookingData({
                              ...bookingData,
                              adults: Math.min(tour.maxGroupSize, bookingData.adults + 1),
                            })
                          }
                          className="w-10 h-10 rounded-lg border-2 border-primary-500 text-primary-600 font-bold hover:bg-primary-50"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Children (0-17)</label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setBookingData({
                              ...bookingData,
                              children: Math.max(0, bookingData.children - 1),
                            })
                          }
                          className="w-10 h-10 rounded-lg border-2 border-primary-500 text-primary-600 font-bold hover:bg-primary-50"
                        >
                          -
                        </button>
                        <span className="text-xl font-bold w-12 text-center">
                          {bookingData.children}
                        </span>
                        <button
                          onClick={() =>
                            setBookingData({
                              ...bookingData,
                              children: bookingData.children + 1,
                            })
                          }
                          className="w-10 h-10 rounded-lg border-2 border-primary-500 text-primary-600 font-bold hover:bg-primary-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Information */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Your Information</h2>
                  <Input
                    label="Full Name"
                    value={bookingData.name}
                    onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={bookingData.email}
                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      className="input min-h-[100px]"
                      value={bookingData.specialRequests}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, specialRequests: e.target.value })
                      }
                      placeholder="Any special dietary requirements, accessibility needs, etc."
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Review Your Booking</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tour</span>
                      <span className="font-semibold">{tour.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-semibold">
                        {format(new Date(bookingData.startDate), 'MMMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guests</span>
                      <span className="font-semibold">
                        {bookingData.adults} Adults, {bookingData.children} Children
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contact</span>
                      <span className="font-semibold">{bookingData.email}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                {step > 1 ? (
                  <Button onClick={handleBack} variant="outline" icon={ArrowLeft}>
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}
                {step < 3 ? (
                  <Button onClick={handleNext} icon={ArrowRight} iconPosition="right">
                    Continue
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} icon={CreditCard}>
                    Proceed to Payment
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Booking Summary</h3>
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                  <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-semibold mb-2">{tour.title}</h4>
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    {bookingData.startDate &&
                      format(new Date(bookingData.startDate), 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="mr-2" />
                    {adults + children} Guest{adults + children > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span>
                      ${tour.price} x {adults} adult{adults > 1 ? 's' : ''}
                    </span>
                    <span>${tour.price * adults}</span>
                  </div>
                  {children > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>
                        ${tour.price * 0.5} x {children} child{children > 1 ? 'ren' : ''}
                      </span>
                      <span>${tour.price * 0.5 * children}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Taxes & fees</span>
                    <span>${taxesAndFees.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  You won't be charged yet
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
