const pool = require('../db');

async function run() {
  try {
    const res = await pool.query(
      `SELECT customer_number, COUNT(*) as count, MAX(created_at) as last_seen 
       FROM chat_messages 
       GROUP BY customer_number 
       ORDER BY last_seen DESC`
    );
    console.log("=== ALL CUSTOMER NUMBERS IN CHAT MESSAGES ===");
    res.rows.forEach(r => {
      console.log(`Number: ${r.customer_number} | Msg Count: ${r.count} | Last Seen: ${r.last_seen.toISOString()}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
