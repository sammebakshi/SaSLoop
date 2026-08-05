const pool = require('../db');

async function test() {
  try {
    console.log("=== ALL item_type='1' ROWS IN OUTLET_MENU_ITEMS ===");
    const res = await pool.query(
      `SELECT id, menu_id, item_name, base_price, item_type 
       FROM outlet_menu_items 
       WHERE item_type = '1' 
       ORDER BY menu_id, id ASC`
    );
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

test();
