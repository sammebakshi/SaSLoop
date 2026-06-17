const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const res = await pool.query(
      `SELECT role, text, created_at 
       FROM chat_messages 
       WHERE customer_number LIKE '%7006089744%' 
       ORDER BY created_at DESC LIMIT 10`
    );
    console.log('Recent chat messages:');
    res.rows.forEach(r => {
      console.log(`[${r.created_at.toISOString()}] ${r.role.toUpperCase()}: ${JSON.stringify(r.text)}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
