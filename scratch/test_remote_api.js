const axios = require('axios');
const jwt = require('jsonwebtoken');

(async () => {
  try {
    const token = jwt.sign(
      { id: 3, bizId: 2, role: 'staff', isPOS: true },
      'secretkey',
      { expiresIn: "7d" }
    );
    console.log('GENERATED TOKEN:', token.substring(0, 30) + '...');

    // Test 1: /api/catalog
    const cat = await axios.get('http://localhost:5000/api/catalog', {
      headers: { Authorization: 'Bearer ' + token }
    });
    console.log('CATALOG COUNT:', cat.data.length);
    if (cat.data.length > 0) {
      console.log('FIRST ITEM:', JSON.stringify(cat.data[0]).substring(0, 300));
    }

    // Test 2: /api/pos/tables
    const tables = await axios.get('http://localhost:5000/api/pos/tables', {
      headers: { Authorization: 'Bearer ' + token }
    });
    console.log('TABLES COUNT:', tables.data.length);

    // Test 3: /api/pos/option-groups
    const og = await axios.get('http://localhost:5000/api/pos/option-groups', {
      headers: { Authorization: 'Bearer ' + token }
    });
    console.log('OPTION GROUPS COUNT:', og.data.length);

    // Test 4: /api/brand/taxes
    const taxes = await axios.get('http://localhost:5000/api/brand/taxes?outlet_id=2', {
      headers: { Authorization: 'Bearer ' + token }
    });
    console.log('TAXES COUNT:', taxes.data.length);

    // Test 5: /api/auth/profile
    const profile = await axios.get('http://localhost:5000/api/auth/profile', {
      headers: { Authorization: 'Bearer ' + token }
    });
    console.log('PROFILE business_name:', profile.data.business_name);
    console.log('PROFILE business_details:', profile.data.business_details ? 'EXISTS' : 'NULL');
    console.log('PROFILE id:', profile.data.id);
    console.log('PROFILE parent_user_id:', profile.data.parent_user_id);
  } catch (e) {
    console.error('ERROR:', e.response ? e.response.data : e.message);
  }
})();
