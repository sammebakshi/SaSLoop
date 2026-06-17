const pool = require("../db");

async function wipeData() {
  const userId = 55;
  console.log(`🧹 WIPING ALL SALES AND CUSTOMER DATA FOR USER ID: ${userId}...`);

  const queries = [
    { name: "customer_transactions", q: "DELETE FROM customer_transactions WHERE user_id = $1" },
    { name: "customer_loyalty", q: "DELETE FROM customer_loyalty WHERE user_id = $1" },
    { name: "customer_feedback", q: "DELETE FROM customer_feedback WHERE user_id = $1" },
    { name: "conversation_sessions", q: "DELETE FROM conversation_sessions WHERE user_id = $1" },
    { name: "chat_messages", q: "DELETE FROM chat_messages WHERE user_id = $1" },
    { name: "customers", q: "DELETE FROM customers WHERE user_id = $1" },
    { name: "kots", q: "DELETE FROM kots WHERE user_id = $1" },
    { name: "pre_orders", q: "DELETE FROM pre_orders WHERE user_id = $1" },
    { name: "marketing_contacts", q: "DELETE FROM marketing_contacts WHERE user_id = $1" },
    { name: "orders", q: "DELETE FROM orders WHERE user_id = $1" },
    { name: "inventory_logs", q: "DELETE FROM inventory_logs WHERE biz_id = $1" }
  ];

  for (const item of queries) {
    try {
      const res = await pool.query(item.q, [userId]);
      console.log(`✅ Cleared ${res.rowCount} rows from table: ${item.name}`);
    } catch (err) {
      console.error(`❌ Failed to clear table ${item.name}:`, err.message);
    }
  }

  console.log("\n✨ DATABASE WIPE FOR USER 55 COMPLETE.");
  pool.end();
}

wipeData();
