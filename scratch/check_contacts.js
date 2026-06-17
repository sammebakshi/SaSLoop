const pool = require("../db");

async function check() {
  try {
    const custRes = await pool.query("SELECT id, name, number FROM customers");
    console.log("=== CUSTOMERS ===");
    console.table(custRes.rows);

    const loyRes = await pool.query("SELECT id, name, customer_number, points FROM customer_loyalty");
    console.log("=== CUSTOMER LOYALTY ===");
    console.table(loyRes.rows);

    const msgRes = await pool.query("SELECT DISTINCT customer_number FROM chat_messages");
    console.log("=== UNIQUE CHAT MESSAGE NUMBERS ===");
    console.table(msgRes.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
