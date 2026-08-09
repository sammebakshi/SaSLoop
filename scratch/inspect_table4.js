const pool = require("../db");

async function checkTable4() {
  try {
    console.log("=== 1. RESTAURANTS SETTINGS & ACTIVE_POS_STATE ===");
    const bizRes = await pool.query("SELECT id, user_id, name, settings FROM restaurants");
    console.log(`Found ${bizRes.rows.length} restaurants.`);
    
    for (const r of bizRes.rows) {
      console.log(`\n--- Restaurant ID: ${r.id}, User ID: ${r.user_id}, Name: ${r.name} ---`);
      let settings = r.settings;
      if (typeof settings === 'string') {
        try { settings = JSON.parse(settings); } catch(e){}
      }
      const activePosState = settings?.active_pos_state;
      console.log("Has active_pos_state?", !!activePosState);
      if (activePosState) {
        console.log("tableBills keys:", Object.keys(activePosState.tableBills || {}));
        console.log("tableBills for '4' or 'Table 4':", activePosState.tableBills?.['4'], activePosState.tableBills?.['Table 4']);
        console.log("tableStatuses:", activePosState.tableStatuses);
        console.log("tableCustomers:", activePosState.tableCustomers);
      }
    }

    console.log("\n=== 2. POS_TABLES ===");
    const posTablesRes = await pool.query("SELECT * FROM pos_tables WHERE table_name ILIKE '%4%'");
    console.log("pos_tables rows matching '4':", posTablesRes.rows);

    console.log("\n=== 3. ORDERS FOR TABLE 4 ===");
    const ordersRes = await pool.query("SELECT id, user_id, order_reference, customer_name, customer_number, table_number, status, created_at FROM orders WHERE table_number ILIKE '%4%' ORDER BY created_at DESC LIMIT 10");
    console.log("orders matching '4':", ordersRes.rows);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkTable4();
