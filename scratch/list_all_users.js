const pool = require("../db");

async function listAll() {
  try {
    const res = await pool.query("SELECT id, name, username, role, staff_permissions FROM app_users");
    console.log("Total users found:", res.rows.length);
    res.rows.forEach(row => {
      console.log(`ID: ${row.id}, Name: ${row.name}, Username: ${row.username}, Role: ${row.role}`);
      console.log("Permissions:", JSON.stringify(row.staff_permissions, null, 2));
      console.log("----------------------------------------");
    });
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    pool.end();
  }
}
listAll();
