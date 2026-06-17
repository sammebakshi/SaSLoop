const pool = require('../db');

async function run() {
  try {
    const res = await pool.query(
      `SELECT customer_number, name, points 
       FROM customer_loyalty 
       WHERE user_id = 48`
    );
    console.log("=== CUSTOMER LOYALTY REGISTRATIONS FOR USER 48 ===");
    res.rows.forEach(r => {
      console.log(`Number: ${r.customer_number} | Name: ${r.name} | Points: ${r.points}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
