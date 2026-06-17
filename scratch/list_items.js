const pool = require('../db');
async function run() {
  const res = await pool.query(`
    SELECT omi.id, omi.item_name, omi.base_price, m.is_pos_default 
    FROM outlet_menu_items omi
    JOIN outlet_menus m ON omi.menu_id = m.id
    WHERE m.is_pos_default = true
    LIMIT 20
  `);
  console.log(res.rows);
  await pool.end();
}
run();
