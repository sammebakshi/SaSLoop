const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sasloop_db',
  password: process.env.DB_PASSWORD || 'Admin@123',
  port: process.env.DB_PORT || 5432,
});

async function checkSettings() {
  try {
    const res = await pool.query('SELECT settings FROM restaurants WHERE user_id = 55');
    if (res.rows.length > 0) {
      console.log('Settings for user 55:', JSON.stringify(res.rows[0].settings, null, 2));
    } else {
      console.log('No restaurant found for user 55');
    }
  } catch (err) {
    console.error('Database query error:', err.message);
  } finally {
    await pool.end();
  }
}

checkSettings();
