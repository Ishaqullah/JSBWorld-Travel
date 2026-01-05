import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  MapPin,
  Star,
  Clock,
  Users,
  Calendar,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Heart,
  FileEdit,
} from 'lucide-react';
import { tourService } from '../../services/tourService';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';

// Pricing Table Component - Uses prices from database
function PricingTable({ dates, duration, onReserve }) {
  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + duration * 24 * 60 * 60 * 1000);
    return `${format(start, 'd MMM yyyy')}\n${format(end, 'd MMM yyyy')}`;
  };

  const isSoldOut = (date) => {
    return date.status === 'FULL' || date.availableSlots - date.bookedSlots <= 0;
  };

  const hasEarlyBird = (date) => {
    if (!date.earlyBirdDeadline) return false;
    return new Date() < new Date(date.earlyBirdDeadline);
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        {/* Header */}
        <thead>
          <tr className="bg-gray-900 text-white">
            <th className="py-4 px-6 text-left font-semibold rounded-tl-lg">Dates</th>
            <th className="py-4 px-6 text-center font-semibold" colSpan={2}>
              <div className="border-r border-gray-700 pr-4">Without Flight</div>
            </th>
            <th className="py-4 px-6 text-center font-semibold" colSpan={2}>Land and Flight</th>
            <th className="py-4 px-6 rounded-tr-lg"></th>
          </tr>
        </thead>
        
        {/* Body */}
        <tbody>
          {dates.map((date, index) => {
            const soldOut = isSoldOut(date);
            const showEarlyBird = hasEarlyBird(date);
            
            // Read prices directly from database
            const priceWithout = parseFloat(date.priceWithoutFlight);
            const priceWith = parseFloat(date.priceWithFlight);
            const earlyBirdWithout = date.earlyBirdPriceWithout ? parseFloat(date.earlyBirdPriceWithout) : null;
            const earlyBirdWith = date.earlyBirdPriceWith ? parseFloat(date.earlyBirdPriceWith) : null;
            const earlyBirdDeadline = date.earlyBirdDeadline ? new Date(date.earlyBirdDeadline) : null;
            
            return (
              <tr 
                key={date.id || index} 
                className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${soldOut ? 'opacity-60' : ''}`}
              >
                {/* Date Column */}
                <td className="py-4 px-6">
                  <div className="whitespace-pre-line text-sm">
                    {formatDateRange(date.startDate, date.endDate)}
                  </div>
                  {soldOut && (
                    <span className="text-red-500 text-xs font-medium">(Sold out)</span>
                  )}
                </td>
                
                {/* Without Flight - Before */}
                <td className="py-4 px-4 text-center border-l border-gray-200">
                  {showEarlyBird && earlyBirdWithout && !soldOut ? (
                    <div>
                      <div className="text-xs text-gray-500">Before</div>
                      <div className="text-xs text-gray-400">{format(earlyBirdDeadline, 'd MMM yyyy')}</div>
                      <div className="text-red-500 font-bold">${earlyBirdWithout.toLocaleString()}</div>
                    </div>
                  ) : (
                    <div className="text-red-500 font-bold">${priceWithout.toLocaleString()}</div>
                  )}
                </td>
                
                {/* Without Flight - After */}
                <td className="py-4 px-4 text-center border-r border-gray-300">
                  {showEarlyBird && earlyBirdWithout && !soldOut ? (
                    <div>
                      <div className="text-xs text-gray-500">After</div>
                      <div className="text-xs text-gray-400">{format(earlyBirdDeadline, 'd MMM yyyy')}</div>
                      <div className="text-red-500 font-bold">${priceWithout.toLocaleString()}</div>
                    </div>
                  ) : null}
                </td>
                
                {/* Land and Flight - Before */}
                <td className="py-4 px-4 text-center">
                  {showEarlyBird && earlyBirdWith && !soldOut ? (
                    <div>
                      <div className="text-xs text-gray-500">Before</div>
                      <div className="text-xs text-gray-400">{format(earlyBirdDeadline, 'd MMM yyyy')}</div>
                      <div className="text-red-500 font-bold">${earlyBirdWith.toLocaleString()}</div>
                    </div>
                  ) : (
                    <div className="text-red-500 font-bold">${priceWith.toLocaleString()}</div>
                  )}
                </td>
                
                {/* Land and Flight - After */}
                <td className="py-4 px-4 text-center">
                  {showEarlyBird && earlyBirdWith && !soldOut ? (
                    <div>
                      <div className="text-xs text-gray-500">After</div>
                      <div className="text-xs text-gray-400">{format(earlyBirdDeadline, 'd MMM yyyy')}</div>
                      <div className="text-red-500 font-bold">${priceWith.toLocaleString()}</div>
                    </div>
                  ) : null}
                </td>
                
                {/* Reserve Button - Blue theme */}
                <td className="py-4 px-6">
                  {!soldOut ? (
                    <button
                      onClick={() => onReserve(date)}
                      className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Reserve
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">Unavailable</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function TourDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { setCurrentBooking } = useBooking();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [expandedItineraryDays, setExpandedItineraryDays] = useState({ 1: true }); // First day expanded by default

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const data = await tourService.getTourById(id);
        setTour(data);
      } catch (error) {
        console.error('Error fetching tour:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tour details...</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tour not found</h2>
          <Button onClick={() => navigate('/tours')}>Back to Tours</Button>
        </div>
      </div>
    );
  }

  const handleReserve = (selectedDate) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setCurrentBooking({ tour, selectedDateId: selectedDate.id });
    navigate(`/booking/${tour.id}`);
  };

  const nextImage = () => {
    const images = tour.images || [];
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    const images = tour.images || [];
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Get images array - handle both API and static data formats
  const images = tour.images?.map(img => img.imageUrl || img) || [tour.featuredImage];
  const currentImage = images[currentImageIndex] || tour.featuredImage;
  
  // Get tour details - handle both API and static data formats
  const highlights = tour.highlights?.map(h => h.highlight || h) || [];
  const included = tour.inclusions?.filter(i => i.type === 'INCLUDED').map(i => i.item) || tour.included || [];
  const excluded = tour.inclusions?.filter(i => i.type === 'EXCLUDED').map(i => i.item) || tour.excluded || [];
  const itinerary = tour.itinerary?.map(i => ({ day: i.dayNumber || i.day, title: i.title, description: i.description, imageUrl: i.imageUrl })) || [];
  const tourDates = tour.dates || [];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content - Full Width */}
        <div className="space-y-8">
          {/* Image Gallery */}
          <div className="relative rounded-2xl overflow-hidden h-96 group">
            <img
              src={currentImage}
              alt={tour.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setSaved(!saved)}
              className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <Heart
                size={24}
                className={saved ? 'text-red-500 fill-red-500' : 'text-gray-600'}
              />
            </button>
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? 'bg-white w-8'
                          : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Title and Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full font-medium">
                    {tour.category?.name || tour.category}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                    {tour.difficulty}
                  </span>
                </div>
                <h1 className="text-4xl font-display font-bold mb-2">{tour.title}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center text-amber-500">
                    <Star size={20} fill="currentColor" className="mr-1" />
                    <span className="font-semibold">{tour.rating}</span>
                    <span className="text-gray-500 ml-1">({tour.reviewCount || tour._count?.reviews || 0} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={18} className="mr-1" />
                    {tour.location}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-6 py-4 border-y border-gray-200">
              <div className="flex items-center">
                <Clock size={20} className="text-primary-600 mr-2" />
                <div>
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="font-semibold">{tour.duration} days</div>
                </div>
              </div>
              <div className="flex items-center">
                <Users size={20} className="text-primary-600 mr-2" />
                <div>
                  <div className="text-sm text-gray-600">Group Size</div>
                  <div className="font-semibold">Max {tour.maxGroupSize}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar size={20} className="text-primary-600 mr-2" />
                <div>
                  <div className="text-sm text-gray-600">Starting From</div>
                  <div className="font-semibold text-primary-600">${parseFloat(tour.price).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Table */}
          {tourDates.length > 0 && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Available Dates & Pricing</h2>
              <PricingTable 
                dates={tourDates} 
                duration={tour.duration}
                onReserve={handleReserve}
              />
              <p className="text-xs text-gray-500 mt-4 text-center">
                Free cancellation up to 24 hours before the tour
              </p>
            </Card>
          )}

          {/* Add Custom Itinerary Button */}
          <div className="flex justify-center">
            <Button
              onClick={() => navigate('/custom-itinerary')}
              variant="outline"
              icon={FileEdit}
              className="px-8"
            >
              Add Custom Itinerary
            </Button>
          </div>

          {/* Two Column Layout for Details */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Description */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">About This Tour</h2>
                <p className="text-gray-700 mb-6">{tour.description}</p>

                {highlights.length > 0 && (
                  <>
                    <h3 className="text-xl font-bold mb-3">Highlights</h3>
                    <ul className="space-y-2 mb-6">
                      {highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={20} />
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Card>

              {/* Included/Excluded */}
              <div className="grid md:grid-cols-2 gap-6">
                {included.length > 0 && (
                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">Included</h3>
                    <ul className="space-y-2">
                      {included.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="text-green-500 mr-2 flex-shrink-0" size={18} />
                          <span className="text-gray-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
                {excluded.length > 0 && (
                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">Not Included</h3>
                    <ul className="space-y-2">
                      {excluded.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <X className="text-red-500 mr-2 flex-shrink-0" size={18} />
                          <span className="text-gray-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
              </div>

              {/* Add-ons Section */}
              {tour.addOns && tour.addOns.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Optional Add-ons</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {tour.addOns.map((addOn) => (
                      <div 
                        key={addOn.id} 
                        className="flex items-start gap-3 p-4 bg-gradient-to-r from-secondary-50 to-primary-50 rounded-lg border border-secondary-100"
                      >
                        {addOn.imageUrl && (
                          <img 
                            src={addOn.imageUrl} 
                            alt={addOn.name}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-gray-900">{addOn.name}</h4>
                            <span className="text-primary-600 font-bold whitespace-nowrap">
                              +${parseFloat(addOn.price).toFixed(0)}
                            </span>
                          </div>
                          {addOn.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{addOn.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    Add-ons can be selected during the booking process
                  </p>
                </Card>
              )}
            </div>

            {/* Right Column - Itinerary */}
            {itinerary.length > 0 && (
              <Card className="p-6 h-fit">
                <h2 className="text-2xl font-bold mb-6">Itinerary</h2>
                <div className="relative">
                  {/* Timeline vertical line */}
                  <div className="absolute left-3 top-6 bottom-6 w-0.5 bg-gray-200"></div>
                  
                  <div className="space-y-2">
                    {itinerary.map((day, index) => {
                      const dayNumber = day.day || index + 1;
                      const isExpanded = expandedItineraryDays[dayNumber];
                      
                      return (
                        <div key={dayNumber} className="relative">
                          {/* Timeline marker */}
                          <div className="absolute left-0 top-4 w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center z-10">
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
                              className="w-full flex items-center justify-between py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors rounded-lg px-2"
                            >
                              <h4 className="font-bold text-lg text-gray-800">
                                Day {dayNumber} - {day.title}
                              </h4>
                              {isExpanded ? (
                                <ChevronUp size={20} className="text-gray-500 flex-shrink-0" />
                              ) : (
                                <ChevronDown size={20} className="text-gray-500 flex-shrink-0" />
                              )}
                            </button>
                            
                            {isExpanded && (
                              <div className="py-4 space-y-4">
                                {/* Day image */}
                                {day.imageUrl && (
                                  <div className="rounded-lg overflow-hidden shadow-md">
                                    <img
                                      src={day.imageUrl}
                                      alt={`Day ${dayNumber} - ${day.title}`}
                                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                )}
                                {/* Day description */}
                                <p className="text-gray-600 text-sm leading-relaxed">
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
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
