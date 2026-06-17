const pool = require('../db');
async function run() {
  const res = await pool.query("SELECT item_name, base_price FROM outlet_menu_items WHERE item_name ILIKE '%fries%' LIMIT 5");
  console.log(res.rows);
  await pool.end();
}
run();
