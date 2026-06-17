const pool = require("../db");

async function checkAll() {
  try {
    const res = await pool.query(
      `SELECT id, item_name, base_price, item_type 
       FROM outlet_menu_items 
       WHERE menu_id = 33
       ORDER BY id ASC`
    );
    console.log("=== ALL OUTLET MENU ITEMS ===");
    console.table(res.rows);
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

checkAll();
