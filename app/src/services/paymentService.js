import api from './api';

export const paymentService = {
  // Create payment intent
  createPaymentIntent: async (bookingId) => {
    const response = await api.post('/payments/create-intent', { bookingId });
    return response.data;
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId, bookingId) => {
    const response = await api.post('/payments/confirm', { paymentIntentId, bookingId });
    return response.data;
  },

  // Get payment details
  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data.payment;
  },

  // Process refund (Admin only)
  processRefund: async (id, amount, reason) => {
    const response = await api.post(`/payments/${id}/refund`, { amount, reason });
    return response.data;
  },
};
