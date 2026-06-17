const pool = require('../db');

async function checkOrders() {
  try {
    const res = await pool.query("SELECT id, user_id, restaurant_id, total_price, created_at FROM orders ORDER BY created_at DESC LIMIT 10");
    console.log("Recent orders:", res.rows);
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
checkOrders();
