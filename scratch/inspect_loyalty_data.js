const pool = require('../db');

async function inspect() {
  try {
    console.log("=== RESTAURANTS ===");
    const resRes = await pool.query(
      `SELECT id, user_id, name, loyalty_enabled, points_per_100, 
              loyalty_bill_amount_threshold, loyalty_points_earned, 
              loyalty_points_dinein, loyalty_points_pickup, loyalty_points_delivery 
       FROM restaurants`
    );
    console.table(resRes.rows);

    console.log("\n=== RECENT ORDERS ===");
    const ordRes = await pool.query(
      `SELECT id, user_id, order_reference, customer_name, customer_number, 
              total_price, status, payment_method, order_type, table_number, created_at 
       FROM orders 
       ORDER BY created_at DESC LIMIT 5`
    );
    console.table(ordRes.rows);

    console.log("\n=== CUSTOMER LOYALTY ===");
    const loyRes = await pool.query(
      `SELECT id, user_id, customer_number, name, points, balance, total_spent, last_visit 
       FROM customer_loyalty 
       ORDER BY id DESC LIMIT 10`
    );
    console.table(loyRes.rows);

    console.log("\n=== CUSTOMERS ===");
    const custRes = await pool.query(
      `SELECT id, user_id, name, number, address 
       FROM customers 
       ORDER BY id DESC LIMIT 10`
    );
    console.table(custRes.rows);

  } catch (err) {
    console.error("Diagnostic failed:", err);
  } finally {
    await pool.end();
  }
}

inspect();
