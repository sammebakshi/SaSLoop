const pool = require("../db");

async function findWasim() {
  try {
    const res = await pool.query("SELECT id, name, username, role, staff_permissions FROM app_users WHERE name ILIKE '%wasim%' OR username ILIKE '%wasim%'");
    if (res.rows.length > 0) {
      console.log("Found matches:");
      res.rows.forEach(row => {
        console.log("Username:", row.username);
        console.log("Name:", row.name);
        console.log("Role:", row.role);
        console.log("Staff Permissions JSON:", JSON.stringify(row.staff_permissions, null, 2));
      });
    } else {
      console.log("No user found matching 'Wasim'. Let's search all users with role 'staff'.");
      const res2 = await pool.query("SELECT id, name, username, role, staff_permissions FROM app_users WHERE role = 'staff'");
      res2.rows.forEach(row => {
        console.log("Username:", row.username);
        console.log("Name:", row.name);
        console.log("Staff Permissions JSON:", JSON.stringify(row.staff_permissions, null, 2));
      });
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    pool.end();
  }
}
findWasim();
