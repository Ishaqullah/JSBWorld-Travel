import api from './api';

export const authService = {
  // Sign up new user
  signup: async (email, password, name) => {
    const response = await api.post('/auth/signup', { email, password, name });
    if (response.success && response.data.token) {
      localStorage.setItem('travecations_token', response.data.token);
      localStorage.setItem('travecations_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.success && response.data.token) {
      localStorage.setItem('travecations_token', response.data.token);
      localStorage.setItem('travecations_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    if (response.success) {
      localStorage.setItem('travecations_user', JSON.stringify(response.data.user));
    }
    return response.data.user;
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('travecations_token');
      localStorage.removeItem('travecations_user');
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response;
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response;
  },
};
