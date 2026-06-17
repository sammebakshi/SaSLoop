const pool = require("../db");

async function run() {
  try {
    console.log("=== RECENT ORDERS ===");
    const recentOrders = await pool.query("SELECT id, user_id, customer_name, customer_number, total_price, status, created_at, payment_method, order_type, table_number, address FROM orders ORDER BY created_at DESC LIMIT 5");
    console.log(recentOrders.rows);

    console.log("\n=== CUSTOMER LOYALTY RECORDS ===");
    const loyalty = await pool.query("SELECT * FROM customer_loyalty ORDER BY last_visit DESC LIMIT 5");
    console.log(loyalty.rows);

    console.log("\n=== RESTAURANT LOYALTY SETTINGS ===");
    const settings = await pool.query("SELECT id, user_id, loyalty_enabled, points_per_100, loyalty_bill_amount_threshold, loyalty_points_earned, loyalty_points_dinein, loyalty_points_pickup, loyalty_points_delivery FROM restaurants");
    console.log(settings.rows);

  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

run();
