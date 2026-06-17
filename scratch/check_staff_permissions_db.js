const pool = require("../db");

async function check() {
  try {
    const res = await pool.query("SELECT id, username, role, staff_permissions FROM app_users WHERE username = 'shahetehzeebpos'");
    if (res.rows.length > 0) {
      console.log("Found staff user:", res.rows[0].username);
      console.log("Role:", res.rows[0].role);
      console.log("Staff Permissions JSON:", JSON.stringify(res.rows[0].staff_permissions, null, 2));
    } else {
      console.log("User shahetehzeebpos not found.");
      // List some users
      const res2 = await pool.query("SELECT id, username, role FROM app_users LIMIT 10");
      console.log("Other users:", res2.rows);
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    pool.end();
  }
}
check();
