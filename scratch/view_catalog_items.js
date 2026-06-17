const pool = require("../db");

async function check() {
  try {
    const res = await pool.query(
      `SELECT id, item_name, price FROM outlet_menu_items WHERE user_id = 48 LIMIT 10`
    );
    console.log("=== Menu Items ===");
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
