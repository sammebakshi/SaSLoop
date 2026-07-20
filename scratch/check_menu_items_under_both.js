const pool = require('../db');

async function check() {
  try {
    const menus = await pool.query("SELECT id, menu_name, is_pos_default, is_digital_default FROM outlet_menus WHERE user_id = 55 OR outlet_id = 55");
    console.log("Outlet Menus:", menus.rows);

    for (const m of menus.rows) {
      const cnt = await pool.query("SELECT count(*) FROM outlet_menu_items WHERE menu_id = $1", [m.id]);
      console.log(`Menu ID ${m.id} ("${m.menu_name}"): ${cnt.rows[0].count} items`);
    }
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}

check();
