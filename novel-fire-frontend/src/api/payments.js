import apiClient from './client';

export const paymentsAPI = {
  createOrder: async ({ amount, currency = 'INR', receipt }) => {
    const { data } = await apiClient.post('/payments/order', { amount, currency, receipt });
    return data; // { order, keyId }
  },
};
