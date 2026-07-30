import api from './api';

export const customRequestService = {
  submitCustomRequest: async (formData) => {
    const response = await api.post('/custom-requests', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMyCustomRequests: async () => {
    const response = await api.get('/custom-requests/myrequests');
    return response.data;
  },
};

export default customRequestService;
