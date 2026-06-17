const pool = require("../db");

async function checkAll() {
  try {
    const res = await pool.query(
      `SELECT iog.*, og.name as group_name, omi.item_name as product_name
       FROM item_option_groups iog
       JOIN option_groups og ON iog.group_id = og.id
       JOIN outlet_menu_items omi ON iog.item_id = omi.id
       ORDER BY iog.id ASC`
    );
    console.log("=== ALL ITEM OPTION GROUP MAPPINGS ===");
    console.table(res.rows);
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

checkAll();
