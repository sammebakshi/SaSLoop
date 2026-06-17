const axios = require('axios');

async function check() {
  try {
    const res = await axios.get('http://127.0.0.1:4040/api/tunnels');
    console.log('--- ACTIVE NGROK TUNNELS ---');
    res.data.tunnels.forEach(t => {
      console.log(`Name: ${t.name}`);
      console.log(`Public URL: ${t.public_url}`);
      console.log(`Local Address: ${t.config.addr}`);
      console.log('---------------------------');
    });
  } catch (err) {
    console.error('❌ Ngrok local API not reachable. Is Ngrok running? Error:', err.message);
  }
}

check();
