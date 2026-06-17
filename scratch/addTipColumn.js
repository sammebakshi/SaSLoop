const { Pool } = require('pg');
require('dotenv').config({ path: 'c:/Users/Sajad/Desktop/SaSLoop/.env' });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function addTip() {
  try {
    console.log("Adding tip_amount column to orders table...");
    await pool.query(`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS tip_amount NUMERIC DEFAULT 0;
    `);
    console.log("tip_amount column added successfully!");
  } catch (err) {
    console.error("Failed to add tip_amount column:", err);
  } finally {
    await pool.end();
  }
}

addTip();
