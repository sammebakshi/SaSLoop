const pool = require("../db");

async function check() {
  try {
    const res = await pool.query(`
      SELECT omi.id, omi.menu_id, omi.item_name as product_name, m.menu_name
      FROM outlet_menu_items omi
      JOIN outlet_menus m ON omi.menu_id = m.id
      WHERE m.user_id = 48
    `);
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
check();
