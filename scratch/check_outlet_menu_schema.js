const pool = require("../db");

async function check() {
  try {
    console.log("--- outlet_menus columns ---");
    const menusCols = await pool.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'outlet_menus'"
    );
    console.table(menusCols.rows);

    console.log("--- outlet_menu_items columns ---");
    const itemsCols = await pool.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'outlet_menu_items'"
    );
    console.table(itemsCols.rows);

    console.log("--- Sample from outlet_menus ---");
    const menusSample = await pool.query("SELECT * FROM outlet_menus LIMIT 2");
    console.log(menusSample.rows);

    console.log("--- Sample from outlet_menu_items ---");
    const itemsSample = await pool.query("SELECT * FROM outlet_menu_items LIMIT 2");
    console.log(itemsSample.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
