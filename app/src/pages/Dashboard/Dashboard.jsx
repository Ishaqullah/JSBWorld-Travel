import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, X, User, Mail, Phone, Loader2, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';

export default function Dashboard() {
  const { user, updateProfile } = useAuth();
  const { getUpcomingBookings, getPastBookings, cancelBooking, fetchMyBookings, loading } = useBooking();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetch user's bookings on mount
  useEffect(() => {
    if (user) {
      fetchMyBookings().catch(error => {
        console.error('Failed to fetch bookings:', error);
      });
    }
  }, [user, fetchMyBookings]);

  const upcomingBookings = getUpcomingBookings();
  const pastBookings = getPastBookings();

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({ name, phone });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(bookingId, 'User requested cancellation');
      } catch (error) {
        console.error('Failed to cancel booking:', error);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const BookingCard = ({ booking }) => {
    // Tour data is now included in the booking object from backend
    const tour = booking.tour || {};
    if (!tour.title) return null;

    const isUpcoming = booking.status === 'CONFIRMED' || booking.status === 'PENDING';

    return (
      <Card className="p-6">
        <div className="flex gap-4">
          <img
            src={tour.featuredImage || tour.image}
            alt={tour.title}
            className="w-32 h-32 rounded-lg object-cover"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-lg">{tour.title}</h3>
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <MapPin size={14} className="mr-1" />
                  {tour.location}
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  booking.status === 'CONFIRMED'
                    ? 'bg-green-100 text-green-700'
                    : booking.status === 'CANCELLED'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {booking.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-600">Booking ID:</span>
                <div className="font-semibold">{booking.id}</div>
              </div>
              <div>
                <span className="text-gray-600">Start Date:</span>
                <div className="font-semibold">
                  {booking.tourDate?.startDate 
                    ? new Date(booking.tourDate.startDate).toLocaleDateString()
                    : 'N/A'
                  }
                </div>
              </div>
              <div>
                <span className="text-gray-600">Travelers:</span>
                <div className="font-semibold">
                  {booking.numberOfTravelers || 0} Travelers
                </div>
              </div>
              <div>
                <span className="text-gray-600">Total Paid:</span>
                <div className="font-semibold text-primary-600">
                  ${booking.totalPrice ? booking.totalPrice : '0.00'}
                </div>
              </div>
            </div>

            {isUpcoming && (
              <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                icon={Eye}
                onClick={() => setSelectedBooking(booking)}
              >
                View Details
              </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCancelBooking(booking.id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  Cancel Booking
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="text-center mb-6">
                <img
                  src={user?.avatarUrl}
                  alt={user?.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 ring-4 ring-primary-100"
                />
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      icon={User}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                    />
                    <Input
                      icon={Phone}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleUpdateProfile}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setIsEditing(false);
                          setName(user?.name || '');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold">{user?.name}</h2>
                    <p className="text-gray-600">{user?.email}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-4"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  </>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="font-semibold">
                    {upcomingBookings.length + pastBookings.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Upcoming Trips</span>
                  <span className="font-semibold">{upcomingBookings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold">
                    {new Date(user?.createdAt).getFullYear()}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Bookings */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'upcoming'
                    ? 'bg-gradient-to-r from-secondary-300 to-secondary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Upcoming ({upcomingBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'past'
                    ? 'bg-gradient-to-r from-secondary-300 to-secondary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Past ({pastBookings.length})
              </button>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              {loading ? (
                <Card className="p-12 text-center">
                  <Loader2 className="mx-auto mb-4 text-primary-500 animate-spin" size={48} />
                  <p className="text-gray-600">Loading your bookings...</p>
                </Card>
              ) : activeTab === 'upcoming' ? (
                upcomingBookings.length > 0 ? (
                  upcomingBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                ) : (
                  <Card className="p-12 text-center">
                    <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
                    <h3 className="text-xl font-semibold mb-2">No upcoming bookings</h3>
                    <p className="text-gray-600 mb-6">
                      Start planning your next adventure!
                    </p>
                    <Button onClick={() => (window.location.href = '/tours')}>
                      Browse Tours
                    </Button>
                  </Card>
                )
              ) : pastBookings.length > 0 ? (
                pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-gray-600">No past bookings</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold">Booking Details</h2>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Tour Info */}
              <div className="flex gap-4">
                <img
                  src={selectedBooking.tour?.featuredImage || selectedBooking.tour?.image}
                  alt={selectedBooking.tour?.title}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-bold text-lg">{selectedBooking.tour?.title}</h3>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <MapPin size={14} className="mr-1" />
                    {selectedBooking.tour?.location}
                  </div>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    selectedBooking.status === 'CONFIRMED'
                      ? 'bg-green-100 text-green-700'
                      : selectedBooking.status === 'CANCELLED'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedBooking.status}
                  </span>
                </div>
              </div>
              
              {/* Booking Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Booking Number</div>
                  <div className="font-semibold">{selectedBooking.bookingNumber}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Tour Date</div>
                  <div className="font-semibold">
                    {selectedBooking.tourDate?.startDate 
                      ? new Date(selectedBooking.tourDate.startDate).toLocaleDateString('en-US', {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })
                      : 'N/A'
                    }
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Travelers</div>
                  <div className="font-semibold">
                    {selectedBooking.adultsCount || 0} Adults, {selectedBooking.childrenCount || 0} Children
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Flight Option</div>
                  <div className="font-semibold capitalize">
                    {selectedBooking.flightOption === 'with' ? 'With Flight' : 'Without Flight'}
                  </div>
                </div>
              </div>
              
              {/* Pricing */}
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Total Price</span>
                  <span className="font-bold text-lg text-primary-600">
                    ${parseFloat(selectedBooking.totalPrice || 0).toFixed(2)}
                  </span>
                </div>
                {selectedBooking.isDepositPayment && (
                  <>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-gray-600">Deposit Paid</span>
                      <span className="font-medium text-green-600">
                        ${parseFloat(selectedBooking.depositAmount || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining Balance</span>
                      <span className="font-medium text-amber-600">
                        ${parseFloat(selectedBooking.remainingBalance || 0).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>
              
              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div className="border-t pt-4">
                  <div className="text-sm text-gray-600 mb-2">Special Requests</div>
                  <p className="text-gray-700">{selectedBooking.specialRequests}</p>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <Button onClick={() => setSelectedBooking(null)} className="w-full">
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
