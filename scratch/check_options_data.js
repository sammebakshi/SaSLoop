const pool = require("../db");

async function run() {
  try {
    console.log("=== OPTIONS LIST FOR GROUP 6 ===");
    const options = await pool.query("SELECT * FROM options_list WHERE group_id = 6");
    console.log(options.rows);

    if (options.rows.length > 0) {
      const firstOpt = options.rows[0];
      console.log(`\n=== CHECKING OUTLET MENU ITEMS FOR OPTION NAME '${firstOpt.name}' ===`);
      const matchingItems = await pool.query(
        "SELECT * FROM outlet_menu_items WHERE item_name = $1", 
        [firstOpt.name]
      );
      console.log(matchingItems.rows);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

run();
