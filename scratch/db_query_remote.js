const pool = require("../db");

async function run() {
  try {
    console.log("=== REMOTE DB INSPECT ===");

    // Query all users
    const usersRes = await pool.query("SELECT id, username, name, email, role, business_name, brand_name FROM app_users LIMIT 50");
    console.log("app_users records:");
    console.table(usersRes.rows);

    // Query all restaurants
    const restRes = await pool.query("SELECT id, name, user_id FROM restaurants LIMIT 50");
    console.log("restaurants records:");
    console.table(restRes.rows);

  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    await pool.end();
  }
}

run();
