const pool = require('../db');

async function migrate() {
  try {
    console.log("Starting customer history migration...");
    
    // 1. Add balance column to customer_loyalty
    await pool.query(`
      ALTER TABLE customer_loyalty 
      ADD COLUMN IF NOT EXISTS balance NUMERIC(10, 2) DEFAULT 0.00
    `);
    console.log("Added balance column to customer_loyalty table.");

    // 2. Create customer_transactions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customer_transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        customer_number VARCHAR(50) NOT NULL,
        type VARCHAR(50) NOT NULL, -- 'BALANCE_ADJUSTMENT', 'POINTS_ADJUSTMENT', 'BILL_PAYMENT', 'BALANCE_INITIAL'
        amount NUMERIC(10, 2) DEFAULT 0.00,
        points INTEGER DEFAULT 0,
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Created customer_transactions table.");
    console.log("Migration completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    pool.end();
  }
}

migrate();
