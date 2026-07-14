import axios from 'axios';

// ✅ Dynamic Connection (Local vs Production)
const storedMasterIp = typeof localStorage !== 'undefined' ? localStorage.getItem('pos_master_ip') : null;
export const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? (storedMasterIp ? `http://${storedMasterIp}:5000` : "http://localhost:5000")
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

// Helper to update the base URL dynamically when Master IP changes
export const updateApiBaseUrl = (ip) => {
    if (!ip) {
        localStorage.removeItem('pos_master_ip');
        api.defaults.baseURL = "http://localhost:5000";
    } else {
        localStorage.setItem('pos_master_ip', ip);
        api.defaults.baseURL = `http://${ip}:5000`;
    }
};

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
    const activeOutletId = localStorage.getItem('pos_active_outlet_id');
    if (activeOutletId && activeOutletId !== 'undefined' && activeOutletId !== 'null') {
        config.headers['X-Target-User-Id'] = activeOutletId;
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

// Auto-logout on expired/invalid token & apply report/analytics permission filters
api.interceptors.response.use(
    (response) => {
        const profileStr = localStorage.getItem('pos_profile');
        if (profileStr && response.data && typeof response.data === 'object') {
            try {
                const profile = JSON.parse(profileStr);
                const permissions = typeof profile.staff_permissions === 'string'
                    ? JSON.parse(profile.staff_permissions)
                    : profile.staff_permissions;
                const access = permissions?.pos_access;
                if (access) {
                    const url = response.config.url || '';
                    if (access.Reports?.show_amount === false && (url.includes('/api/analytics') || url.includes('/api/reports'))) {
                        maskAmountsRecursively(response.data);
                    }
                    if (access.Reports?.show_all_user_report === false && (url.includes('/api/analytics') || url.includes('/api/reports'))) {
                        const currentCashier = String(profile.username || '').toLowerCase();
                        filterUserReportsRecursively(response.data, currentCashier);
                    }
                }
            } catch (e) {
                console.error("Interceptor error parsing permissions:", e);
            }
        }
        return response;
    },
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

function maskAmountsRecursively(obj) {
    if (!obj || typeof obj !== 'object') return;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const val = obj[key];
            if (typeof val === 'number') {
                const k = key.toLowerCase();
                if (k.includes('price') || k.includes('amount') || k.includes('sale') || k.includes('total') || k.includes('tax') || k.includes('discount') || k.includes('charge') || k.includes('tip') || k.includes('earning') || k.includes('due') || k.includes('balance') || k.includes('paid')) {
                    obj[key] = 0;
                }
            } else if (typeof val === 'string' && !isNaN(val) && val.trim() !== '') {
                const k = key.toLowerCase();
                if (k.includes('price') || k.includes('amount') || k.includes('sale') || k.includes('total') || k.includes('tax') || k.includes('discount') || k.includes('charge') || k.includes('tip') || k.includes('earning') || k.includes('due') || k.includes('balance') || k.includes('paid')) {
                    obj[key] = '0';
                }
            } else if (typeof val === 'object') {
                maskAmountsRecursively(val);
            }
        }
    }
}

function filterUserReportsRecursively(obj, cashier) {
    if (!obj || typeof obj !== 'object') return;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const val = obj[key];
            if (Array.isArray(val)) {
                if (val.length > 0 && (val[0].cashier !== undefined || val[0].cashier_name !== undefined || val[0].username !== undefined || val[0].user !== undefined)) {
                    obj[key] = val.filter(item => {
                        const itemCashier = String(item.cashier || item.cashier_name || item.username || item.user || '').toLowerCase();
                        return itemCashier === cashier;
                    });
                } else {
                    val.forEach(item => filterUserReportsRecursively(item, cashier));
                }
            } else if (typeof val === 'object') {
                filterUserReportsRecursively(val, cashier);
            }
        }
    }
}

export const authService = {
    login: (phone, password) => api.post('/api/auth/login', { phone, password }),
    posLogin: (username, password) => api.post('/api/auth/pos-login', { username, password }),
    getProfile: () => api.get('/api/auth/profile'),
    getMyOutlets: () => api.get('/api/auth/my-outlets'),
};

export const posService = {
    getTables: () => api.get('/api/pos/tables'),
    updateTableStatus: (tableName, status) => api.put(`/api/pos/tables/${tableName}/status`, { status }),
    getCatalog: () => api.get('/api/catalog'),
    getOptionGroups: () => api.get('/api/pos/option-groups'),
    createOrder: (orderData) => api.post('/api/orders', orderData),
    updateOrder: (id, orderData) => api.put(`/api/orders/${id}`, orderData),
    updateOrderStatus: (id, status, rejection_reason, reverse_inventory = true) => api.put(`/api/orders/${id}/status`, { status, rejection_reason, reverse_inventory }),
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
    deletePreOrder: (id) => api.delete(`/api/pre-orders/${id}`),
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
    sendWhatsAppMessage: (phone, text) => api.post('/api/whatsapp/chat/send', { to: phone, text }),
    sendWhatsAppPdf: (phone, pdfBase64, filename) => {
        return api.post('/api/whatsapp/chat/send-pdf', { to: phone, pdfBase64, filename });
    },
    saveSettings: (settings) => api.post('/api/pos/settings', { settings }),
    clearSalesData: () => api.post('/api/pos/clear-sales-data'),
    sendEmailReport: (data) => api.post('/api/brand/reports/email', data),
    getTableDepartments: (outletId) => api.get('/api/brand/table-departments', { params: { target_user_id: outletId } }),
};


export default api;
