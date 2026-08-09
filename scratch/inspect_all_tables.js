const pool = require("../db");

async function dumpAllTables() {
  try {
    console.log("=== 1. TABLES_LIST ===");
    const tlRes = await pool.query("SELECT * FROM tables_list");
    console.log(tlRes.rows);

    console.log("\n=== 2. POS_TABLES ===");
    const ptRes = await pool.query("SELECT * FROM pos_tables");
    console.log(ptRes.rows);

    console.log("\n=== 3. RESTAURANTS SETTINGS & ACTIVE_POS_STATE ===");
    const restRes = await pool.query("SELECT id, user_id, name, settings FROM restaurants");
    for (const r of restRes.rows) {
      let settings = r.settings;
      if (typeof settings === 'string') {
        try { settings = JSON.parse(settings); } catch(e){}
      }
      console.log(`\nRestaurant ID ${r.id}, User ID ${r.user_id}:`);
      const activePosState = settings?.active_pos_state;
      if (activePosState) {
        console.log("tableBills:", JSON.stringify(activePosState.tableBills, null, 2));
        console.log("tableStatuses:", JSON.stringify(activePosState.tableStatuses, null, 2));
        console.log("tableCustomers:", JSON.stringify(activePosState.tableCustomers, null, 2));
        console.log("tables in state:", activePosState.tables);
      } else {
        console.log("No active_pos_state found.");
      }
    }

    console.log("\n=== 4. RECENT ORDERS (Last 20) ===");
    const ordRes = await pool.query("SELECT id, user_id, order_reference, customer_name, customer_number, table_number, status, source, created_at FROM orders ORDER BY created_at DESC LIMIT 20");
    console.log(ordRes.rows);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

dumpAllTables();
