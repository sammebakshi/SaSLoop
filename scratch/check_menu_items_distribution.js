const pool = require('../db');

async function checkDistribution() {
  try {
    const m34 = await pool.query("SELECT count(*) FROM outlet_menu_items WHERE menu_id = 34");
    const m35 = await pool.query("SELECT count(*) FROM outlet_menu_items WHERE menu_id = 35");
    console.log("Items under Menu 34 ('pos menu'):", m34.rows[0].count);
    console.log("Items under Menu 35 ('DIGI MENU'):", m35.rows[0].count);

    const m34Items = await pool.query("SELECT id, item_name, short_code FROM outlet_menu_items WHERE menu_id = 34 LIMIT 5");
    console.log("Sample items under Menu 34:", m34Items.rows);

    const m35Items = await pool.query("SELECT id, item_name, short_code FROM outlet_menu_items WHERE menu_id = 35 LIMIT 5");
    console.log("Sample items under Menu 35:", m35Items.rows);

  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    process.exit();
  }
}

checkDistribution();
