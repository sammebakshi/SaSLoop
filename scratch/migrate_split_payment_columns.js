const pool = require("../db");

async function main() {
  try {
    console.log("🚀 Running orders table split payment columns migration...");

    // Check if paid_amount column already exists
    const checkPaidCol = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orders' AND column_name = 'paid_amount'
    `);
    
    if (checkPaidCol.rows.length === 0) {
      console.log("Adding column 'paid_amount' to 'orders' table...");
      await pool.query("ALTER TABLE orders ADD COLUMN paid_amount NUMERIC DEFAULT 0");
    } else {
      console.log("Column 'paid_amount' already exists.");
    }

    // Check if credit_amount column already exists
    const checkCreditCol = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orders' AND column_name = 'credit_amount'
    `);
    
    if (checkCreditCol.rows.length === 0) {
      console.log("Adding column 'credit_amount' to 'orders' table...");
      await pool.query("ALTER TABLE orders ADD COLUMN credit_amount NUMERIC DEFAULT 0");
    } else {
      console.log("Column 'credit_amount' already exists.");
    }

    console.log("🎉 Migration completed successfully!");
  } catch (err) {
    console.error("🔥 Migration failed:", err);
  } finally {
    await pool.end();
  }
}

main();
