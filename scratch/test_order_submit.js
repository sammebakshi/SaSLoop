const https = require('https');

const payload = JSON.stringify({
  userId: "2",
  customerName: "Test User",
  customerPhone: "+917006089744",
  address: "Dine-In Table 1",
  fulfillmentMode: "DINE_IN",
  tableNumber: "1",
  paymentMethod: "COD",
  totalPrice: 120,
  items: [
    { id: 7, product_name: "FRIED CHICKEN MOMO'S", price: 120, qty: 1 }
  ],
  source: "QR_MENU"
});

const req = https.request({
  hostname: 'backend.sasloop.in',
  port: 443,
  path: '/api/public/order',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("Status Code:", res.statusCode);
    console.log("Response Data:", data);
  });
});

req.on('error', (e) => {
  console.error("HTTPS error:", e.message);
});

req.write(payload);
req.end();
