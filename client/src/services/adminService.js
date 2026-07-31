import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getAllOrders: async (params) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  updateOrderStatus: async (id, data) => {
    const response = await api.put(`/admin/orders/${id}/status`, data);
    return response.data;
  },

  verifyPayment: async (id, data) => {
    const response = await api.put(`/admin/orders/${id}/verify-payment`, data);
    return response.data;
  },

  // Products API routes match backend /api/products
  getProducts: async (params) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  createProduct: async (data) => {
    const isFormData = data instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await api.post('/products', data, config);
    return response.data;
  },

  updateProduct: async (id, data) => {
    const isFormData = data instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await api.put(`/products/${id}`, data, config);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  toggleProductVisibility: async (id) => {
    const response = await api.patch(`/products/${id}/toggle`);
    return response.data;
  },

  getAllUsers: async (params) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  getUserDetails: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  toggleUserStatus: async (id) => {
    const response = await api.patch(`/admin/users/${id}/toggle-status`);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  getAllCustomRequests: async (params) => {
    const response = await api.get('/admin/custom-requests', { params });
    return response.data;
  },

  updateCustomRequestStatus: async (id, data) => {
    const response = await api.put(`/admin/custom-requests/${id}`, data);
    return response.data;
  },

  getAllReviews: async () => {
    const response = await api.get('/reviews/admin/all');
    return response.data;
  },

  approveReview: async (id) => {
    const response = await api.put(`/reviews/${id}/approve`);
    return response.data;
  },

  rejectReview: async (id) => {
    const response = await api.put(`/reviews/${id}/reject`);
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },

  createCoupon: async (data) => {
    const response = await api.post('/coupons', data);
    return response.data;
  },

  getAllCoupons: async () => {
    const response = await api.get('/coupons');
    return response.data;
  },

  updateCoupon: async (id, data) => {
    const response = await api.put(`/coupons/${id}`, data);
    return response.data;
  },

  deleteCoupon: async (id) => {
    const response = await api.delete(`/coupons/${id}`);
    return response.data;
  },

  getBanners: async () => {
    const response = await api.get('/banners');
    return response.data;
  },

  createBanner: async (data) => {
    const isFormData = data instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await api.post('/banners', data, config);
    return response.data;
  },

  updateBanner: async (id, data) => {
    const isFormData = data instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await api.put(`/banners/${id}`, data, config);
    return response.data;
  },

  deleteBanner: async (id) => {
    const response = await api.delete(`/banners/${id}`);
    return response.data;
  },

  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  updateSetting: async (key, value) => {
    const response = await api.put('/settings', { key, value });
    return response.data;
  }
};

export default adminService;
