const { Pool } = require('pg');
require('dotenv').config({ path: 'c:/Users/Sajad/Desktop/SaSLoop/.env' });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function checkDb() {
  try {
    const usersCols = await pool.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'app_users'`
    );
    console.log('--- app_users Columns ---');
    console.log(usersCols.rows.map(r => `${r.column_name} (${r.data_type})`));

    const restCols = await pool.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'restaurants'`
    );
    console.log('--- restaurants Columns ---');
    console.log(restCols.rows.map(r => `${r.column_name} (${r.data_type})`));

    const res = await pool.query("SELECT * FROM app_users LIMIT 1");
    console.log('--- Example app_user row ---');
    console.log(res.rows[0]);
  } catch (err) {
    console.error('Database query error:', err);
  } finally {
    await pool.end();
  }
}

checkDb();
