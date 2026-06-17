const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const res = await pool.query(`
      SELECT customer_number, role, text, created_at 
      FROM chat_messages 
      ORDER BY created_at DESC 
      LIMIT 30
    `);
    console.log('Recent chat messages:');
    res.rows.reverse().forEach(row => {
      console.log(`[${row.created_at.toISOString()}] ${row.role.toUpperCase()} to ${row.customer_number}: ${row.text.substring(0, 150)}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
