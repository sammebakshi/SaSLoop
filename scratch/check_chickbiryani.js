const pool = require('../db');

async function check() {
  try {
    console.log('=== OUTLET MENU ITEMS FOR POS MENU (menu_id=34) ===');
    const menuItems = await pool.query(`
      SELECT id, item_name, short_code, menu_id, item_type, base_price
      FROM outlet_menu_items
      WHERE menu_id = 34
      ORDER BY id ASC
    `);
    console.log(menuItems.rows);

  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

check();
