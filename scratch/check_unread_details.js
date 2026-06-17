const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const res = await pool.query("SELECT id, user_id, customer_number, role, text, is_read, created_at FROM chat_messages WHERE customer_number = '+919999999999' AND role = 'customer' AND is_read = false");
    console.log(res.rows);
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

run();
