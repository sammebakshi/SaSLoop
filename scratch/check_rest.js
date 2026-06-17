const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const rests = await pool.query("SELECT id, user_id, name FROM restaurants");
    console.log('Restaurants:', rests.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
