import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Mail, 
  Phone,
  MapPin,
  X,
  Eye,
  CreditCard,
  Banknote,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User
} from 'lucide-react';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await adminService.getAllBookings();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-500/20 text-green-400';
      case 'PENDING': return 'bg-amber-500/20 text-amber-400';
      case 'CANCELLED': return 'bg-red-500/20 text-red-400';
      case 'COMPLETED': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPaymentTypeLabel = (booking) => {
    if (booking.isDepositPayment) {
      return { label: 'Deposit', color: 'bg-purple-500/20 text-purple-400' };
    }
    return { label: 'Full Payment', color: 'bg-blue-500/20 text-blue-400' };
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'deposit') return booking.isDepositPayment;
    if (filter === 'full') return !booking.isDepositPayment;
    return booking.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">All Bookings</h1>
          <p className="text-gray-400 mt-1">Manage all tour bookings</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
          >
            <option value="all">All Bookings</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="deposit">Deposit Only</option>
            <option value="full">Full Payment</option>
          </select>
          <div className="bg-primary-500/20 text-primary-400 px-4 py-2 rounded-lg">
            <span className="font-medium">{filteredBookings.length} Bookings</span>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      {filteredBookings.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-12 text-center">
          <Calendar className="mx-auto text-gray-500 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-white mb-2">No Bookings Found</h3>
          <p className="text-gray-400">No bookings match the selected filter.</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Booking</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Tour</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredBookings.map((booking) => {
                  const paymentType = getPaymentTypeLabel(booking);
                  return (
                    <tr key={booking.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm text-white">{booking.bookingNumber}</div>
                        <div className="text-xs text-gray-500">{formatDateTime(booking.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{booking.user?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-400 flex items-center gap-1">
                          <Mail size={12} />
                          {booking.user?.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white max-w-xs truncate">{booking.tour?.title || 'N/A'}</div>
                        <div className="text-sm text-gray-400">{booking.numberOfTravelers} travelers</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{formatDate(booking.tourDate?.startDate)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-white font-medium">{formatCurrency(booking.totalPrice)}</div>
                          <span className={`inline-block px-2 py-0.5 rounded text-xs ${paymentType.color}`}>
                            {paymentType.label}
                          </span>
                          {booking.isDepositPayment && booking.remainingBalance > 0 && (
                            <div className="text-xs text-amber-400">
                              Balance: {formatCurrency(booking.remainingBalance)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm transition-colors"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800">
                <div>
                  <h2 className="text-xl font-bold text-white">Booking Details</h2>
                  <p className="text-gray-400 text-sm">{selectedBooking.bookingNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-white p-2"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Status & Payment Type */}
                <div className="flex gap-3">
                  <span className={`px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                  <span className={`px-4 py-2 rounded-lg text-sm font-medium ${getPaymentTypeLabel(selectedBooking).color}`}>
                    {getPaymentTypeLabel(selectedBooking).label}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <User size={18} />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-gray-500 text-sm">Name</span>
                      <p className="text-white">{selectedBooking.user?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Email</span>
                      <p className="text-white flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        <a href={`mailto:${selectedBooking.user?.email}`} className="hover:text-primary-400">
                          {selectedBooking.user?.email || 'N/A'}
                        </a>
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Phone</span>
                      <p className="text-white flex items-center gap-2">
                        <Phone size={14} className="text-gray-400" />
                        {selectedBooking.user?.phone || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tour Info */}
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <MapPin size={18} />
                    Tour Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <span className="text-gray-500 text-sm">Tour</span>
                      <p className="text-white">{selectedBooking.tour?.title || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Tour Date</span>
                      <p className="text-white">{formatDate(selectedBooking.tourDate?.startDate)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Flight Option</span>
                      <p className="text-white capitalize">{selectedBooking.flightOption || 'Without'} Flight</p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <DollarSign size={18} />
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-gray-500 text-sm">Total Price</span>
                      <p className="text-white font-medium">{formatCurrency(selectedBooking.totalPrice)}</p>
                    </div>
                    {selectedBooking.isDepositPayment && (
                      <>
                        <div>
                          <span className="text-gray-500 text-sm">Deposit Paid</span>
                          <p className="text-green-400 font-medium">{formatCurrency(selectedBooking.depositAmount)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">Remaining Balance</span>
                          <p className="text-amber-400 font-medium">{formatCurrency(selectedBooking.remainingBalance)}</p>
                        </div>
                      </>
                    )}
                    <div>
                      <span className="text-gray-500 text-sm">Payment Method</span>
                      <p className="text-white flex items-center gap-2">
                        {selectedBooking.payment?.paymentMethod === 'CARD' ? (
                          <><CreditCard size={14} /> Card</>
                        ) : selectedBooking.payment?.paymentMethod === 'BANK_TRANSFER' ? (
                          <><Banknote size={14} /> Bank Transfer</>
                        ) : (
                          'N/A'
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Travelers */}
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Users size={18} />
                    Travelers ({selectedBooking.travelers?.length || 0})
                  </h3>
                  {selectedBooking.travelers && selectedBooking.travelers.length > 0 ? (
                    <div className="space-y-3">
                      {selectedBooking.travelers.map((traveler, index) => (
                        <div key={traveler.id || index} className="bg-gray-800 rounded-lg p-3 flex flex-wrap gap-4">
                          <div className="min-w-[150px]">
                            <span className="text-gray-500 text-xs">Name</span>
                            <p className="text-white text-sm">{traveler.fullName}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">Type</span>
                            <p className="text-white text-sm capitalize">{traveler.travelerType || 'Adult'}</p>
                          </div>
                          {traveler.age && (
                            <div>
                              <span className="text-gray-500 text-xs">Age</span>
                              <p className="text-white text-sm">{traveler.age}</p>
                            </div>
                          )}
                          {traveler.gender && (
                            <div>
                              <span className="text-gray-500 text-xs">Gender</span>
                              <p className="text-white text-sm capitalize">{traveler.gender}</p>
                            </div>
                          )}
                          {traveler.email && (
                            <div>
                              <span className="text-gray-500 text-xs">Email</span>
                              <p className="text-white text-sm">{traveler.email}</p>
                            </div>
                          )}
                          {traveler.phone && (
                            <div>
                              <span className="text-gray-500 text-xs">Phone</span>
                              <p className="text-white text-sm">{traveler.phone}</p>
                            </div>
                          )}
                          {traveler.passportNumber && (
                            <div>
                              <span className="text-gray-500 text-xs">Passport</span>
                              <p className="text-white text-sm">{traveler.passportNumber}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No traveler information available</p>
                  )}
                </div>

                {/* Special Requests */}
                {selectedBooking.specialRequests && (
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Special Requests</h3>
                    <p className="text-gray-300">{selectedBooking.specialRequests}</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-700 flex justify-end">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
