import api from './api';

export const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data.user;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data.user;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/users/change-password', {
      currentPassword,
      newPassword,
    });
    return response;
  },

  // Get wishlist
  getWishlist: async () => {
    const response = await api.get('/users/wishlist');
    return response.data.tours;
  },

  // Add to wishlist
  addToWishlist: async (tourId) => {
    const response = await api.post(`/users/wishlist/${tourId}`);
    return response;
  },

  // Remove from wishlist
  removeFromWishlist: async (tourId) => {
    const response = await api.delete(`/users/wishlist/${tourId}`);
    return response;
  },

  // Add to wishlist by email (for logged-out users)
  addToWishlistByEmail: async (email, tourId) => {
    const response = await api.post('/users/wishlist-by-email', { email, tourId });
    return response; // api interceptor already unwraps response.data
  },

  // Get notifications
  getNotifications: async (page = 1, limit = 20) => {
    const response = await api.get('/users/notifications', {
      params: { page, limit },
    });
    return response.data;
  },

  // Mark notification as read
  markNotificationAsRead: async (id) => {
    const response = await api.put(`/users/notifications/${id}/read`);
    return response;
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async () => {
    const response = await api.put('/users/notifications/read-all');
    return response;
  },
};

export const reviewService = {
  // Create review
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data.review;
  },

  // Get tour reviews
  getTourReviews: async (tourId, page = 1, limit = 10) => {
    const response = await api.get(`/reviews/tour/${tourId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Update review
  updateReview: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data.review;
  },

  // Delete review
  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response;
  },

  // Mark review as helpful
  markReviewHelpful: async (id) => {
    const response = await api.post(`/reviews/${id}/helpful`);
    return response;
  },
};
