require("dotenv").config();
const pool = require("../db");
async function run() {
  const r = await pool.query("SELECT id, status, customer_name, total_price, order_reference, created_at FROM orders ORDER BY created_at DESC LIMIT 5");
  console.log("RECENT ORDERS:", JSON.stringify(r.rows, null, 2));
  
  // Check conversation_sessions
  const s = await pool.query("SELECT * FROM conversation_sessions LIMIT 5");
  console.log("\nSESSIONS:", JSON.stringify(s.rows, null, 2));

  // Check if chat_messages table exists
  try {
    const t = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_name = 'chat_messages'");
    console.log("\nchat_messages table exists:", t.rows.length > 0);
  } catch(e) { console.log("Error:", e.message); }

  process.exit();
}
run();
