import axios from 'axios';

// ✅ Dynamic Connection (Local vs Production)
export const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : 'https://backend.sasloop.in';

// Initialize device ID for isolation
let deviceId = localStorage.getItem('pos_device_id');
if (!deviceId) {
    deviceId = 'DEV-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now();
    localStorage.setItem('pos_device_id', deviceId);
}

const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
});

// Add token and terminal to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('pos_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    const currentDeviceId = localStorage.getItem('pos_device_id');
    if (currentDeviceId) {
        config.headers['X-Device-ID'] = currentDeviceId;
    }
    // Automatically append terminal parameter for desktop POS
    if (!config.params) {
        config.params = {};
    }
    config.params.terminal = 'POS_WINDOWS';

    // Disable caching for GET requests by appending a timestamp parameter
    if (config.method === 'get' || config.method === 'GET') {
        config.params._t = Date.now();
    }
    return config;
});

// Auto-logout on expired/invalid token
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 400 || error.response.status === 401)) {
            const msg = error.response.data?.error || '';
            const hasToken = localStorage.getItem('pos_token');
            const isLoginRequest = error.config && (error.config.url.includes('/api/auth/pos-login') || error.config.url.includes('/api/auth/login'));
            if (hasToken && !isLoginRequest && (error.response.status === 401 || msg.includes('Invalid token') || msg.includes('Account not found') || msg.includes('Please log out and back in'))) {
                console.warn('🔒 Token expired or invalid. Logging out...');
                localStorage.removeItem('pos_token');
                window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (phone, password) => api.post('/api/auth/login', { phone, password }),
    posLogin: (username, password) => api.post('/api/auth/pos-login', { username, password }),
    getProfile: () => api.get('/api/auth/profile'),
};

export const posService = {
    getTables: () => api.get('/api/pos/tables'),
    updateTableStatus: (tableName, status) => api.put(`/api/pos/tables/${tableName}/status`, { status }),
    getCatalog: () => api.get('/api/catalog'),
    getOptionGroups: () => api.get('/api/pos/option-groups'),
    createOrder: (orderData) => api.post('/api/orders', orderData),
    updateOrder: (id, orderData) => api.put(`/api/orders/${id}`, orderData),
    updateOrderStatus: (id, status, rejection_reason) => api.put(`/api/orders/${id}/status`, { status, rejection_reason }),
    updateOrderPaymentStatus: (id, paymentStatus) => api.put(`/api/orders/${id}/payment`, { payment_status: paymentStatus }),
    getRiders: () => api.get('/api/delivery/partners'),
    assignRider: (orderId, riderId) => api.put('/api/delivery/assign', { orderId, riderId }),
    getRecentOrders: () => api.get('/api/orders/recent'),
    getAllOrders: (params) => api.get('/api/orders', { params }),
    getDashboardStats: (params) => api.get('/api/analytics/dashboard-stats', { params }),
    syncOfflineOrders: (orders) => api.post('/api/pos/sync-orders', { orders }),
    getTaxes: (outletId) => api.get(`/api/brand/taxes${outletId ? `?outlet_id=${outletId}` : ''}`),
    getPaymentModes: (outletId) => api.get(`/api/brand/payment-modes/${outletId}`),
    updateTax: (taxId, taxData) => api.put(`/api/brand/taxes/${taxId}`, taxData),
    searchCustomers: (query) => api.get(`/api/crm/customers/search?query=${encodeURIComponent(query)}`),
    saveCustomer: (customerData) => api.post('/api/crm/customers', customerData),
    getCustomers: () => api.get('/api/crm/customers'),
    adjustCustomer: (data) => api.post('/api/crm/customers/adjust', data),
    payCustomerDue: (data) => api.post('/api/crm/customers/pay-due', data),
    deleteCustomer: (phone) => api.delete(`/api/crm/customer/${encodeURIComponent(phone)}`),
    getCustomerHistory: (phone) => api.get(`/api/crm/customers/${encodeURIComponent(phone)}/history`),
    getDiscounts: (outletId) => api.get(`/api/discounts${outletId ? `?outlet_id=${outletId}` : ''}`),
    getAdditionalCharges: (outletId) => api.get(`/api/additional-charges${outletId ? `?outlet_id=${outletId}` : ''}`),
    createPreOrder: (data) => api.post('/api/pre-orders', data),
    getPreOrders: () => api.get('/api/pre-orders'),
    updatePreOrder: (id, data) => api.put(`/api/pre-orders/${id}`, data),
    updatePreOrderStatus: (id, status) => api.put(`/api/pre-orders/${id}/status`, { status }),
    // Items Management
    getAllMenuItems: (outletId) => api.get(`/api/brand/outlet-all-items`, { params: { outlet_id: outletId } }),
    updateMenuItem: (id, data) => api.put(`/api/brand/outlet-menu-items/${id}`, data),
    createMenuItem: (data) => api.post(`/api/brand/outlet-menu-items`, data),
    deleteMenuItem: (id) => api.delete(`/api/brand/outlet-menu-items/${id}`),
    getCategories: (outletId) => api.get(`/api/brand/categories`, { params: { outlet_id: outletId } }),
    updateCategory: (id, data) => api.put(`/api/brand/categories/${id}`, data),
    getTaxGroups: (outletId) => api.get(`/api/brand/tax-groups`, { params: { outlet_id: outletId } }),
    getKitchenDepartments: (outletId) => api.get(`/api/brand/kitchen-departments`, { params: { outlet_id: outletId } }),
    getActiveState: () => api.get('/api/pos/active-state'),
    saveActiveState: (activeState) => api.post('/api/pos/active-state', { activeState }),
    getStaff: () => api.get('/api/brand/users'),
    createDiscount: (data) => api.post('/api/discounts', data),
    createAdditionalCharge: (data) => api.post('/api/additional-charges', data),
    getQRs: () => api.get('/api/pos/qrs'),
    getCoupons: (outletId) => api.get(`/api/brand/analytics/coupon-codes`, { params: { outlet_id: outletId } }),
};


export default api;
