const axios = require('axios');

async function testLogin() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      identifier: 'shahetehzeeb',
      password: '1234'
    });
    console.log("✅ LOGIN SUCCESSFUL! Token generated:", res.data.token ? "YES" : "NO");
    console.log("User Data:", res.data);
  } catch (err) {
    console.error("❌ LOGIN FAILED:", err.response?.data || err.message);
  }
}

testLogin();
