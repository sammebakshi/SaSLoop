const pool = require('../db');
async function run() {
  try {
    const r = await pool.query(
      'SELECT user_id, name, cgst_percent, sgst_percent, gst_included, show_gst_on_receipt FROM restaurants WHERE user_id = 50'
    );
    console.log("=== DB STATE for user_id=50 ===");
    console.log(JSON.stringify(r.rows[0], null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}
run();
