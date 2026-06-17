const pool = require('../db');

async function run() {
  try {
    const res = await pool.query(
      `SELECT id, user_id, customer_number, role, text, created_at 
       FROM chat_messages 
       ORDER BY id DESC LIMIT 30`
    );
    console.log(`Found ${res.rows.length} messages in database:`);
    res.rows.forEach(r => {
      console.log(`[${r.created_at.toISOString()}] ID: ${r.id} | User: ${r.user_id} | ${r.customer_number} | ${r.role} | "${r.text}"`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
