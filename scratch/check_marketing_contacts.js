const pool = require('../db');

async function run() {
  try {
    const res = await pool.query(
      `SELECT * 
       FROM marketing_contacts 
       WHERE user_id = 48`
    );
    console.log("=== MARKETING CONTACTS FOR USER 48 ===");
    res.rows.forEach(r => {
      console.log(`Phone: ${r.phone_number} | Name: ${r.name} | Last Order At: ${r.last_order_at}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
