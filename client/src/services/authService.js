import api from './api';

export const authService = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  login: async (email, password) => {
    const credentials = typeof email === 'object' ? email : { email, password };
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
  
  updatePassword: async (data) => {
    const response = await api.put('/auth/password', data);
    return response.data;
  },
  
  addAddress: async (data) => {
    const response = await api.post('/auth/address', data);
    return response.data;
  },
  
  updateAddress: async (id, data) => {
    const response = await api.put(`/auth/address/${id}`, data);
    return response.data;
  },
  
  deleteAddress: async (id) => {
    const response = await api.delete(`/auth/address/${id}`);
    return response.data;
  },
  
  deleteAccount: async () => {
    const response = await api.delete('/auth/delete-account');
    return response.data;
  }
};

export default authService;
