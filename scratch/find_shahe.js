const pool = require('../db');
async function run() {
  try {
    const r = await pool.query('SELECT user_id, name, address, cgst_percent, sgst_percent, gst_included FROM restaurants WHERE name ILIKE $1', ['%Shahe%']);
    console.log(JSON.stringify(r.rows, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}
run();
