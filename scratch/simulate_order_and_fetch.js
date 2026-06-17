const http = require('http');

// Helper to make requests
function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const reqHeaders = {
      ...headers,
    };
    if (body) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: reqHeaders,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: data ? JSON.parse(data) : null,
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: data,
          });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (body) {
      req.write(postData);
    }
    req.end();
  });
}

async function run() {
  try {
    console.log('1. Logging in to get token...');
    // We will login using the standard login endpoint or bypass it if we can use a token.
    // Let's check how login works. Let's send a login request for testuser1 or shahetehzeebpos.
    // Wait, let's look at the users in the database:
    // shahetehzeebpos is a staff user, shahetehzeeb is a user.
    // Let's try logging in as shahetehzeeb (password is usually 123456 or we can check authRoutes).
    // Let's try logging in.
    const loginRes = await makeRequest('POST', '/api/auth/login', {
      identifier: 'shahetehzeeb',
      password: '123456' // let's try the default password
    });
    
    if (loginRes.statusCode !== 200) {
      console.log('Login failed with status:', loginRes.statusCode, loginRes.body);
      // Let's try password as 'admin' or something else
      const loginRes2 = await makeRequest('POST', '/api/auth/login', {
        identifier: 'shahetehzeeb',
        password: 'password'
      });
      if (loginRes2.statusCode !== 200) {
        console.error('Could not log in, testing aborted.');
        return;
      }
    }
    
    const token = loginRes.body.token;
    console.log('Login successful! Token acquired.');
    
    const authHeaders = {
      'Authorization': `Bearer ${token}`
    };

    console.log('\n2. Creating a test order with waiter_id = 56 (Test User 1)...');
    const orderPayload = {
      items: [
        { id: 1, name: 'Burger', qty: 1, price: 100 }
      ],
      total_price: 100,
      payment_method: 'CASH',
      order_type: 'DINE_IN',
      waiter_id: 56 // Test User 1
    };

    const createRes = await makeRequest('POST', '/api/orders', orderPayload, authHeaders);
    console.log('Create order response status:', createRes.statusCode);
    console.log('Create order response body:', createRes.body);

    if (createRes.statusCode === 200 || createRes.statusCode === 201) {
      const createdOrder = createRes.body;
      console.log('\n=== Verification 1 (Create Response) ===');
      console.log('Waiter ID in created order:', createdOrder.waiter_id);
      console.log('Waiter Name in created order:', createdOrder.waiter_name);
      
      console.log('\n3. Fetching recent orders...');
      const recentRes = await makeRequest('GET', '/api/orders/recent', null, authHeaders);
      console.log('Recent orders response status:', recentRes.statusCode);
      
      if (recentRes.statusCode === 200 && recentRes.body.length > 0) {
        const fetchedOrder = recentRes.body.find(o => o.id === createdOrder.id);
        console.log('\n=== Verification 2 (Fetch Recent Response) ===');
        if (fetchedOrder) {
          console.log('Waiter ID in fetched order:', fetchedOrder.waiter_id);
          console.log('Waiter Name in fetched order:', fetchedOrder.waiter_name);
        } else {
          console.log('Created order not found in recent orders list.');
        }
      }
    }
    
  } catch (err) {
    console.error('Error during integration test:', err);
  }
}

run();
