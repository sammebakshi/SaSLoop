const axios = require('axios');

async function testCatalogApi() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      identifier: 'shahetehzeeb',
      password: '1234'
    });
    const token = loginRes.data.token;
    console.log("Logged in successfully.");

    const catRes = await axios.get('http://localhost:5000/api/catalog', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("=== POS CATALOG API ITEMS COUNT ===", catRes.data.length);
    if (catRes.data.length > 0) {
      console.log("Sample 5 items returned to POS Billing:");
      catRes.data.slice(0, 5).forEach(item => {
        console.log(`- Code: "${item.code}" | Name: "${item.product_name}" | Price: ₹${item.price} | Category: "${item.category}"`);
      });
    }

  } catch (err) {
    console.error("Catalog API Error:", err.response?.data || err.message);
  }
}

testCatalogApi();
