import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE = 'https://backend.sasloop.in';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 12000,
});

// Attach token to every request
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('pos_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {}
  return config;
});

// Auto-logout on invalid token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const msg = error.response.data?.error || '';
      const isLoginRequest = error.config?.url?.includes('/api/auth/');
      if (!isLoginRequest && (msg.includes('Invalid token') || msg.includes('Account not found'))) {
        await AsyncStorage.removeItem('pos_token');
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  posLogin: (username, password) => api.post('/api/auth/pos-login', { username, password }),
  getProfile: () => api.get('/api/auth/profile'),
};

export const posService = {
  getDashboardStats: (params) => api.get('/api/analytics/dashboard-stats', { params }),
  getAllOrders: (params) => api.get('/api/orders', { params }),
  updateOrderStatus: (id, status, reason) => api.put(`/api/orders/${id}/status`, { status, rejection_reason: reason }),
  getCatalog: () => api.get('/api/catalog'),
  getTables: () => api.get('/api/pos/tables'),
  getCustomers: () => api.get('/api/crm/customers'),
  getRecentOrders: () => api.get('/api/orders/recent'),
};

export default api;
