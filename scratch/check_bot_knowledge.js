const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const res = await pool.query("SELECT bot_knowledge, name FROM app_users WHERE id = 48");
    console.log('App user info:', res.rows[0]);
    
    const res2 = await pool.query("SELECT name, settings FROM restaurants WHERE user_id = 48");
    console.log('Restaurant info:', res2.rows[0]);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
