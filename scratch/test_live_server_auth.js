const axios = require('axios');

async function testLiveAuth() {
  console.log("Testing Live Cloud Server Authentication (https://backend.sasloop.in)...");

  // 1. Test /api/auth/pos-login with shahetehzeebpos / 1234
  try {
    const res1 = await axios.post('https://backend.sasloop.in/api/auth/pos-login', {
      username: 'shahetehzeebpos',
      password: '1234'
    });
    console.log("✅ pos-login (shahetehzeebpos): SUCCESS", res1.data);
  } catch (err1) {
    console.log("❌ pos-login (shahetehzeebpos): FAILED -", err1.response?.status, err1.response?.data || err1.message);
  }

  // 2. Test /api/auth/login with shahetehzeebpos / 1234
  try {
    const res2 = await axios.post('https://backend.sasloop.in/api/auth/login', {
      identifier: 'shahetehzeebpos',
      password: '1234'
    });
    console.log("✅ login (shahetehzeebpos): SUCCESS", res2.data);
  } catch (err2) {
    console.log("❌ login (shahetehzeebpos): FAILED -", err2.response?.status, err2.response?.data || err2.message);
  }

  // 3. Test shahetehzeeb on live
  try {
    const res3 = await axios.post('https://backend.sasloop.in/api/auth/pos-login', {
      username: 'shahetehzeeb',
      password: '1234'
    });
    console.log("✅ pos-login (shahetehzeeb): SUCCESS", res3.data);
  } catch (err3) {
    console.log("❌ pos-login (shahetehzeeb): FAILED -", err3.response?.status, err3.response?.data || err3.message);
  }
}

testLiveAuth();
