const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const res = await pool.query("SELECT COUNT(id) FROM chat_messages WHERE customer_number = '+919999999999' AND role = 'customer' AND is_read = false");
    console.log(res.rows[0]);
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

run();
