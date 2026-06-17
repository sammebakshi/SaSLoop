const pool = require("../db");

async function checkStats() {
  try {
    console.log("🔍 QUERYING USER LIST & DATA COUNTS...");
    const users = await pool.query("SELECT id, username, email, role FROM app_users");
    console.log("\n👤 App Users in DB:");
    console.table(users.rows);

    console.log("\n📊 Orders count by user_id:");
    const orders = await pool.query("SELECT user_id, COUNT(*) FROM orders GROUP BY user_id");
    console.table(orders.rows);

    console.log("\n👥 Customers count by user_id:");
    const customers = await pool.query("SELECT user_id, COUNT(*) FROM customers GROUP BY user_id");
    console.table(customers.rows);

    console.log("\n💳 Customer Loyalty count by user_id:");
    const loyalty = await pool.query("SELECT user_id, COUNT(*) FROM customer_loyalty GROUP BY user_id");
    console.table(loyalty.rows);

  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    pool.end();
  }
}

checkStats();
