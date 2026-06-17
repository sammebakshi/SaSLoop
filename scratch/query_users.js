const pool = require("../db");

async function checkUsers() {
  try {
    const res = await pool.query(
      "SELECT id, username, email, phone, role, parent_user_id FROM app_users ORDER BY id ASC"
    );
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkUsers();
