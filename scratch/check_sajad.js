const pool = require('../db');

async function test() {
  try {
    console.log("\n=== CUSTOMERS FOR 7006089744 ===");
    const cust = await pool.query("SELECT * FROM customers WHERE number LIKE '%7006089744%'");
    console.table(cust.rows);

    console.log("\n=== CUSTOMER_LOYALTY FOR 7006089744 ===");
    const loyalty = await pool.query("SELECT * FROM customer_loyalty WHERE customer_number LIKE '%7006089744%'");
    console.table(loyalty.rows);

  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

test();
