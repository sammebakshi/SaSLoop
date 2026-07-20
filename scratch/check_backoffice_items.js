const pool = require('../db');

async function checkBackofficeItems() {
  try {
    const outletItemsCols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='outlet_menu_items'");
    console.log("outlet_menu_items columns:", outletItemsCols.rows.map(r => r.column_name));

    const sampleOutlet = await pool.query("SELECT * FROM outlet_menu_items LIMIT 5");
    console.log("Sample outlet_menu_items:", sampleOutlet.rows);

    const bizCols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='business_items'");
    console.log("business_items columns:", bizCols.rows.map(r => r.column_name));

    const sampleBiz = await pool.query("SELECT * FROM business_items LIMIT 5");
    console.log("Sample business_items:", sampleBiz.rows);

  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    process.exit();
  }
}

checkBackofficeItems();
