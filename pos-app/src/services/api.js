import axios from 'axios';

// ✅ Live Deployment Connection
const API_BASE = 'https://sasloop.in'; 
// const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000' : 'https://sasloop.in';

const api = axios.create({
    baseURL: API_BASE,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('pos_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: (phone, password) => api.post('/api/auth/login', { phone, password }),
    posLogin: (username, password) => api.post('/api/auth/pos-login', { username, password }),
    getProfile: () => api.get('/api/auth/profile'),
};

export const posService = {
    getTables: () => api.get('/api/pos/tables'),
    updateTableStatus: (tableName, status) => api.put(`/api/pos/tables/${tableName}/status`, { status }),
    getCatalog: () => api.get('/api/catalog'),
    createOrder: (orderData) => api.post('/api/orders', orderData),
    syncOfflineOrders: (orders) => api.post('/api/pos/sync-orders', { orders }),
};

export default api;
