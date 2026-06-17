const pool = require('../db');

async function testDelete() {
  const phone = '+917006089744';
  try {
    // Find customer and user_id first
    const custRes = await pool.query("SELECT * FROM customers WHERE number = $1", [phone]);
    console.log("Customer records found:", custRes.rows);
    if (custRes.rows.length === 0) {
      console.log("No customer found with number:", phone);
      process.exit();
    }

    const userId = custRes.rows[0].user_id;
    console.log("Attempting deletion for userId:", userId, "and phone:", phone);

    // Run query by query to see which one fails
    const queries = [
      { name: "marketing_contacts", sql: "DELETE FROM marketing_contacts WHERE user_id = $1 AND phone_number = $2" },
      { name: "customer_loyalty", sql: "DELETE FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2" },
      { name: "conversation_sessions", sql: "DELETE FROM conversation_sessions WHERE user_id = $1 AND customer_number = $2" },
      { name: "customer_transactions", sql: "DELETE FROM customer_transactions WHERE user_id = $1 AND customer_number = $2" },
      { name: "customer_feedback", sql: "DELETE FROM customer_feedback WHERE user_id = $1 AND customer_number = $2" },
      { name: "chat_messages", sql: "DELETE FROM chat_messages WHERE user_id = $1 AND customer_number = $2" },
      { name: "customers", sql: "DELETE FROM customers WHERE user_id = $1 AND number = $2" }
    ];

    for (const q of queries) {
      console.log(`Running deletion from ${q.name}...`);
      await pool.query(q.sql, [userId, phone]);
      console.log(`✅ Deleted from ${q.name}`);
    }

    console.log("✨ All queries completed successfully without any error!");
  } catch (err) {
    console.error("🔥 Error caught during deletion:", err);
  } finally {
    process.exit();
  }
}

testDelete();
