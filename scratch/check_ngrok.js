const axios = require('axios');

async function check() {
  try {
    const res = await axios.get('http://127.0.0.1:4040/api/tunnels');
    console.log('Active ngrok tunnels:');
    res.data.tunnels.forEach(t => {
      console.log(`  ${t.name}: ${t.public_url} -> ${t.config.addr}`);
    });
  } catch (err) {
    console.error('Could not connect to local ngrok API (is ngrok running?):', err.message);
  }
}

check();
