const pool = require("../db");

async function check() {
  try {
    const resOrders = await pool.query(`
      SELECT 
        status, 
        COUNT(*) as count, 
        SUM(total_price) as sum_total_price 
      FROM orders 
      GROUP BY status
    `);
    console.log("=== ORDERS BY STATUS ===");
    console.table(resOrders.rows);

    const resUserOrders = await pool.query(`
      SELECT 
        user_id, 
        status, 
        COUNT(*) as count, 
        SUM(total_price) as sum_total_price 
      FROM orders 
      GROUP BY user_id, status
    `);
    console.log("=== ORDERS BY USER AND STATUS ===");
    console.table(resUserOrders.rows);

    const resPayments = await pool.query(`
      SELECT 
        payment_method, 
        status, 
        COUNT(*) as count, 
        SUM(total_price) as sum_total_price 
      FROM orders 
      GROUP BY payment_method, status
    `);
    console.log("=== ORDERS BY PAYMENT METHOD AND STATUS ===");
    console.table(resPayments.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
