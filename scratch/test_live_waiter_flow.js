const fetch = require('node-fetch');

async function testFlow() {
  console.log("1. Sending Waiter Call from Table 1 QR...");
  const callRes = await fetch('https://backend.sasloop.in/api/public/call-waiter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: '2',
      tableNumber: '1',
      message: '🔔 Table 1 needs assistance urgently!'
    })
  }).then(r => r.json());
  console.log("Call Waiter Response:", callRes);

  console.log("\n2. Logging in as POS user (shahetehzeebpos)...");
  const loginRes = await fetch('https://backend.sasloop.in/api/auth/pos-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'shahetehzeebpos',
      password: '1234'
    })
  }).then(r => r.json()).catch(e => console.error(e));

  console.log("Login Status:", loginRes?.token ? "Success Token Received" : loginRes);

  if (loginRes?.token) {
    console.log("\n3. Fetching POS Waiter Requests as shahetehzeebpos...");
    const reqsRes = await fetch('https://backend.sasloop.in/api/pos/waiter-requests', {
      headers: { 'Authorization': `Bearer ${loginRes.token}` }
    }).then(r => r.json());
    console.log("Pending Waiter Requests for POS:", reqsRes);
  }
}

testFlow();
