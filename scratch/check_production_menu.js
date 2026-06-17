const axios = require('axios');

async function checkProd() {
  try {
    const res = await axios.get('https://sasloop.in/api/public/menu/48?menuType=digital');
    console.log('Production menu status:', res.status);
    console.log('Production business name:', res.data.business?.name);
    console.log('Production items count:', res.data.items?.length);
    if (res.data.items && res.data.items.length > 0) {
      console.log('Sample production items:');
      res.data.items.slice(0, 5).forEach(item => {
        console.log(`  - ${item.product_name} (${item.price})`);
      });
    }
  } catch (err) {
    console.error('Failed to fetch from production:', err.message);
  }
}

checkProd();
