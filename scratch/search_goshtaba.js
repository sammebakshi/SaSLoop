const pool = require('../db');
async function run() {
  try {
    const omi = await pool.query(
      `SELECT id, menu_id, short_code, item_name, base_price, is_active 
       FROM outlet_menu_items 
       WHERE menu_id = 33 AND (item_name ILIKE '%GOSHTABA%' OR item_name ILIKE '%RISTA%')
       ORDER BY id ASC`
    );
    console.log("Items in menu 33:");
    omi.rows.forEach(r => {
      console.log(r);
    });
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}
run();
