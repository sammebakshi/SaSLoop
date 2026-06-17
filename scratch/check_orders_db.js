const pool = require("../db");

async function checkAllLoyalty() {
  try {
    const res = await pool.query(`
      SELECT * FROM customer_loyalty LIMIT 10;
    `);
    console.log("All Loyalty Records:");
    console.table(res.rows);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    pool.end();
  }
}

checkAllLoyalty();
