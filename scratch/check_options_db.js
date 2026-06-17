const pool = require("../db");

async function checkDb() {
  try {
    const mappingsRes = await pool.query(
      `SELECT iog.*, og.name as group_name, omi.item_name as product_name
       FROM item_option_groups iog
       JOIN option_groups og ON iog.group_id = og.id
       JOIN outlet_menu_items omi ON iog.item_id = omi.id`
    );
    console.log("\n=== ALL ITEM OPTION GROUP MAPPINGS ===");
    console.table(mappingsRes.rows);

    const optionGroupsRes = await pool.query(
      `SELECT * FROM option_groups`
    );
    console.log("\n=== ALL OPTION GROUPS ===");
    console.table(optionGroupsRes.rows);

    const optionsListRes = await pool.query(
      `SELECT * FROM options_list`
    );
    console.log("\n=== ALL OPTIONS LIST ===");
    console.table(optionsListRes.rows);

  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

checkDb();
