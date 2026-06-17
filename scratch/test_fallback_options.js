const pool = require("../db");

async function checkFallback(itemId) {
  try {
    const menuRes = await pool.query(
      "SELECT id FROM outlet_menus WHERE user_id = 48 AND is_digital_default = true LIMIT 1"
    );
    const menuId = menuRes.rows[0].id;

    const res = await pool.query(
      `SELECT id, item_name as name, base_price as price
       FROM outlet_menu_items
       WHERE menu_id = $1
         AND item_type = '1'
         AND id > $2
         AND id < COALESCE(
           (SELECT MIN(id) FROM outlet_menu_items WHERE item_type = '0' AND menu_id = $1 AND id > $2),
           99999999
         )
       ORDER BY id ASC`,
      [menuId, itemId]
    );
    console.log(`\n=== Fallback Options for Item ID ${itemId} ===`);
    console.table(res.rows);
  } catch (e) {
    console.error(e);
  }
}

async function run() {
  await checkFallback(5779); // CHEESE PIZZA
  await checkFallback(5811); // KABAB PIZZA
  await pool.end();
}

run();
