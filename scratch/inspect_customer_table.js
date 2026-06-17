const pool = require("../db");

async function check() {
  try {
    const res = await pool.query("SELECT * FROM customers");
    console.log("=== CUSTOMERS ===");
    console.table(res.rows);

    const res2 = await pool.query("SELECT * FROM customer_loyalty");
    console.log("=== CUSTOMER_LOYALTY ===");
    console.table(res2.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
