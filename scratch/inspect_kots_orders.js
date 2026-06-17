const pool = require("../db");

async function inspect() {
  try {
    console.log("--- ORDERS STATUSES ---");
    const orderStatuses = await pool.query("SELECT status, count(*) FROM orders GROUP BY status");
    console.log(orderStatuses.rows);

    console.log("\n--- ORDERS TYPES ---");
    const orderTypes = await pool.query("SELECT order_type, count(*) FROM orders GROUP BY order_type");
    console.log(orderTypes.rows);

    console.log("\n--- ACTIVE ORDERS SAMPLE ---");
    const activeOrders = await pool.query("SELECT id, order_reference, customer_name, total_price, status, order_type, created_at FROM orders WHERE status NOT IN ('COMPLETED', 'CANCELLED', 'DELETED') LIMIT 5");
    console.log(activeOrders.rows);

    console.log("\n--- KOTS STATUSES ---");
    const kotStatuses = await pool.query("SELECT status, count(*) FROM kots GROUP BY status");
    console.log(kotStatuses.rows);

    console.log("\n--- ACTIVE KOTS SAMPLE ---");
    const activeKots = await pool.query("SELECT id, table_number, status, created_at, items FROM kots WHERE status NOT IN ('COMPLETED', 'CANCELLED', 'DELETED') LIMIT 5");
    console.log(activeKots.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

inspect();
