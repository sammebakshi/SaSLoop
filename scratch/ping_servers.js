const dns = require('dns');

dns.lookup('backend.sasloop.in', (err, address, family) => {
  if (err) {
    console.error('DNS Lookup Error:', err);
  } else {
    console.log('backend.sasloop.in IP Address:', address);
  }
});
