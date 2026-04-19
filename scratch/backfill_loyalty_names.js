const pool = require('../db');

async function backfill() {
  try {
    // 1. Add name column if missing
    await pool.query("ALTER TABLE customer_loyalty ADD COLUMN IF NOT EXISTS name VARCHAR(255) DEFAULT 'Customer'");
    console.log("✅ name column ensured");

    // 2. Backfill names from marketing_contacts
    const result = await pool.query(`
      UPDATE customer_loyalty cl
      SET name = mc.name
      FROM marketing_contacts mc
      WHERE mc.user_id = cl.user_id 
        AND mc.phone_number = cl.customer_number
        AND (cl.name IS NULL OR cl.name = 'Customer')
        AND mc.name IS NOT NULL 
        AND mc.name != 'Customer'
    `);
    console.log(`✅ Backfilled ${result.rowCount} loyalty records with names from marketing_contacts`);

    // 3. Also try to backfill from orders table
    const result2 = await pool.query(`
      UPDATE customer_loyalty cl
      SET name = sub.customer_name
      FROM (
        SELECT DISTINCT ON (user_id, customer_number) user_id, customer_number, customer_name
        FROM orders
        WHERE customer_name IS NOT NULL AND customer_name != 'Guest'
        ORDER BY user_id, customer_number, created_at DESC
      ) sub
      WHERE sub.user_id = cl.user_id 
        AND sub.customer_number = cl.customer_number
        AND (cl.name IS NULL OR cl.name = 'Customer')
    `);
    console.log(`✅ Backfilled ${result2.rowCount} more loyalty records with names from orders`);

    // 4. Show updated data
    const check = await pool.query("SELECT id, customer_number, name, points, total_spent FROM customer_loyalty LIMIT 10");
    console.log("Sample data:", JSON.stringify(check.rows, null, 2));
  } catch (e) {
    console.error("Backfill error:", e.message);
  }
  process.exit();
}
backfill();
