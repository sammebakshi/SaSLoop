const pool = require("../db");

async function check() {
  try {
    const res = await pool.query("SELECT * FROM customer_loyalty WHERE phone = '9876543210' OR phone = '9999999999' OR name LIKE '%Ramesh%' OR name LIKE '%Suresh%'");
    console.log("Found loyalty customers:");
    console.table(res.rows);

    const res2 = await pool.query("SELECT * FROM customers WHERE number LIKE '%9876543210%' OR number LIKE '%9999999999%' OR name LIKE '%Ramesh%' OR name LIKE '%Suresh%'");
    console.log("Found CRM/sales customers:");
    console.table(res2.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
