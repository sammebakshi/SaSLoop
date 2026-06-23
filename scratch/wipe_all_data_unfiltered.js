const pool = require("../db");

async function wipeAllUnfiltered() {
  try {
    console.log("🧹 STARTING COMPLETE UNFILTERED DATABASE WIPE...");

    const tables = [
      "customer_transactions",
      "customer_loyalty",
      "customer_feedback",
      "conversation_sessions",
      "chat_messages",
      "customers",
      "kots",
      "pre_orders",
      "marketing_contacts",
      "orders",
      "inventory_logs",
      "business_expenses"
    ];

    for (const table of tables) {
      try {
        // Use TRUNCATE with CASCADE to cleanly clear tables that have foreign keys
        await pool.query(`TRUNCATE TABLE ${table} CASCADE`);
        console.log(`✅ Table TRUNCATED: ${table}`);
      } catch (tableErr) {
        // Fallback to DELETE if TRUNCATE fails (e.g. if referenced by tables outside this list)
        try {
          const res = await pool.query(`DELETE FROM ${table}`);
          console.log(`✅ Table DELETED (Fallback): ${table} (${res.rowCount} rows cleared)`);
        } catch (delErr) {
          console.error(`❌ Failed to clear table ${table}:`, delErr.message);
        }
      }
    }

    console.log("\n✨ DATABASE WIPE COMPLETE. ALL TRANSACTIONS, CUSTOMERS, AND ORDERS ARE CLEARED.");
  } catch (err) {
    console.error("❌ General Wipe Error:", err.message);
  } finally {
    pool.end();
  }
}

wipeAllUnfiltered();
