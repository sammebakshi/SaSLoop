const pool = require("../db");

async function wipeDynamic() {
  try {
    console.log("🔍 RESOLVING USER IDS FOR TEHZEEB ACCOUNTS...");
    const userRes = await pool.query(
      "SELECT id, username, email FROM app_users WHERE username ILIKE '%tehzeeb%'"
    );
    const userIds = userRes.rows.map(r => r.id);

    if (userIds.length === 0) {
      console.log("❌ No Tehzeeb users found. Aborting wipe.");
      return;
    }

    console.log(`👤 Found User IDs to wipe: ${userIds.join(", ")} (${userRes.rows.map(r => r.username).join(", ")})`);

    const queries = [
      { name: "customer_transactions", q: "DELETE FROM customer_transactions WHERE user_id = ANY($1)" },
      { name: "customer_loyalty", q: "DELETE FROM customer_loyalty WHERE user_id = ANY($1)" },
      { name: "customer_feedback", q: "DELETE FROM customer_feedback WHERE user_id = ANY($1)" },
      { name: "conversation_sessions", q: "DELETE FROM conversation_sessions WHERE user_id = ANY($1)" },
      { name: "chat_messages", q: "DELETE FROM chat_messages WHERE user_id = ANY($1)" },
      { name: "customers", q: "DELETE FROM customers WHERE user_id = ANY($1)" },
      { name: "kots", q: "DELETE FROM kots WHERE user_id = ANY($1)" },
      { name: "pre_orders", q: "DELETE FROM pre_orders WHERE user_id = ANY($1)" },
      { name: "marketing_contacts", q: "DELETE FROM marketing_contacts WHERE user_id = ANY($1)" },
      { name: "orders", q: "DELETE FROM orders WHERE user_id = ANY($1)" },
      { name: "inventory_logs", q: "DELETE FROM inventory_logs WHERE biz_id = ANY($1)" }
    ];

    for (const item of queries) {
      const res = await pool.query(item.q, [userIds]);
      console.log(`✅ Cleared ${res.rowCount} rows from table: ${item.name}`);
    }

    console.log("\n✨ DYNAMIC WIPE COMPLETE.");
  } catch (err) {
    console.error("❌ Wipe Error:", err.message);
  } finally {
    pool.end();
  }
}

wipeDynamic();
