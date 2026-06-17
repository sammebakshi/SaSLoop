const { Pool } = require('pg');
require('dotenv').config({ path: 'c:/Users/Sajad/Desktop/SaSLoop/.env' });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function addColumns() {
  try {
    console.log("Adding missing columns to orders table...");
    await pool.query(`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax_cgst NUMERIC DEFAULT 0;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax_sgst NUMERIC DEFAULT 0;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS bill_no VARCHAR(50);
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_type VARCHAR(50);
    `);
    console.log("Columns added successfully!");
  } catch (err) {
    console.error("Failed to add columns:", err);
  } finally {
    await pool.end();
  }
}

addColumns();
