import api from './api';

export const reviewService = {
  // Create new review for a tour
  createReview: async (tourId, reviewData) => {
    const response = await api.post('/reviews', {
      tourId,
      ...reviewData,
    });
    return response.data.review;
  },

  // Get all reviews for a specific tour
  getTourReviews: async (tourId, page = 1, limit = 10) => {
    const response = await api.get(`/reviews/tour/${tourId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get user's own reviews
  getMyReviews: async () => {
    const response = await api.get('/reviews/my-reviews');
    return response.data.reviews;
  },

  // Update a review
  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data.review;
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response;
  },

  // Get review by ID
  getReviewById: async (reviewId) => {
    const response = await api.get(`/reviews/${reviewId}`);
    return response.data.review;
  },
};
