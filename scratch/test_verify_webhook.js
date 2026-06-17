const axios = require('axios');

async function testVerify() {
  try {
    const res = await axios.get('https://comply-lagged-concave.ngrok-free.dev/api/whatsapp/webhook', {
      params: {
        'hub.mode': 'subscribe',
        'hub.verify_token': 'sasloop_verify_token',
        'hub.challenge': 'CHALLENGE_ACCEPTED_123'
      }
    });
    console.log('Verification test status:', res.status);
    console.log('Verification test body:', res.data);
  } catch (err) {
    console.error('Verification test failed:', err.message);
  }
}

testVerify();
