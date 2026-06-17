const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const q1 = await pool.query("SELECT * FROM options_list");
    console.log("All items in options_list:");
    q1.rows.forEach(r => console.log(`  ${r.id}: ${r.name}`));
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}
run();
