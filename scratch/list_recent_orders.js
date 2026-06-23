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
    const res = await pool.query("SELECT id, customer_name, customer_number, total_price, status, created_at, bill_no FROM orders ORDER BY created_at DESC LIMIT 10");
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
