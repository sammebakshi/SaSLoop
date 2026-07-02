const axios = require('axios');

async function testTime() {
  try {
    const res = await axios.get('http://localhost:5000/api/public/time');
    console.log('Time endpoint status:', res.status);
    console.log('Server response:', res.data);
  } catch (err) {
    console.error('Error hitting endpoint:', err.message);
  }
}

testTime();
