import axios from 'axios';

const API_BASE = 'https://sasloop.in';

const api = axios.create({
    baseURL: API_BASE,
});

export const riderService = {
    getAssignedOrders: (riderId) => api.get(`/api/public/rider-orders/${riderId}`),
    updateLocation: (data) => api.post('/api/delivery/location', data),
    markDelivered: (orderId) => api.put(`/api/orders/${orderId}/status`, { status: 'DELIVERED' }),
};

export default api;
