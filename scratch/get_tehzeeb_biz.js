const pool = require("../db");

async function checkUsers() {
  try {
    const res = await pool.query(
      "SELECT id, username, email, role, parent_user_id FROM app_users WHERE username ILIKE '%tehzeeb%'"
    );
    console.log("Tehzeeb users in DB:", res.rows);
  } catch (err) {
    console.error("Error querying app_users:", err);
  } finally {
    pool.end();
  }
}

checkUsers();
