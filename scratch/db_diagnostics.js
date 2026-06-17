const pool = require("../db");

async function checkData() {
  try {
    const menus = await pool.query(
      "SELECT id, user_id, outlet_id, menu_name FROM outlet_menus"
    );
    console.log("OUTLET MENUS:");
    console.table(menus.rows);

    const counts = await pool.query(
      "SELECT menu_id, COUNT(*) FROM outlet_menu_items GROUP BY menu_id"
    );
    console.log("\nMENU ITEMS COUNT BY MENU_ID:");
    console.table(counts.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkData();
