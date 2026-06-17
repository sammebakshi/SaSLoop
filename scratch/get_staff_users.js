const pool = require("../db");

async function listUsers() {
  try {
    const res = await pool.query(
      "SELECT id, username, email, role, pos_pin, status FROM app_users WHERE role NOT IN ('user', 'brand_owner', 'master_admin') AND (role NOT LIKE 'admin%') LIMIT 10"
    );
    console.log("\n=== VALID POS / STAFF USERS ===");
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

listUsers();
