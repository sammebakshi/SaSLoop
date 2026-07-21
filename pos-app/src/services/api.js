import axios from 'axios';

// Detect if running in Terminal Mode
const isTerminalMode = (() => {
  if (typeof window !== 'undefined' && window.process && window.process.argv) {
    if (window.process.argv.includes('--is-terminal-mode')) return true;
    if (window.process.argv.includes('--is-master-mode')) return false;
  }
  const hasTerminalExec = typeof window !== 'undefined' && window.process && window.process.execPath &&
    String(window.process.execPath).toLowerCase().includes('terminal');
  const hasTerminalEnv = typeof window !== 'undefined' && window.process && window.process.env &&
    window.process.env.IS_TERMINAL === 'true';
  const hasTerminalStorage = typeof localStorage !== 'undefined' &&
    localStorage.getItem('pos_is_terminal_mode') === 'true';
  return !!(hasTerminalExec || hasTerminalEnv || hasTerminalStorage);
})();

// Live Production Cloud Server Base URL (Permanently locked - user cannot modify)
export const API_BASE = "https://backend.sasloop.in";

// Initialize device ID for isolation
let deviceId = typeof localStorage !== 'undefined' ? localStorage.getItem('pos_device_id') : null;
if (!deviceId && typeof localStorage !== 'undefined') {
    deviceId = 'DEV-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now();
    localStorage.setItem('pos_device_id', deviceId);
}

const api = axios.create({
    baseURL: API_BASE,
    timeout: 15000,
});

// Locked helper - Server URL is permanently locked to Live Cloud Server
export const updateApiBaseUrl = () => {
    api.defaults.baseURL = "https://backend.sasloop.in";
};

// Add auth token interceptor
api.interceptors.request.use((config) => {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('pos_token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const authService = {
    login: (identifier, password) => api.post('/api/auth/login', { identifier, password }),
    getProfile: () => api.get('/api/auth/profile'),
    getMyOutlets: () => api.get('/api/auth/my-outlets')
};

export const posService = {
    login: (username, password) => api.post('/api/auth/pos-login', { username, password }),
    getCatalog: () => api.get('/api/catalog'),
    getCategories: (outletId) => api.get('/api/brand/categories', { params: { outlet_id: outletId } }),
    getAllMenuItems: (outletId) => api.get('/api/brand/outlet-all-items', { params: { outlet_id: outletId } }),
    createMenuItem: (payload) => api.post('/api/brand/outlet-menu-items', payload),
    updateMenuItem: (id, payload) => api.put(`/api/brand/outlet-menu-items/${id}`, payload),
    deleteMenuItem: (id) => api.delete(`/api/brand/outlet-menu-items/${id}`),
    getTaxGroups: (outletId) => api.get('/api/brand/tax-groups', { params: { outlet_id: outletId } }),
    getKitchenDepartments: (outletId) => api.get('/api/brand/kitchen-departments', { params: { outlet_id: outletId } }),
    getOptionGroups: () => api.get('/api/option-groups'),
    getTables: () => api.get('/api/pos/tables'),
    getOrders: () => api.get('/api/orders'),
    createOrder: (order) => api.post('/api/orders', order),
    updateOrderStatus: (id, status) => api.put(`/api/orders/${id}/status`, { status }),
    createKot: (kot) => api.post('/api/kots', kot),
    getWaiters: () => api.get('/api/waiters'),
    getDiscounts: () => api.get('/api/discounts'),
    getAdditionalCharges: () => api.get('/api/additional-charges')
};

export default api;
