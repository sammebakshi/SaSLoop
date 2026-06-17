const pool = require('../db');

async function run() {
  try {
    const res = await pool.query(
      `SELECT customer_number, COUNT(*) as count, MIN(created_at) as first_seen, MAX(created_at) as last_seen 
       FROM chat_messages 
       WHERE user_id = 1
       GROUP BY customer_number 
       ORDER BY last_seen DESC`
    );
    console.log("=== USER ID 1 CHAT MESSAGES BY NUMBER ===");
    res.rows.forEach(r => {
      console.log(`Number: ${r.customer_number} | Msg Count: ${r.count} | First: ${r.first_seen.toISOString()} | Last: ${r.last_seen.toISOString()}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
