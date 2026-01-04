import api from './api';

export const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data.data;
  },

  // Tours
  getTours: async (params = {}) => {
    const response = await api.get('/admin/tours', { params });
    return response.data.data;
  },

  getTourById: async (id) => {
    const response = await api.get(`/admin/tours/${id}`);
    return response.data.data.tour;
  },

  createTour: async (tourData) => {
    const response = await api.post('/admin/tours', tourData);
    return response.data.data.tour;
  },

  updateTour: async (id, tourData) => {
    const response = await api.put(`/admin/tours/${id}`, tourData);
    return response.data.data.tour;
  },

  deleteTour: async (id) => {
    const response = await api.delete(`/admin/tours/${id}`);
    return response.data;
  },

  // Tour Dates
  getTourDates: async (tourId) => {
    const response = await api.get(`/admin/tours/${tourId}/dates`);
    return response.data.data.dates;
  },

  createTourDate: async (tourId, dateData) => {
    const response = await api.post(`/admin/tours/${tourId}/dates`, dateData);
    return response.data.data.date;
  },

  updateTourDate: async (dateId, dateData) => {
    const response = await api.put(`/admin/tour-dates/${dateId}`, dateData);
    return response.data.data.date;
  },

  deleteTourDate: async (dateId) => {
    const response = await api.delete(`/admin/tour-dates/${dateId}`);
    return response.data;
  },

  // Tour Itinerary
  updateTourItinerary: async (tourId, itinerary) => {
    const response = await api.put(`/admin/tours/${tourId}/itinerary`, { itinerary });
    return response.data.data.itinerary;
  },

  deleteTourItineraryItem: async (itemId) => {
    const response = await api.delete(`/admin/tour-itinerary/${itemId}`);
    return response.data;
  },

  // Tour Images
  updateTourImages: async (tourId, images) => {
    const response = await api.put(`/admin/tours/${tourId}/images`, { images });
    return response.data.data.images;
  },

  // Tour Highlights
  updateTourHighlights: async (tourId, highlights) => {
    const response = await api.put(`/admin/tours/${tourId}/highlights`, { highlights });
    return response.data.data.highlights;
  },

  // Tour Inclusions
  updateTourInclusions: async (tourId, inclusions, exclusions) => {
    const response = await api.put(`/admin/tours/${tourId}/inclusions`, { inclusions, exclusions });
    return response.data.data.inclusions;
  },

  // Tour Add-ons
  updateTourAddOns: async (tourId, addOns) => {
    const response = await api.put(`/admin/tours/${tourId}/addons`, { addOns });
    return response.data.data.addOns;
  },

  // ========== Bookings ==========
  getAllBookings: async (params = {}) => {
    const response = await api.get('/admin/bookings', { params });
    return response.data.data;
  },

  // Categories
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data.data.categories;
  },

  // ========== Bank Transfer Management ==========
  
  // Get pending bank transfers
  getPendingBankTransfers: async () => {
    const response = await api.get('/admin/payments/pending-transfers');
    return response.data.data;
  },

  // Approve bank transfer
  approveBankTransfer: async (paymentId) => {
    const response = await api.post(`/admin/payments/${paymentId}/approve`);
    return response.data;
  },

  // Reject bank transfer
  rejectBankTransfer: async (paymentId, reason = '') => {
    const response = await api.post(`/admin/payments/${paymentId}/reject`, { reason });
    return response.data;
  },
};
