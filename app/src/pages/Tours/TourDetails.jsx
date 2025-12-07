import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Heart,
} from 'lucide-react';
import { getTourById } from '../../data/tours';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';

export default function TourDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { setCurrentBooking } = useBooking();
  const tour = getTourById(id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [saved, setSaved] = useState(false);

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

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setCurrentBooking({ tour });
    navigate(`/booking/${tour.id}`);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % tour.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + tour.images.length) % tour.images.length);
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative rounded-2xl overflow-hidden h-96 group">
              <img
                src={tour.images[currentImageIndex]}
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
              {tour.images.length > 1 && (
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
                    {tour.images.map((_, index) => (
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
                      {tour.category}
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
                      <span className="text-gray-500 ml-1">({tour.reviewCount} reviews)</span>
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
              </div>
            </div>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">About This Tour</h2>
              <p className="text-gray-700 mb-6">{tour.description}</p>

              <h3 className="text-xl font-bold mb-3">Highlights</h3>
              <ul className="space-y-2 mb-6">
                {tour.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Itinerary */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Itinerary</h2>
              <div className="space-y-4">
                {tour.itinerary.map((day) => (
                  <div key={day.day} className="flex gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                      Day {day.day}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-1">{day.title}</h4>
                      <p className="text-gray-600">{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Included/Excluded */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Included</h3>
                <ul className="space-y-2">
                  {tour.included.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="text-green-500 mr-2 flex-shrink-0" size={18} />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Not Included</h3>
                <ul className="space-y-2">
                  {tour.excluded.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <X className="text-red-500 mr-2 flex-shrink-0" size={18} />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="p-6">
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-1">From</div>
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    ${tour.price}
                  </div>
                  <div className="text-sm text-gray-500">per person</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Available Dates</label>
                    <select className="input">
                      {tour.availableDates.map((date) => (
                        <option key={date} value={date}>
                          {new Date(date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button onClick={handleBookNow} variant="primary" className="w-full mb-4">
                  Book Now
                </Button>

                <p className="text-xs text-center text-gray-500">
                  Free cancellation up to 24 hours before the tour
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
