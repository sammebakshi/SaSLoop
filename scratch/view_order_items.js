const pool = require("../db");

async function check() {
  try {
    const res = await pool.query(
      `SELECT id, table_number, items FROM orders WHERE status = 'ACTIVE' AND user_id = 48 ORDER BY id DESC LIMIT 5`
    );
    console.log("=== Last 5 Active Orders items ===");
    for (let row of res.rows) {
        console.log(`Order ID: ${row.id}, Table: ${row.table_number}`);
        console.log(JSON.stringify(row.items, null, 2));
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
