const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const res = await pool.query("SELECT id, items FROM orders WHERE items::text LIKE '%HALF%' OR items::text LIKE '%FULL%' LIMIT 10");
    console.log('Orders with HALF or FULL:');
    res.rows.forEach(r => console.log(`  Order ${r.id}:`, JSON.stringify(r.items)));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
