const axios = require('axios');

async function testOutletAllItems() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      identifier: 'shahetehzeeb',
      password: '1234'
    });
    const token = loginRes.data.token;
    console.log("Logged in successfully. User ID:", loginRes.data.id);

    const itemsRes = await axios.get('http://localhost:5000/api/brand/outlet-all-items?outlet_id=55', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("outlet-all-items (outlet_id=55) count:", itemsRes.data.length);
    if (itemsRes.data.length > 0) {
      console.log("Sample item:", itemsRes.data[0]);
    }

    const itemsResNoOutlet = await axios.get('http://localhost:5000/api/brand/outlet-all-items', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("outlet-all-items (no outlet_id) count:", itemsResNoOutlet.data.length);

    const menusRes = await axios.get('http://localhost:5000/api/brand/outlet-menus?outlet_id=55', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("outlet-menus count:", menusRes.data.length);
    console.log("Menus:", menusRes.data);

  } catch (err) {
    console.error("Test Error:", err.response?.data || err.message);
  }
}

testOutletAllItems();
