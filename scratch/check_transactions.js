const pool = require("../db");

async function check() {
  try {
    const res = await pool.query("SELECT * FROM customers LIMIT 20");
    console.log("Customers Rows:");
    console.dir(res.rows, { depth: null });

    const loyaltyRes = await pool.query("SELECT * FROM customer_loyalty LIMIT 20");
    console.log("Customer Loyalty Rows:");
    console.dir(loyaltyRes.rows, { depth: null });
  } catch (err) {
    console.error("Error running check:", err);
  } finally {
    await pool.end();
  }
}

check();
