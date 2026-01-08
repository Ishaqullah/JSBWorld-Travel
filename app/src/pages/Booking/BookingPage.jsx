import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Users, CreditCard, ArrowRight, ArrowLeft, Plus, Check, ChevronDown, ChevronUp, Minus } from 'lucide-react';
import { tourService } from '../../services/tourService';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentBooking } = useBooking();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [flightOption, setFlightOption] = useState('without'); // 'without' or 'with'
  const [expandedTravelers, setExpandedTravelers] = useState({});
  const [expandedItineraryDays, setExpandedItineraryDays] = useState({ 1: true }); // First day expanded by default
  const [rooms, setRooms] = useState([{ adults: 2, children: 0 }]);
  const [travelers, setTravelers] = useState([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [travelerErrors, setTravelerErrors] = useState({});
  const travelersFormRef = useRef(null);
  const [bookingData, setBookingData] = useState({
    tourDateId: '',
    startDate: '',
    adults: 2,
    children: 0,
    infants: 0,
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    specialRequests: '',
  });

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const data = await tourService.getTourById(id);
        setTour(data);
        if (data.dates && data.dates.length > 0) {
          // Use pre-selected date from context if available
          const preSelectedDate = currentBooking?.selectedDateId 
            ? data.dates.find(d => d.id === currentBooking.selectedDateId)
            : null;
            
          const initialDate = preSelectedDate || data.dates[0];

          setBookingData(prev => ({
            ...prev,
            tourDateId: initialDate.id,
            startDate: initialDate.startDate
          }));
        }
      } catch (error) {
        console.error('Error fetching tour:', error);
        navigate('/tours');
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id, navigate]);

  // Initialize travelers when adults/children count changes
  useEffect(() => {
    const newTravelers = [];
    for (let i = 0; i < bookingData.adults; i++) {
      newTravelers.push({
        type: 'adult',
        index: i + 1,
        fullName: i === 0 ? (user?.name || '') : '',
        email: i === 0 ? (user?.email || '') : '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        nationality: '',
        passportNumber: '',
        passportExpiry: '',
        dietaryRequirements: '',
      });
    }
    for (let i = 0; i < bookingData.children; i++) {
      newTravelers.push({
        type: 'child',
        index: i + 1,
        fullName: '',
        dateOfBirth: '',
        gender: '',
        nationality: '',
        passportNumber: '',
        passportExpiry: '',
        dietaryRequirements: '',
      });
    }
    setTravelers(newTravelers);
  }, [bookingData.adults, bookingData.children, user?.name, user?.email]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-50">Loading...</div>;
  }

  if (!tour) return null;

  const adults = bookingData.adults;
  const children = bookingData.children;
  
  // Find selected date and calculate prices dynamically
  const selectedDate = tour.dates?.find(d => d.id === bookingData.tourDateId);
  const isEarlyBird = selectedDate?.earlyBirdDeadline && new Date() < new Date(selectedDate.earlyBirdDeadline);

  const getAdultPrice = () => {
    if (!selectedDate) return parseFloat(tour.price || 0);
    
    if (flightOption === 'without') {
      return isEarlyBird && selectedDate.earlyBirdPriceWithout 
        ? parseFloat(selectedDate.earlyBirdPriceWithout) 
        : parseFloat(selectedDate.priceWithoutFlight);
    } else { // flightOption === 'with'
      return isEarlyBird && selectedDate.earlyBirdPriceWith 
        ? parseFloat(selectedDate.earlyBirdPriceWith) 
        : parseFloat(selectedDate.priceWithFlight);
    }
  };

  const getChildPrice = () => {
    if (!selectedDate) return parseFloat(tour.price || 0) * 0.5;

    if (flightOption === 'without') {
      return parseFloat(selectedDate.childPriceWithout || 0);
    } else {
      return parseFloat(selectedDate.childPriceWithFlight || 0);
    }
  };

  const adultPrice = getAdultPrice();
  const childPrice = getChildPrice();
  const basePrice = (adultPrice * adults) + (childPrice * children);
  
  // Calculate add-ons total (price is per person, multiply by number of travelers)
  const numberOfTravelers = bookingData.adults + bookingData.children;
  const addOnsTotal = selectedAddOns.reduce((sum, selected) => {
    const addOn = tour.addOns?.find(a => a.id === selected.addOnId);
    return sum + (addOn ? parseFloat(addOn.price) * selected.quantity * numberOfTravelers : 0);
  }, 0);
  
  // No taxes & fees - only 4% card fee will be added at payment if paying by card
  const total = basePrice + addOnsTotal;

  const handleAddOnToggle = (addOnId) => {
    const exists = selectedAddOns.find(s => s.addOnId === addOnId);
    if (exists) {
      setSelectedAddOns(selectedAddOns.filter(s => s.addOnId !== addOnId));
    } else {
      setSelectedAddOns([...selectedAddOns, { addOnId, quantity: 1 }]);
    }
  };

  const isAddOnSelected = (addOnId) => {
    return selectedAddOns.some(s => s.addOnId === addOnId);
  };

  // Validate traveler required fields
  const validateTravelers = () => {
    const errors = {};
    let hasErrors = false;
    
    travelers.forEach((traveler, idx) => {
      const key = `${traveler.type}-${traveler.index}`;
      const travelerErrors = {};
      
      // Required fields for all travelers
      if (!traveler.fullName?.trim()) {
        travelerErrors.fullName = 'Full name is required';
        hasErrors = true;
      }
      if (!traveler.dateOfBirth) {
        travelerErrors.dateOfBirth = 'Date of birth is required';
        hasErrors = true;
      }
      if (!traveler.gender) {
        travelerErrors.gender = 'Gender is required';
        hasErrors = true;
      }
      if (!traveler.nationality?.trim()) {
        travelerErrors.nationality = 'Nationality is required';
        hasErrors = true;
      }
      if (!traveler.passportNumber?.trim()) {
        travelerErrors.passportNumber = 'Passport number is required';
        hasErrors = true;
      }
      if (!traveler.passportExpiry) {
        travelerErrors.passportExpiry = 'Passport expiry is required';
        hasErrors = true;
      }
      
      // Additional required fields for adults
      if (traveler.type === 'adult') {
        if (!traveler.email?.trim()) {
          travelerErrors.email = 'Email is required';
          hasErrors = true;
        }
        if (!traveler.phone?.trim()) {
          travelerErrors.phone = 'Phone is required';
          hasErrors = true;
        }
      }
      
      if (Object.keys(travelerErrors).length > 0) {
        errors[key] = travelerErrors;
      }
    });
    
    setTravelerErrors(errors);
    return !hasErrors;
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate travelers before proceeding
      if (!validateTravelers()) {
        // Expand all travelers with errors
        const newExpanded = { ...expandedTravelers };
        Object.keys(travelerErrors).forEach(key => {
          newExpanded[key] = true;
        });
        // Also expand any travelers that have newly detected errors
        travelers.forEach((traveler) => {
          const key = `${traveler.type}-${traveler.index}`;
          const hasError = !traveler.fullName?.trim() || !traveler.dateOfBirth || !traveler.gender || 
                           !traveler.nationality?.trim() || !traveler.passportNumber?.trim() || !traveler.passportExpiry ||
                           (traveler.type === 'adult' && (!traveler.email?.trim() || !traveler.phone?.trim()));
          if (hasError) {
            newExpanded[key] = true;
          }
        });
        setExpandedTravelers(newExpanded);
        
        // Scroll to travelers form
        if (travelersFormRef.current) {
          travelersFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
      }
    }
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (isDepositPayment = false) => {
    // Check if user is logged in before proceeding to payment
    if (!user) {
      // Store all booking data in sessionStorage before redirecting to login
      const pendingBookingData = {
        tourId: tour.id,
        tourDateId: bookingData.tourDateId,
        startDate: bookingData.startDate,
        bookingData: bookingData,
        flightOption,
        selectedAddOns,
        travelers,
        termsAccepted,
        isDepositPayment,
        addOnsTotal,
        total,
      };
      sessionStorage.setItem('pendingBooking', JSON.stringify(pendingBookingData));
      
      // Redirect to login with return information
      navigate('/login', { 
        state: { 
          from: `/booking/${tour.id}`,
          returnToPayment: true,
          tourId: tour.id
        } 
      });
      return;
    }

    const depositFeePerPerson = tour.depositFee ? parseFloat(tour.depositFee) : 0;
    const numberOfTravelers = bookingData.adults + bookingData.children;
    const totalDepositFee = depositFeePerPerson * numberOfTravelers;
    
    const booking = {
      tourId: tour.id,
      tourDateId: bookingData.tourDateId,
      tourTitle: tour.title,
      userId: user.id,
      ...bookingData,
      flightOption,
      selectedAddOns: selectedAddOns,
      addOnsTotal: addOnsTotal,
      totalPrice: total,
      isDepositPayment,
      depositAmount: isDepositPayment ? totalDepositFee : null,
      remainingBalance: isDepositPayment ? (total - totalDepositFee) : null,
      numberOfTravelers: numberOfTravelers,
      travelers: travelers.map(t => ({
        type: t.type,
        fullName: t.fullName || '',
        dateOfBirth: t.dateOfBirth || null,
        age: t.dateOfBirth ? calculateAge(t.dateOfBirth) : (t.type === 'adult' ? 30 : 10),
        gender: t.gender || 'Not Specified',
        nationality: t.nationality || '',
        passportNumber: t.passportNumber || '',
        passportExpiry: t.passportExpiry || null,
        email: t.email || '',
        phone: t.phone || '',
        dietaryRequirements: t.dietaryRequirements || ''
      }))
    };
    
    const paymentAmount = isDepositPayment ? totalDepositFee : total;
    navigate(`/payment/${tour.id}`, { state: { booking, total: paymentAmount, addOnsTotal, isDepositPayment, fullTotal: total, depositAmount: totalDepositFee, remainingBalance: total - totalDepositFee } });
  };

  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8 mt-10">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    s <= step
                      ? 'bg-gradient-to-br from-secondary-300 to-secondary-500 text-white'
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
                  <h2 className="text-2xl font-bold mb-6">Choose an option (Land and Flight / Without Flight)</h2>

                  {/* Flight Option Toggle */}
                  <div className="flex rounded-lg overflow-hidden border border-gray-200 w-fit">
                    <button
                      type="button"
                      onClick={() => setFlightOption('without')}
                      className={`px-8 py-3 font-semibold transition-all ${
                        flightOption === 'without'
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Without Flight
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlightOption('with')}
                      className={`px-8 py-3 font-semibold transition-all ${
                        flightOption === 'with'
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Land and Flight
                    </button>
                  </div>

                  {/* Travelers Card */}
                  <Card className="p-6">
                    <div className="space-y-4">
                      {/* Adults */}
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Adults</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setBookingData({ ...bookingData, adults: Math.max(1, bookingData.adults - 1) })}
                            className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-16 text-center text-lg font-semibold">{bookingData.adults}</span>
                          <button
                            type="button"
                            onClick={() => setBookingData({ ...bookingData, adults: Math.min(tour?.maxGroupSize || 10, bookingData.adults + 1) })}
                            className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Children</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setBookingData({ ...bookingData, children: Math.max(0, bookingData.children - 1) })}
                            className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-16 text-center text-lg font-semibold">{bookingData.children}</span>
                          <button
                            type="button"
                            onClick={() => setBookingData({ ...bookingData, children: bookingData.children + 1 })}
                            className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Infants */}
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Infants</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setBookingData({ ...bookingData, infants: Math.max(0, bookingData.infants - 1) })}
                            className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-16 text-center text-lg font-semibold">{bookingData.infants}</span>
                          <button
                            type="button"
                            onClick={() => setBookingData({ ...bookingData, infants: bookingData.infants + 1 })}
                            className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>

                  
                  {/* <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Room Allocation & Single Supplement</h3>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium text-gray-700">Number of Rooms</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setRooms(rooms.length > 1 ? rooms.slice(0, -1) : rooms)}
                          className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-16 text-center text-lg font-semibold">{rooms.length}</span>
                        <button
                          type="button"
                          onClick={() => setRooms([...rooms, { adults: 1, children: 0 }])}
                          className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                   
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="py-2 px-3 text-left font-semibold">Room</th>
                          <th className="py-2 px-3 text-center font-semibold">Adults</th>
                          <th className="py-2 px-3 text-center font-semibold">Children</th>
                          <th className="py-2 px-3 text-center font-semibold">Total</th>
                          <th className="py-2 px-3 text-right font-semibold">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rooms.map((room, idx) => (
                          <tr key={idx} className="border-b border-gray-100">
                            <td className="py-3 px-3 font-medium">Room {idx + 1}</td>
                            <td className="py-3 px-3">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newRooms = [...rooms];
                                    newRooms[idx].adults = Math.max(1, room.adults - 1);
                                    setRooms(newRooms);
                                  }}
                                  className="w-8 h-8 border border-gray-300 rounded text-sm flex items-center justify-center hover:bg-gray-50"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center">{room.adults}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newRooms = [...rooms];
                                    newRooms[idx].adults = room.adults + 1;
                                    setRooms(newRooms);
                                  }}
                                  className="w-8 h-8 border border-gray-300 rounded text-sm flex items-center justify-center hover:bg-gray-50"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newRooms = [...rooms];
                                    newRooms[idx].children = Math.max(0, room.children - 1);
                                    setRooms(newRooms);
                                  }}
                                  className="w-8 h-8 border border-gray-300 rounded text-sm flex items-center justify-center hover:bg-gray-50"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center">{room.children}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newRooms = [...rooms];
                                    newRooms[idx].children = room.children + 1;
                                    setRooms(newRooms);
                                  }}
                                  className="w-8 h-8 border border-gray-300 rounded text-sm flex items-center justify-center hover:bg-gray-50"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center">{room.adults + room.children}</td>
                            <td className="py-3 px-3 text-right font-semibold">$0.00</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                   
                    <div className="mt-4 p-3 bg-cyan-50 rounded-lg border-l-4 border-cyan-400">
                      <span className="text-gray-700">Total Single Supplement: <strong>$0.00</strong></span>
                    </div>
                  </Card> */}

                  {/* Traveler Details Accordions */}
                  <div className="space-y-2" ref={travelersFormRef}>
                    {travelers.map((traveler, idx) => {
                      const key = `${traveler.type}-${traveler.index}`;
                      const isExpanded = expandedTravelers[key];
                      const label = traveler.type === 'adult' ? `Adult ${traveler.index}` : `Child ${traveler.index}`;
                      const errors = travelerErrors[key] || {};
                      const hasErrors = Object.keys(errors).length > 0;
                      
                      return (
                        <Card key={key} className={`overflow-hidden ${hasErrors ? 'border-red-300 border-2' : ''}`}>
                          <button
                            type="button"
                            onClick={() => setExpandedTravelers({ ...expandedTravelers, [key]: !isExpanded })}
                            className={`w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${hasErrors ? 'bg-red-50' : ''}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-800">{label}</span>
                              {hasErrors && <span className="text-xs text-red-600 font-medium">• Missing required fields</span>}
                            </div>
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                          
                          {isExpanded && (
                            <div className="px-6 pb-6 space-y-4 border-t border-gray-100">
                              <div className="grid md:grid-cols-2 gap-4 pt-4">
                                <div>
                                  <Input
                                    label="Full Name"
                                    value={traveler.fullName}
                                    onChange={(e) => {
                                      const newTravelers = [...travelers];
                                      newTravelers[idx].fullName = e.target.value;
                                      setTravelers(newTravelers);
                                    }}
                                    required
                                    className={errors.fullName ? 'border-red-500' : ''}
                                  />
                                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                </div>
                                <div>
                                  <Input
                                    label="Date of Birth"
                                    type="date"
                                    value={traveler.dateOfBirth}
                                    onChange={(e) => {
                                      const newTravelers = [...travelers];
                                      newTravelers[idx].dateOfBirth = e.target.value;
                                      setTravelers(newTravelers);
                                    }}
                                    required
                                    className={errors.dateOfBirth ? 'border-red-500' : ''}
                                  />
                                  {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                                </div>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">Gender <span className="text-red-500">*</span></label>
                                  <select
                                    className={`input ${errors.gender ? 'border-red-500' : ''}`}
                                    value={traveler.gender}
                                    onChange={(e) => {
                                      const newTravelers = [...travelers];
                                      newTravelers[idx].gender = e.target.value;
                                      setTravelers(newTravelers);
                                    }}
                                    required
                                  >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                  </select>
                                  {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                                </div>
                                <div>
                                  <Input
                                    label="Nationality"
                                    value={traveler.nationality}
                                    onChange={(e) => {
                                      const newTravelers = [...travelers];
                                      newTravelers[idx].nationality = e.target.value;
                                      setTravelers(newTravelers);
                                    }}
                                    required
                                    className={errors.nationality ? 'border-red-500' : ''}
                                  />
                                  {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
                                </div>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <Input
                                    label="Passport Number"
                                    value={traveler.passportNumber}
                                    onChange={(e) => {
                                      const newTravelers = [...travelers];
                                      newTravelers[idx].passportNumber = e.target.value;
                                      setTravelers(newTravelers);
                                    }}
                                    required
                                    className={errors.passportNumber ? 'border-red-500' : ''}
                                  />
                                  {errors.passportNumber && <p className="text-red-500 text-xs mt-1">{errors.passportNumber}</p>}
                                </div>
                                <div>
                                  <Input
                                    label="Passport Expiry"
                                    type="date"
                                    value={traveler.passportExpiry}
                                    onChange={(e) => {
                                      const newTravelers = [...travelers];
                                      newTravelers[idx].passportExpiry = e.target.value;
                                      setTravelers(newTravelers);
                                    }}
                                    required
                                    className={errors.passportExpiry ? 'border-red-500' : ''}
                                  />
                                  {errors.passportExpiry && <p className="text-red-500 text-xs mt-1">{errors.passportExpiry}</p>}
                                </div>
                              </div>
                              {traveler.type === 'adult' && (
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <Input
                                      label="Email"
                                      type="email"
                                      value={traveler.email}
                                      onChange={(e) => {
                                        const newTravelers = [...travelers];
                                        newTravelers[idx].email = e.target.value;
                                        setTravelers(newTravelers);
                                      }}
                                      required
                                      className={errors.email ? 'border-red-500' : ''}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                  </div>
                                  <div>
                                    <Input
                                      label="Phone"
                                      type="tel"
                                      value={traveler.phone}
                                      onChange={(e) => {
                                        const newTravelers = [...travelers];
                                        newTravelers[idx].phone = e.target.value;
                                        setTravelers(newTravelers);
                                      }}
                                      required
                                      className={errors.phone ? 'border-red-500' : ''}
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                  </div>
                                </div>
                              )}
                              <Input
                                label="Dietary Requirements / Special Requests (Optional)"
                                value={traveler.dietaryRequirements}
                                onChange={(e) => {
                                  const newTravelers = [...travelers];
                                  newTravelers[idx].dietaryRequirements = e.target.value;
                                  setTravelers(newTravelers);
                                }}
                              />
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>

                  {/* Add-ons Section */}
                  {tour.addOns && tour.addOns.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h3 className="text-xl font-bold mb-4">Other options to personalize your trip</h3>
                      <p className="text-gray-600 text-sm mb-6">
                        Customize your trip by adding the following extras. Please note that all add-ons must be added at least 30 days before departure.
                      </p>
                      <div className="space-y-4">
                        {tour.addOns.map((addOn) => (
                          <div
                            key={addOn.id}
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                              isAddOnSelected(addOn.id)
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {addOn.imageUrl && (
                              <img
                                src={addOn.imageUrl}
                                alt={addOn.name}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold">{addOn.name}</h4>
                              {addOn.description && (
                                <p className="text-sm text-gray-600 mt-1">{addOn.description}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-800">${parseFloat(addOn.price).toFixed(0)}/person</div>
                              <button
                                type="button"
                                onClick={() => handleAddOnToggle(addOn.id)}
                                className={`mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  isAddOnSelected(addOn.id)
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-primary-500 text-white hover:bg-primary-600'
                                }`}
                              >
                                {isAddOnSelected(addOn.id) ? (
                                  <span className="flex items-center gap-1">
                                    <Check size={16} /> Added
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <Plus size={16} /> Add
                                  </span>
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                    {selectedAddOns.length > 0 && (
                      <div className="pt-4 border-t border-gray-200">
                        <span className="text-gray-600 block mb-2">Selected Add-ons:</span>
                        <ul className="space-y-1">
                          {selectedAddOns.map(selected => {
                            const addOn = tour.addOns?.find(a => a.id === selected.addOnId);
                            return addOn ? (
                              <li key={selected.addOnId} className="flex justify-between text-sm">
                                <span>{addOn.name} x {numberOfTravelers} travelers</span>
                                <span className="font-semibold">${(parseFloat(addOn.price) * numberOfTravelers).toFixed(2)}</span>
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Collapsible Itinerary Section */}
                  {tour.itinerary && tour.itinerary.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h3 className="text-xl font-bold mb-6">Itinerary</h3>
                      <div className="relative">
                        {/* Timeline vertical line */}
                        <div className="absolute left-3 top-6 bottom-6 w-0.5 bg-gray-200"></div>
                        
                        <div className="space-y-2">
                          {tour.itinerary.map((day, index) => {
                            const dayNumber = day.dayNumber || index + 1;
                            const isExpanded = expandedItineraryDays[dayNumber];
                            
                            return (
                              <div key={day.id || dayNumber} className="relative">
                                {/* Timeline marker */}
                                <div className="absolute left-0 top-4 w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center z-10">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                                
                                {/* Day content */}
                                <div className="ml-10">
                                  <button
                                    type="button"
                                    onClick={() => setExpandedItineraryDays(prev => ({
                                      ...prev,
                                      [dayNumber]: !prev[dayNumber]
                                    }))}
                                    className="w-full flex items-center justify-between py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                  >
                                    <h4 className="font-semibold text-gray-800">
                                      Day {dayNumber} - {day.title}
                                    </h4>
                                    {isExpanded ? (
                                      <ChevronUp size={20} className="text-gray-500" />
                                    ) : (
                                      <ChevronDown size={20} className="text-gray-500" />
                                    )}
                                  </button>
                                  
                                  {isExpanded && (
                                    <div className="py-4 space-y-4">
                                      {/* Day image */}
                                      {day.imageUrl && (
                                        <div className="rounded-lg overflow-hidden">
                                          <img
                                            src={day.imageUrl}
                                            alt={`Day ${dayNumber} - ${day.title}`}
                                            className="w-full h-48 object-cover"
                                          />
                                        </div>
                                      )}
                                      {/* Day description */}
                                      <p className="text-gray-700 text-sm leading-relaxed">
                                        {day.description}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col mt-8 pt-6 border-t border-gray-200">
                {step > 1 && (
                  <div className="mb-4">
                    <Button onClick={handleBack} variant="outline" icon={ArrowLeft}>
                      Back
                    </Button>
                  </div>
                )}
                {step < 3 ? (
                  <div className="flex justify-end">
                    <Button onClick={handleNext} icon={ArrowRight} iconPosition="right">
                      Continue
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Deposit Fee Info */}
                    {tour.depositFee && parseFloat(tour.depositFee) > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-700">Deposit Fee (per person)</span>
                          <span className="font-semibold">${parseFloat(tour.depositFee).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">Total Deposit Fee</span>
                          <span className="font-bold text-primary-600">${(parseFloat(tour.depositFee) * (bookingData.adults + bookingData.children)).toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Terms and Conditions */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-700">
                        I accept the <a href="/terms-of-service" target="_blank" className="text-primary-600 hover:underline font-medium">Terms and Conditions</a>
                      </label>
                    </div>
                    
                    {/* Payment Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {tour.depositFee && parseFloat(tour.depositFee) > 0 && (
                        <Button 
                          onClick={() => handleSubmit(true)} 
                          variant="outline"
                          className="flex-1"
                          disabled={!termsAccepted}
                        >
                          Proceed with Deposit
                        </Button>
                      )}
                      <Button 
                        onClick={() => handleSubmit(false)} 
                        icon={CreditCard}
                        className="flex-1"
                        disabled={!termsAccepted}
                      >
                        Proceed with Full Payment
                      </Button>
                    </div>
                    
                    {!termsAccepted && (
                      <p className="text-sm text-amber-600 text-center">Please accept the Terms and Conditions to proceed</p>
                    )}
                  </div>
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
                  <img src={tour.featuredImage || (tour.images && tour.images[0] ? tour.images[0].imageUrl : '')} alt={tour.title} className="w-full h-full object-cover" />
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
                      ${adultPrice.toFixed(0)} x {adults} adult{adults > 1 ? 's' : ''}
                    </span>
                    <span>${(adultPrice * adults).toFixed(2)}</span>
                  </div>
                  {children > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>
                        ${childPrice.toFixed(0)} x {children} child{children > 1 ? 'ren' : ''}
                      </span>
                      <span>${(childPrice * children).toFixed(2)}</span>
                    </div>
                  )}
                  {addOnsTotal > 0 && (
                    <div className="flex justify-between text-sm text-primary-600">
                      <span>Add-ons</span>
                      <span>${addOnsTotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Card payment fee (if applicable)</span>
                    <span>+4%</span>
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
