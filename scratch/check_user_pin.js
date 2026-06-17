const pool = require("../db");

async function check() {
  try {
    const res = await pool.query(
      "SELECT id, username, email, role, status, pos_pin FROM app_users WHERE username = 'shahetehzeebpos' OR email = 'shahetehzeebpos'"
    );
    console.log("USER DETAILS:", res.rows);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await pool.end();
  }
}

check();
