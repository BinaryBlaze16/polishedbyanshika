import api from './api';

const reviewService = {
  // Submit new review (multipart/form-data for image upload)
  submitReview: async (formData) => {
    const res = await api.post('/reviews', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  // Edit own review (resets to Pending)
  updateReview: async (id, formData) => {
    const res = await api.put(`/reviews/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  // Delete own review
  deleteMyReview: async (id) => {
    const res = await api.delete(`/reviews/my/${id}`);
    return res.data;
  },

  // Get customer's own reviews
  getMyReviews: async () => {
    const res = await api.get('/reviews/my');
    return res.data;
  },

  // Check if order item already has a review
  checkReviewEligibility: async (orderId, orderItemId) => {
    const res = await api.get(`/reviews/check/${orderId}/${orderItemId}`);
    return res.data;
  },

  // Get approved reviews for a product (public)
  getProductReviews: async (productId, { sort = 'latest', star } = {}) => {
    const params = new URLSearchParams({ sort });
    if (star) params.append('star', star);
    const res = await api.get(`/reviews/product/${productId}?${params}`);
    return res.data;
  },

  // Admin: get all reviews
  getAllReviewsAdmin: async (status) => {
    const params = status ? `?status=${status}` : '';
    const res = await api.get(`/reviews/admin/all${params}`);
    return res.data;
  },

  // Admin: approve
  approveReview: async (id) => {
    const res = await api.put(`/reviews/${id}/approve`);
    return res.data;
  },

  // Admin: reject
  rejectReview: async (id) => {
    const res = await api.put(`/reviews/${id}/reject`);
    return res.data;
  },

  // Admin: delete any review
  deleteReview: async (id) => {
    const res = await api.delete(`/reviews/${id}`);
    return res.data;
  }
};

export default reviewService;
