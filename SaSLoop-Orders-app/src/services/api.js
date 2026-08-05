import axios from 'axios';

const API_BASE = 'https://backend.sasloop.in';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sasloop_orders_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add error interceptor for 401 unauth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('sasloop_orders_token');
      localStorage.removeItem('sasloop_orders_user');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username, password) => {
    const res = await api.post('/api/auth/orders-app-login', {
      identifier: username,
      username: username,
      password: password
    });
    return res.data;
  },
  getOutlets: async () => {
    const res = await api.get('/api/brand/outlets');
    return res.data;
  }
};

export const orderService = {
  getOrders: async (terminal = '', targetUserId = null) => {
    let url = '/api/orders?limit=50';
    if (targetUserId) url += `&target_user_id=${targetUserId}`;
    if (terminal) url += `&terminal=${terminal}`;
    const res = await api.get(url);
    return res.data;
  },
  updateStatus: async (orderId, status, rejectionReason = '') => {
    const res = await api.put(`/api/orders/${orderId}/status`, {
      status,
      rejection_reason: rejectionReason,
      source: 'MOBILE_APP'
    });
    return res.data;
  },
  updatePaymentStatus: async (orderId, paymentStatus) => {
    const res = await api.put(`/api/orders/${orderId}/payment`, {
      payment_status: paymentStatus
    });
    return res.data;
  },
  updateDeliveryCharge: async (orderId, deliveryCharge) => {
    const res = await api.put(`/api/orders/${orderId}/delivery-charge`, {
      delivery_charge: deliveryCharge
    });
    return res.data;
  },
  assignRider: async (orderId, riderId) => {
    const res = await api.put('/api/delivery/assign', { orderId, riderId });
    return res.data;
  },
  assignWaiter: async (orderId, waiterId, waiterName) => {
    const res = await api.put(`/api/orders/${orderId}`, { waiter_id: waiterId, waiter_name: waiterName });
    return res.data;
  }
};

export const staffService = {
  getRiders: async () => {
    const res = await api.get('/api/waiters/riders');
    return res.data;
  },
  getWaiters: async () => {
    const res = await api.get('/api/waiters');
    return res.data;
  }
};

export const reservationService = {
  getReservations: async (targetUserId = null) => {
    let url = '/api/reservations';
    if (targetUserId) url += `?target_user_id=${targetUserId}`;
    const res = await api.get(url);
    return res.data;
  },
  updateStatus: async (reservationId, status, assignedTable = '') => {
    const res = await api.put(`/api/reservations/${reservationId}/status`, {
      status,
      assigned_table_number: assignedTable
    });
    return res.data;
  }
};

export default api;
