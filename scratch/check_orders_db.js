const pool = require('../db');

async function test() {
  try {
    const res = await pool.query(
      `SELECT id, user_id, customer_name, customer_number, total_price, status, created_at
       FROM orders
       ORDER BY id DESC LIMIT 15`
    );
    console.log("Recent Orders in DB:", res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

test();
