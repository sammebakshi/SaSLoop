const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sasloop_db',
  password: 'Admin@123',
  port: 5432
});

async function check() {
  try {
    const res = await pool.query(`
      SELECT id, total_price, tax_cgst, tax_sgst 
      FROM orders 
      WHERE user_id = 48 AND status = 'COMPLETED'
    `);
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
