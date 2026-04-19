const pool = require('../db');
pool.query("INSERT INTO payment_settings (upi_id, bank_account, ifsc_code, qr_code_url) VALUES ('your_upi@okicici', 'State Bank of India', 'SBIN0001234', '')")
  .then(() => {
    console.log("INSERTED");
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
