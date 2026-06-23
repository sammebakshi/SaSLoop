const pool = require("../db");

async function checkAndClear() {
  try {
    // 1. Check orders table
    const orderRes = await pool.query(
      "SELECT id, bill_no, customer_name, order_type, status, created_at FROM orders WHERE order_type = 'PRE_ORDER' OR status = 'SCHEDULED'"
    );
    console.log(`Found ${orderRes.rows.length} pre-orders/scheduled orders in the orders table.`);
    orderRes.rows.forEach(row => {
      console.log(` - ID: ${row.id}, Bill No: ${row.bill_no}, Customer: ${row.customer_name}, Type: ${row.order_type}, Status: ${row.status}, Created: ${row.created_at}`);
    });

    // 2. Check restaurants table settings for temp-preorder tables
    const restRes = await pool.query("SELECT id, user_id, settings FROM restaurants");
    for (const row of restRes.rows) {
      if (row.settings) {
        let updated = false;
        const settings = { ...row.settings };
        for (const key of Object.keys(settings)) {
          if (key.startsWith("active_pos_state")) {
            const val = settings[key] || {};
            if (val.tables) {
              const originalLength = val.tables.length;
              // Filter out temporary pre-order tables
              val.tables = val.tables.filter(t => !String(t.id).startsWith("temp-preorder-"));
              if (val.tables.length !== originalLength) {
                console.log(`[CLEANUP] Found temp-preorder tables in key '${key}' for restaurant user_id ${row.user_id}. Removing...`);
                updated = true;
              }
            }
            if (val.tableBills) {
              for (const tId of Object.keys(val.tableBills)) {
                if (tId.startsWith("temp-preorder-")) {
                  delete val.tableBills[tId];
                  console.log(`[CLEANUP] Removing tableBills for '${tId}' in key '${key}' for restaurant user_id ${row.user_id}.`);
                  updated = true;
                }
              }
            }
            if (val.tableCustomers) {
              for (const tId of Object.keys(val.tableCustomers)) {
                if (tId.startsWith("temp-preorder-")) {
                  delete val.tableCustomers[tId];
                  console.log(`[CLEANUP] Removing tableCustomers for '${tId}' in key '${key}' for restaurant user_id ${row.user_id}.`);
                  updated = true;
                }
              }
            }
            if (val.tableStatuses) {
              for (const tId of Object.keys(val.tableStatuses)) {
                if (tId.startsWith("temp-preorder-")) {
                  delete val.tableStatuses[tId];
                  updated = true;
                }
              }
            }
            if (val.tableBillNumbers) {
              for (const tId of Object.keys(val.tableBillNumbers)) {
                if (tId.startsWith("temp-preorder-")) {
                  delete val.tableBillNumbers[tId];
                  updated = true;
                }
              }
            }
            if (val.tableActiveTimestamps) {
              for (const tId of Object.keys(val.tableActiveTimestamps)) {
                if (tId.startsWith("temp-preorder-")) {
                  delete val.tableActiveTimestamps[tId];
                  updated = true;
                }
              }
            }
          }
        }
        if (updated) {
          await pool.query(
            "UPDATE restaurants SET settings = $1 WHERE id = $2",
            [JSON.stringify(settings), row.id]
          );
          console.log(`[DB UPDATE] Cleaned settings for restaurant ID ${row.id}`);
        }
      }
    }
    console.log("Cleanup scan completed.");
  } catch (err) {
    console.error("Error during scan:", err);
  } finally {
    pool.end();
  }
}

checkAndClear();
