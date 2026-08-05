const pool = require('../db');

(async () => {
  try {
    console.log("🧹 Clearing old test orders for user_id = 2 (shahetehzeeb)...");
    const res = await pool.query("DELETE FROM orders WHERE user_id = 2 RETURNING id");
    console.log(`✅ Successfully deleted ${res.rows.length} old orders from database!`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error clearing orders:", err.message);
    process.exit(1);
  }
})();
