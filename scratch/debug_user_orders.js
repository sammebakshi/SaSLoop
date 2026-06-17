const pool = require("../db");

async function debug() {
  try {
    console.log("=== RESTAURANTS ===");
    const rests = await pool.query("SELECT id, name, user_id FROM restaurants");
    console.log(rests.rows);

    console.log("\n=== APP USERS ===");
    const users = await pool.query("SELECT id, name, email, role, parent_user_id FROM app_users");
    console.log(users.rows);

    console.log("\n=== ORDERS USER IDS ===");
    const ordersUsers = await pool.query("SELECT id, user_id, order_reference, status, created_at FROM orders");
    console.log(ordersUsers.rows);

    console.log("\n=== KOTS USER IDS ===");
    const kotsUsers = await pool.query("SELECT id, user_id, table_number, status, created_at FROM kots");
    console.log(kotsUsers.rows);

  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

debug();
