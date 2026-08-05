const pool = require("../db");

async function checkUsersAndWaiterRequests() {
  try {
    const users = await pool.query("SELECT id, name, username, role, parent_user_id FROM app_users ORDER BY id ASC");
    console.log("=== APP USERS ===");
    console.table(users.rows);

    const restaurants = await pool.query("SELECT id, user_id, name FROM restaurants");
    console.log("=== RESTAURANTS ===");
    console.table(restaurants.rows);

    const waiterRequests = await pool.query("SELECT * FROM waiter_requests ORDER BY id DESC LIMIT 10");
    console.log("=== WAITER REQUESTS ===");
    console.table(waiterRequests.rows);

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

checkUsersAndWaiterRequests();
