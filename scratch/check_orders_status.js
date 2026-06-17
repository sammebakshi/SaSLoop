const pool = require('../db');

async function run() {
  try {
    const res = await pool.query(
      `SELECT id, order_reference, status, total_price, created_at 
       FROM orders 
       ORDER BY created_at DESC LIMIT 10`
    );
    console.log("=== RECENT ORDERS ===");
    res.rows.forEach(r => {
      console.log(`Ref: ${r.order_reference} | Status: ${r.status} | Total: ${r.total_price} | Date: ${r.created_at.toISOString()}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
