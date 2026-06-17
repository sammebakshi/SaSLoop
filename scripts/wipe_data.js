const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sasloop_db',
  password: process.env.DB_PASSWORD || 'Admin@123',
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function run() {
  console.log("Wiping all customers, loyalty, transactions, feedback, and sales/orders...");
  try {
    await pool.query("TRUNCATE TABLE customer_transactions CASCADE;");
    await pool.query("TRUNCATE TABLE customer_loyalty CASCADE;");
    await pool.query("TRUNCATE TABLE customer_feedback CASCADE;");
    await pool.query("TRUNCATE TABLE conversation_sessions CASCADE;");
    await pool.query("TRUNCATE TABLE chat_messages CASCADE;");
    await pool.query("TRUNCATE TABLE customers CASCADE;");
    await pool.query("TRUNCATE TABLE kots CASCADE;");
    await pool.query("TRUNCATE TABLE pre_orders CASCADE;");
    await pool.query("TRUNCATE TABLE orders CASCADE;");
    console.log("✅ Wiped successfully!");
  } catch (err) {
    console.error("❌ Error wiping tables:", err.message);
  } finally {
    await pool.end();
  }
}

run();
