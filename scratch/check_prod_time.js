const axios = require('axios');

async function checkDateHeader() {
  try {
    const res = await axios.get('https://backend.sasloop.in/');
    console.log('Date Header (success):', res.headers.date);
  } catch (err) {
    if (err.response) {
      console.log('Date Header (error):', err.response.headers.date);
    } else {
      console.error('Error:', err.message);
    }
  }
}

checkDateHeader();
