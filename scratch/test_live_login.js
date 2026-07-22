const https = require('https');
const pool = require('../db');

async function testLogin() {
  try {
    const res = await pool.query("SELECT id, username, password FROM app_users WHERE id = 55");
    console.log('User 55 credentials:', res.rows[0]);

    const postData = JSON.stringify({
      identifier: 'shahetehzeeb',
      password: res.rows[0]?.password || '123456'
    });

    const req = https.request({
      hostname: 'backend.sasloop.in',
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Login Status:', res.statusCode);
        console.log('Login Response:', data);
        try {
          const json = JSON.parse(data);
          if (json.token) {
            fetchOptionGroups(json.token);
          }
        } catch (e) {}
      });
    });

    req.write(postData);
    req.end();

  } catch(e) {
    console.error(e);
  }
}

function fetchOptionGroups(token) {
  const req = https.request({
    hostname: 'backend.sasloop.in',
    path: '/api/option-groups',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('\nOption Groups Status:', res.statusCode);
      try {
        const ogs = JSON.parse(data);
        console.log(`Received ${ogs.length} option groups:`);
        for (let g of ogs) {
          console.log(`\nGroup ID ${g.id}: "${g.name}"`);
          console.log('  Associated Options:', g.associated_options);
        }
      } catch (e) {
        console.log('Raw data:', data);
      }
    });
  });
  req.end();
}

testLogin();
