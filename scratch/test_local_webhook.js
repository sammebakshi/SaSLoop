const axios = require('axios');

async function testLocal() {
  try {
    const res = await axios.get('http://127.0.0.1:5000/api/whatsapp/webhook', {
      params: {
        'hub.mode': 'subscribe',
        'hub.verify_token': 'sasloop_verify_token',
        'hub.challenge': 'CHALLENGE_ACCEPTED_123'
      }
    });
    console.log('Local server response status:', res.status);
    console.log('Local server response body:', res.data);
  } catch (err) {
    console.error('Local server test failed:', err.message);
  }
}

testLocal();
