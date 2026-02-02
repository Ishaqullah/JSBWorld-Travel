import api from './api';

// Note: api.js interceptor already returns response.data, so 'response' here is the parsed JSON body
export const paymentService = {
  // Create payment intent for card. Pass amountInCents so Stripe charges exactly what the user was shown.
  createPaymentIntent: async (bookingId, paymentMethod = 'CARD', amountInCents = null) => {
    const body = { bookingId, paymentMethod };
    if (amountInCents != null && amountInCents >= 50) body.amountInCents = amountInCents;
    const response = await api.post('/payments/create-intent', body);
    // Response is already { success, data: { clientSecret, ... } }
    return response.data;
  },

  // Create bank transfer invoice
  createBankTransferInvoice: async (bookingId) => {
    const response = await api.post('/payments/create-bank-transfer', { bookingId });
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

  // Submit bank transfer with receipt
  submitBankTransfer: async (bookingId, receiptFile) => {
    const formData = new FormData();
    formData.append('bookingId', bookingId);
    formData.append('receipt', receiptFile);
    
    const response = await api.post('/payments/bank-transfer', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get bank details for bank transfer
  getBankDetails: async () => {
    const response = await api.get('/payments/bank-details');
    return response.data;
  },
};

