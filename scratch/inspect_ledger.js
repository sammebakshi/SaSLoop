const pool = require("../db");

async function run() {
  try {
    console.log("INSPECTING CUSTOMERS AND TRANSACTIONS:");

    const customers = await pool.query("SELECT * FROM customers");
    console.log("\nCustomers table:");
    console.table(customers.rows);

    const loyalty = await pool.query("SELECT * FROM customer_loyalty");
    console.log("\nCustomer Loyalty table:");
    console.table(loyalty.rows);

    const transactions = await pool.query("SELECT * FROM customer_transactions");
    console.log("\nCustomer Transactions table:");
    console.table(transactions.rows);

    const orders = await pool.query("SELECT id, customer_name, customer_number, total_price, payment_method, paid_amount, credit_amount FROM orders");
    console.log("\nOrders table:");
    console.table(orders.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
