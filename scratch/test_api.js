const fetch = require('node-fetch');

async function testApi() {
  try {
    // 1. Login
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: 'master@sasloop.com', password: 'Admin@123' })
    });
    const loginData = await loginRes.json();
    console.log("Login Token:", loginData.token ? "RECEIVED" : "FAILED");

    // 2. Fetch Users
    const res = await fetch('http://localhost:5000/api/master/users', {
      headers: { "Authorization": `Bearer ${loginData.token}` }
    });
    const data = await res.json();
    console.log("Fetch Status:", res.status);
    console.log("User Count:", data.length);
    console.log("First User Role:", data[0]?.role);

  } catch (err) {
    console.error(err);
  }
}
testApi();
