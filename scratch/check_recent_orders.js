const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sasloop_db',
  password: process.env.DB_PASSWORD || 'Admin@123',
  port: process.env.DB_PORT || 5432,
});

async function checkOrders() {
  try {
    const res = await pool.query('SELECT id, bill_no, total_price, status, created_at, source FROM orders ORDER BY id DESC LIMIT 20');
    console.log('Recent Orders:');
    console.table(res.rows);
  } catch (err) {
    console.error('Database query error:', err.message);
  } finally {
    await pool.end();
  }
}

checkOrders();
