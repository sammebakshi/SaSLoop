const pool = require("../db");

async function listUsers() {
  try {
    const res = await pool.query(
      "SELECT id, username, email, phone, role, parent_user_id, status, meta_phone_id FROM app_users ORDER BY id ASC"
    );
    console.log("=== ALL APP USERS ===");
    res.rows.forEach(row => {
      console.log(`ID: ${row.id} | Username: ${row.username} | Role: ${row.role} | Parent: ${row.parent_user_id} | Status: ${row.status} | Meta ID: ${row.meta_phone_id}`);
    });

    const restRes = await pool.query("SELECT id, user_id, name FROM restaurants");
    console.log("\n=== ALL RESTAURANTS ===");
    restRes.rows.forEach(r => {
      console.log(`Restaurant ID: ${r.id} | Owner User ID: ${r.user_id} | Name: ${r.name}`);
    });
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await pool.end();
  }
}

listUsers();
