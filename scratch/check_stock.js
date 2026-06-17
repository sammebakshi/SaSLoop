const pool = require('../db');
async function run() {
  try {
    const res = await pool.query("SELECT id, item_name, is_active, stock_qty FROM outlet_menu_items WHERE id IN (5638, 5640, 5650)");
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
