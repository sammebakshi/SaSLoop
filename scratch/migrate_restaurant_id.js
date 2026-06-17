const pool = require('../db');

async function runMigration() {
  try {
    // Check how many orders have null restaurant_id
    const nullCount = await pool.query("SELECT COUNT(*) FROM orders WHERE restaurant_id IS NULL");
    console.log("Orders with null restaurant_id:", nullCount.rows[0].count);
    
    // Update them
    const updateRes = await pool.query(`
      UPDATE orders 
      SET restaurant_id = r.id 
      FROM restaurants r 
      WHERE orders.user_id = r.user_id AND orders.restaurant_id IS NULL
    `);
    console.log("Updated rows count:", updateRes.rowCount);
    
    // Check again
    const postCount = await pool.query("SELECT COUNT(*) FROM orders WHERE restaurant_id IS NULL");
    console.log("Orders with null restaurant_id after update:", postCount.rows[0].count);
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
runMigration();
