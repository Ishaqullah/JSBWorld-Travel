import api from './api';

export const tourService = {
  // Get all tours with filters
  getAllTours: async (filters = {}) => {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });

    const response = await api.get(`/tours?${params.toString()}`);
    return response.data;
  },

  // Get single tour by ID or slug
  getTourById: async (identifier) => {
    const response = await api.get(`/tours/${identifier}`);
    return response.data.tour;
  },

  // Get tours by category
  getToursByCategory: async (categorySlug, page = 1, limit = 10) => {
    const response = await api.get('/tours', {
      params: { category: categorySlug, page, limit },
    });
    return response.data;
  },

  // Create tour (Admin only)
  createTour: async (tourData) => {
    const response = await api.post('/tours', tourData);
    return response.data.tour;
  },

  // Update tour (Admin only)
  updateTour: async (id, tourData) => {
    const response = await api.put(`/tours/${id}`, tourData);
    return response.data.tour;
  },

  // Delete tour (Admin only)
  deleteTour: async (id) => {
    const response = await api.delete(`/tours/${id}`);
    return response;
  },
};

export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data.categories;
  },

  // Create category (Admin only)
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data.category;
  },
};
