const pool = require('../db');

async function test() {
  try {
    const resLoyalty = await pool.query("SELECT user_id, customer_number, name, points, balance, total_spent FROM customer_loyalty LIMIT 20");
    console.log("--- CUSTOMER LOYALTY SAMPLE ---");
    console.table(resLoyalty.rows);

    const resCust = await pool.query("SELECT user_id, number, name FROM customers LIMIT 20");
    console.log("--- CUSTOMERS SAMPLE ---");
    console.table(resCust.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

test();
