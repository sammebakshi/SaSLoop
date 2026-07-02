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
    const userRes = await pool.query('SELECT * FROM app_users WHERE id = 57');
    console.log('User 57:', userRes.rows[0]);
    
    const allUsers = await pool.query('SELECT id, email, role, phone FROM app_users');
    console.log('All Users:', allUsers.rows);
  } catch (err) {
    console.error('Database query error:', err.message);
  } finally {
    await pool.end();
  }
}

checkUser();
