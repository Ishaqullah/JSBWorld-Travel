import api from './api';

// Note: api.js interceptor already returns response.data, so 'response' here is the parsed JSON body
export const bookingService = {
  // Create new booking (or return existing pending booking)
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    // Response is already { success, message, data: { booking, isExisting } }
    return response.data.booking;
  },

  // Get booking by ID
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data.booking;
  },

  // Get user's bookings
  getMyBookings: async (filters = {}) => {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });

    const response = await api.get(`/bookings/my-bookings?${params.toString()}`);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id, cancellationReason) => {
    const response = await api.put(`/bookings/${id}/cancel`, { cancellationReason });
    return response.data.booking;
  },

  // Update booking status (Admin only)
  updateBookingStatus: async (id, status) => {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data.booking;
  },
};

