const pool = require('../db');
const bcrypt = require('bcryptjs');

async function checkUser() {
  try {
    const res = await pool.query("SELECT id, username, email, role, user_type, web_access, status, password FROM app_users WHERE username = 'shahetehzeeb' OR email = 'shahetehzeeb'");
    console.log("USERS FOUND:", res.rows.map(r => ({
      id: r.id,
      username: r.username,
      email: r.email,
      role: r.role,
      user_type: r.user_type,
      web_access: r.web_access,
      status: r.status,
      password_hash: r.password
    })));

    if (res.rows.length > 0) {
      const match = await bcrypt.compare('1234', res.rows[0].password);
      console.log("PASSWORD MATCH TEST FOR '1234':", match);
    }
  } catch (e) {
    console.error("DB QUERY ERROR:", e);
  } finally {
    process.exit();
  }
}

checkUser();
