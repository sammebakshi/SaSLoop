const pool = require('../db');

async function run() {
  try {
    const res = await pool.query(
      `SELECT customer_number, role, text, created_at 
       FROM chat_messages 
       WHERE customer_number IN ('+919469697216', '+917006089744', '+918494089744', '+918715000292', '919469697216', '917006089744', '918494089744', '918715000292')
       ORDER BY customer_number, created_at ASC`
    );
    console.log(`Found ${res.rows.length} messages in database:`);
    res.rows.forEach(r => {
      console.log(`[${r.created_at.toISOString()}] ${r.customer_number} | ${r.role} | "${r.text.substring(0, 100)}"`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
