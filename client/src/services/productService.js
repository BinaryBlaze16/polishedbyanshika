import api from './api';

const productService = {
  getProducts: async (params) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProductBySlug: async (slug) => {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data.data || response.data.product || response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data.data || response.data.product || response.data;
  },

  getFeaturedProducts: async () => {
    const response = await api.get('/products/featured');
    return response.data.data || response.data.products || [];
  },

  getRelatedProducts: async (productId) => {
    const response = await api.get(`/products/${productId}/related`);
    return response.data.data || response.data.products || [];
  },

  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data.data || response.data.categories || [];
  },

  searchProducts: async (query) => {
    const response = await api.get('/products', { params: { search: query } });
    return response.data;
  },
};

export default productService;
