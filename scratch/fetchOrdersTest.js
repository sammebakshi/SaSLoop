const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config({ path: 'c:/Users/Sajad/Desktop/SaSLoop/.env' });

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// Generate token for user 12
const token = jwt.sign({ id: 12 }, JWT_SECRET);

console.log("Generated token:", token);

async function testFetch() {
  try {
    const res = await axios.get('http://localhost:5000/api/orders', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("Status:", res.status);
    console.log("Orders count:", res.data.length);
    if (res.data.length > 0) {
      console.log("Sample order:", JSON.stringify(res.data[0], null, 2));
    }
  } catch (err) {
    console.error("Fetch error:", err.message);
    if (err.response) {
      console.error("Response data:", err.response.data);
    }
  }
}

testFetch();
