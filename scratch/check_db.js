const pool = require('../db');

async function run() {
  try {
    const res = await pool.query("SELECT id, name, username, role, user_type, staff_permissions FROM app_users WHERE staff_permissions IS NOT NULL AND staff_permissions != '{}' LIMIT 20");
    console.log("Found users with permissions:", res.rows.length);
    res.rows.forEach(u => {
      console.log(`\nUser: ${u.name} (${u.username}), Role: ${u.role}, Type: ${u.user_type}`);
      console.log("Permissions:", JSON.stringify(u.staff_permissions, null, 2));
    });
  } catch (err) {
    console.error("Database query failed:", err);
  } finally {
    await pool.end();
  }
}

run();
