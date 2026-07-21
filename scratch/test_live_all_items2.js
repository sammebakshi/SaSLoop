const axios = require('axios');

async function checkLiveCatalogAndItems() {
  try {
    const loginRes = await axios.post('https://backend.sasloop.in/api/auth/pos-login', {
      username: 'shahetehzeebpos',
      password: '1234'
    });
    const token = loginRes.data.token;
    const user = loginRes.data.user;

    const catalogRes = await axios.get('https://backend.sasloop.in/api/catalog', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Live GET /api/catalog items count:", catalogRes.data.length);
    if (catalogRes.data.length > 0) {
      console.log("Sample 3 catalog items:", catalogRes.data.slice(0, 3));
    }

    const itemsRes2 = await axios.get('https://backend.sasloop.in/api/brand/outlet-all-items?outlet_id=2', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Live GET /api/brand/outlet-all-items?outlet_id=2 items count:", itemsRes2.data.length);

    const menuMap = {};
    itemsRes2.data.forEach(item => {
      menuMap[item.menu_name] = (menuMap[item.menu_name] || 0) + 1;
    });
    console.log("Menu distribution (outlet_id=2):", menuMap);

  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

checkLiveCatalogAndItems();
