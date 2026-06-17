const pool = require("../db");

async function check() {
  try {
    const res = await pool.query(
      `SELECT DISTINCT ON (customer_number) customer_number, created_at 
       FROM chat_messages 
       WHERE role = 'customer' AND created_at >= NOW() - INTERVAL '24 hours'
       ORDER BY customer_number, created_at DESC`
    );
    console.log("=== Active Open Window Contacts ===");
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
