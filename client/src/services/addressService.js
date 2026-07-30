import api from './api';

export const addressService = {
  getAddresses: async () => {
    const response = await api.get('/addresses');
    return response.data;
  },

  createAddress: async (data) => {
    const response = await api.post('/addresses', data);
    return response.data;
  },

  updateAddress: async (id, data) => {
    const response = await api.put(`/addresses/${id}`, data);
    return response.data;
  },

  deleteAddress: async (id) => {
    const response = await api.delete(`/addresses/${id}`);
    return response.data;
  },

  setDefaultAddress: async (id) => {
    const response = await api.put(`/addresses/${id}/default`);
    return response.data;
  }
};

export default addressService;
