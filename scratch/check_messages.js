const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const res = await pool.query('SELECT * FROM chat_messages ORDER BY created_at DESC LIMIT 50');
    console.log('Recent 50 chat messages:');
    res.rows.forEach(r => console.log(r));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
