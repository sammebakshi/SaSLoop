const axios = require('axios');

const testLogin = async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/pos-login', {
            username: 'posuser',
            password: 'Admin@123'
        });
        console.log('✅ LOGIN SUCCESS:', response.data);
    } catch (err) {
        console.error('❌ LOGIN FAILED:', err.response?.data || err.message);
    }
};

testLogin();
