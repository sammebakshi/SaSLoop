const axios = require('axios');

async function testTunnel() {
  try {
    const res = await axios.get('https://comply-lagged-concave.ngrok-free.dev/api/health-check');
    console.log('Public ngrok tunnel response:');
    console.log(res.data);
  } catch (err) {
    console.log('Failed to connect to public tunnel:', err.message);
    if (err.response) {
      console.log('Response body:', err.response.data);
    }
  }
}

testTunnel();
