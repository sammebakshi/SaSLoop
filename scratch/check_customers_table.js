const pool = require('../db');

async function run() {
  try {
    const res = await pool.query(
      `SELECT * FROM customers WHERE user_id = 48`
    );
    console.log("=== CUSTOMERS TABLE ENTRIES FOR USER 48 ===");
    res.rows.forEach(r => {
      console.log(`ID: ${r.id} | Name: ${r.name} | Number: ${r.number} | Address: ${r.address}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
