const pool = require("../db");

async function run() {
  try {
    console.log("=== Checking ALL outlet_menus for 48 ===");
    const menuRes = await pool.query("SELECT id, menu_name, user_id, outlet_id FROM outlet_menus WHERE user_id = 48 OR outlet_id = 48");
    console.table(menuRes.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
