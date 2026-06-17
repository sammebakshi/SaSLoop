const axios = require('axios');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secretkey';
const API_BASE = 'http://localhost:5000';

async function testDeleteApi() {
  // Let's create an admin token first
  const adminToken = jwt.sign(
    { id: 1, bizId: 1, email: 'admin@test.com', role: 'admin' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const phone = '+917006089744';
  const targetUserId = 48; // Shahe Tehzeeb Restaurant's id from our db query

  console.log("Using token:", adminToken);
  console.log(`Sending DELETE request to ${API_BASE}/api/crm/customer/${encodeURIComponent(phone)}?target_user_id=${targetUserId}`);

  try {
    const res = await axios.delete(
      `${API_BASE}/api/crm/customer/${encodeURIComponent(phone)}?target_user_id=${targetUserId}`,
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      }
    );
    console.log("Status:", res.status);
    console.log("Data:", res.data);
  } catch (err) {
    if (err.response) {
      console.error("🔥 Server returned error status:", err.response.status);
      console.error("🔥 Error response data:", err.response.data);
    } else {
      console.error("🔥 Network error:", err.message);
    }
  }
  process.exit();
}

testDeleteApi();
