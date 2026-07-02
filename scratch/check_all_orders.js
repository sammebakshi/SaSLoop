const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sasloop_db',
  password: process.env.DB_PASSWORD || 'Admin@123',
  port: process.env.DB_PORT || 5432,
});

async function checkAll() {
  try {
    const res = await pool.query('SELECT count(*) FROM orders');
    console.log('Total orders count:', res.rows[0].count);

    const ordersRes = await pool.query('SELECT id, bill_no, total_price, status, created_at, source FROM orders ORDER BY created_at DESC');
    console.log('All Orders inside DB:');
    console.table(ordersRes.rows);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

checkAll();
