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

const isCapacitor = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();
const isElectron = typeof window !== 'undefined' && (Boolean(window.process?.versions?.electron) || window.navigator?.userAgent?.includes('Electron'));
const isFileProtocol = typeof window !== 'undefined' && window.location?.protocol === 'file:';
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Dynamic API Base URL (Electron / unpacked build / Capacitor / live production point to live cloud backend)
export const API_BASE = (isElectron || isFileProtocol || isCapacitor)
  ? "https://backend.sasloop.in"
  : isLocalhost
    ? `http://${window.location.hostname}:5000`
    : "https://backend.sasloop.in";

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

export const updateApiBaseUrl = () => {
    api.defaults.baseURL = API_BASE;
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
    posLogin: (username, password) => api.post('/api/auth/pos-login', { username, password }),
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
    getOptionGroups: () => api.get('/api/pos/option-groups'),
    getTables: () => api.get('/api/pos/tables'),
    getOrders: () => api.get('/api/orders'),
    createOrder: (order) => api.post('/api/orders', order),
    updateOrderStatus: (id, status, rejection_reason) => api.put(`/api/orders/${id}/status`, { status, rejection_reason }),
    createKot: (kot) => api.post('/api/kots', kot),
    getWaiters: () => api.get('/api/waiters'),
    getStaff: () => api.get('/api/waiters'),
    getRiders: () => api.get('/api/waiters/riders'),
    getDiscounts: () => api.get('/api/discounts'),
    getAdditionalCharges: () => api.get('/api/additional-charges'),
    getTaxes: (outletId) => api.get('/api/brand/taxes', { params: { outlet_id: outletId } }),
    updateTax: (id, payload) => api.put(`/api/brand/taxes/${id}`, payload),
    getPaymentModes: (outletId) => api.get('/api/pos/payment-modes', { params: { outlet_id: outletId } }),
    getActiveState: () => api.get('/api/pos/active-state'),
    saveActiveState: (activeState) => api.post('/api/pos/active-state', { activeState }),
    clearSalesData: () => api.post('/api/pos/clear-sales-data'),

    // CRM & Customer Sync Endpoints
    getCustomers: () => api.get('/api/crm/customers'),
    searchCustomers: (query) => api.get('/api/crm/customers/search', { params: { query } }),
    getCustomerHistory: (phone) => api.get(`/api/crm/customers/${encodeURIComponent(phone)}/history`),
    saveCustomer: (payload) => api.post('/api/crm/customers', {
        name: payload.name,
        number: payload.number || payload.phone,
        address: payload.address,
        points: payload.points,
        balance: payload.balance
    }),
    adjustCustomer: (payload) => api.post('/api/crm/customers/adjust', payload),
    payCustomerDue: (payload) => api.post('/api/crm/customers/pay-due', payload),

    // Order management
    updateOrder: (id, order) => api.put(`/api/orders/${id}`, order),
    updateOrderPaymentStatus: (id, status) => api.put(`/api/orders/${id}/payment-status`, { payment_status: status }),
    assignRider: (orderId, riderId) => api.put('/api/delivery/assign', { orderId, riderId }),

    // Pre-order management
    createPreOrder: (data) => api.post('/api/pre-orders', data),
    getPreOrders: () => api.get('/api/pre-orders'),
    updatePreOrder: (id, data) => api.put(`/api/pre-orders/${id}`, data),
    updatePreOrderStatus: (id, status) => api.put(`/api/pre-orders/${id}/status`, { status }),

    // Category management
    updateCategory: (id, data) => api.put(`/api/brand/categories/${id}`, data),

    // Table management
    updateTableStatus: (tableName, status) => api.put(`/api/pos/tables/${encodeURIComponent(tableName)}/status`, { status }),

    // WhatsApp E-Bill & messaging
    sendWhatsAppMessage: (phone, message) => api.post('/api/whatsapp/chat/send', { to: phone, text: message }),
    sendWhatsAppPdf: (phone, base64Pdf, fileName) => api.post('/api/whatsapp/chat/send-pdf', { to: phone, pdfBase64: base64Pdf, filename: fileName }),

    // Waiter Call Notifications
    getWaiterRequests: () => api.get('/api/pos/waiter-requests'),
    resolveWaiterRequest: (payload) => api.put('/api/pos/waiter-requests/resolve', payload),
};

export default api;
