const pool = require('../db');

async function test() {
  try {
    const res = await pool.query(
      `SELECT id, user_id, name, customer_number, balance, points, total_spent 
       FROM customer_loyalty 
       ORDER BY id DESC LIMIT 20`
    );
    console.log("customer_loyalty entries:", res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

test();
