const axios = require('axios');

async function checkLiveOutletItems() {
  try {
    const loginRes = await axios.post('https://backend.sasloop.in/api/auth/pos-login', {
      username: 'shahetehzeebpos',
      password: '1234'
    });
    const token = loginRes.data.token;
    const user = loginRes.data.user;
    console.log("Logged in to live server as:", user);

    const itemsRes = await axios.get('https://backend.sasloop.in/api/brand/outlet-all-items', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("\nTotal items returned by /api/brand/outlet-all-items:", itemsRes.data.length);

    const menuMap = {};
    itemsRes.data.forEach(item => {
      menuMap[item.menu_name] = (menuMap[item.menu_name] || 0) + 1;
    });

    console.log("Menu distribution returned by live server:", menuMap);

    if (itemsRes.data.length > 0) {
      console.log("\nSample 5 items:");
      itemsRes.data.slice(0, 5).forEach(i => {
        console.log(`- [${i.code}] ${i.product_name} (Menu: ${i.menu_name}, MenuID: ${i.menu_id})`);
      });
    }

  } catch (err) {
    console.error("Error checking live items:", err.response?.data || err.message);
  }
}

checkLiveOutletItems();
