const axios = require('axios');

async function checkProdTimeAPI() {
  try {
    const res = await axios.get('https://backend.sasloop.in/api/public/time');
    console.log('Production Server Time Response status:', res.status);
    console.log('Production Server Time Response data:', res.data);
  } catch (err) {
    if (err.response) {
      console.log('Error Status:', err.response.status);
      console.log('Error Data:', err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
}

checkProdTimeAPI();
