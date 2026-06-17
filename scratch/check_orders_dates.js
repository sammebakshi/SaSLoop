const pool = require("../db");

async function check() {
  try {
    const res = await pool.query("SELECT id, created_at, total_price, status FROM orders ORDER BY created_at DESC");
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
check();
