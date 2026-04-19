const pool = require('../db');
async function check() {
  try {
    const res = await pool.query("SELECT id, business_name FROM app_users WHERE business_name ILIKE '%Tehzeeb%'");
    console.log("Tehzeeb Users:", res.rows);
    
    const orders = await pool.query("SELECT user_id, count(*) as count FROM orders GROUP BY user_id");
    console.log("Orders grouped by user:", orders.rows);
    
    const loyalty = await pool.query("SELECT user_id, count(*) as count FROM customer_loyalty GROUP BY user_id");
    console.log("Loyalty grouped by user:", loyalty.rows);
    
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
check();
