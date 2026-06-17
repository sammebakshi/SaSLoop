const pool = require('../db');

async function run() {
  try {
    const res = await pool.query(
      "SELECT * FROM restaurants WHERE user_id = 48"
    );
    console.log("=== RESTAURANT LOYALTY SETTINGS ===");
    console.log(res.rows[0]);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
