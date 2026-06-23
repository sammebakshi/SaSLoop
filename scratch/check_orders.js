const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'sasloop_db',
  password: 'Admin@123',
  port: 5432
});

async function main() {
  try {
    const res = await pool.query("SELECT * FROM orders WHERE customer_name = 'Sajad' OR customer_number LIKE '%7006089744%' ORDER BY created_at DESC LIMIT 5");
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
