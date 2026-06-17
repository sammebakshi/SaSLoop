const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:Admin%40123@localhost:5432/sasloop_db"
});

async function run() {
  console.log("Wiping all customers, loyalty, transactions, feedback, and sales/orders...");
  try {
    // We execute cascades to handle foreign keys automatically
    await pool.query("TRUNCATE TABLE customer_transactions CASCADE;");
    await pool.query("TRUNCATE TABLE customer_loyalty CASCADE;");
    await pool.query("TRUNCATE TABLE customer_feedback CASCADE;");
    await pool.query("TRUNCATE TABLE conversation_sessions CASCADE;");
    await pool.query("TRUNCATE TABLE chat_messages CASCADE;");
    await pool.query("TRUNCATE TABLE customers CASCADE;");
    await pool.query("TRUNCATE TABLE kots CASCADE;");
    await pool.query("TRUNCATE TABLE pre_orders CASCADE;");
    await pool.query("TRUNCATE TABLE orders CASCADE;");
    console.log("✅ Wiped successfully!");
  } catch (err) {
    console.error("❌ Error wiping tables:", err.message);
  } finally {
    await pool.end();
  }
}

run();
