const pool = require("../db");

async function checkOrder() {
  try {
    const res = await pool.query("SELECT * FROM orders WHERE order_reference = 'QR-6L26T8' OR order_reference ILIKE '%6L26T8%'");
    console.log("Order row found:", res.rows);

    const allOrdersRes = await pool.query("SELECT id, order_reference, customer_name, customer_number, table_number, items, total_price, status, created_at FROM orders WHERE table_number ILIKE '%1%' ORDER BY created_at DESC LIMIT 10");
    console.log("\nRecent orders for Table 1:", allOrdersRes.rows);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkOrder();
