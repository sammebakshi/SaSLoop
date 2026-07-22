const https = require('https');

async function checkLiveCloud() {
  try {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 55, bizId: 55 }, process.env.JWT_SECRET || 'secret');

    console.log('Generated JWT token for user 55');

    const options = {
      hostname: 'backend.sasloop.in',
      path: '/api/option-groups',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('HTTP Status:', res.statusCode);
        try {
          const ogs = JSON.parse(data);
          console.log(`Received ${ogs.length} option groups from backend.sasloop.in:`);
          for (let g of ogs) {
            console.log(`\nGroup ID ${g.id}: "${g.name}"`);
            console.log('  Associated Options:', g.associated_options);
            console.log('  Linked Main Items:', g.linked_main_items);
          }
        } catch (e) {
          console.log('Raw data:', data);
        }
      });
    });

    req.on('error', (e) => console.error(e));
    req.end();

  } catch (e) {
    console.error(e);
  }
}

checkLiveCloud();
