const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const res = await pool.query("SELECT id, name, user_id FROM restaurants");
    console.log("Restaurants in database:");
    res.rows.forEach(r => console.log(`  id:${r.id}, name:${r.name}, user_id:${r.user_id}`));
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}
run();
