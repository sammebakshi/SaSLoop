const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sasloop_db',
  password: process.env.DB_PASSWORD || 'Admin@123',
  port: process.env.DB_PORT || 5432,
});

async function checkUser() {
  try {
    const userRes = await pool.query("SELECT id, username, name FROM app_users WHERE username ILIKE '%shahe%' OR name ILIKE '%shahe%'");
    console.log('Matching users:');
    console.table(userRes.rows);

    const restRes = await pool.query("SELECT id, user_id, name FROM restaurants WHERE name ILIKE '%shahe%'");
    console.log('Matching restaurants:');
    console.table(restRes.rows);

    if (userRes.rows.length > 0) {
      const userIds = userRes.rows.map(u => u.id);
      const ordersRes = await pool.query(
        "SELECT id, user_id, bill_no, total_price, status, created_at, source FROM orders WHERE user_id = ANY($1) ORDER BY created_at DESC",
        [userIds]
      );
      console.log('Orders for matching users:');
      console.table(ordersRes.rows);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

checkUser();
