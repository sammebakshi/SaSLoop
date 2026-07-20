const pool = require('../db');
const bcrypt = require('bcryptjs');

async function resetPassword() {
  try {
    const hashedPassword = await bcrypt.hash('1234', 10);
    const res = await pool.query(
      "UPDATE app_users SET password = $1 WHERE username = 'shahetehzeeb' OR email = 'shahe.tehzeeb@gmail.com' RETURNING id, username, email",
      [hashedPassword]
    );
    console.log("Password updated successfully for users:", res.rows);
  } catch (err) {
    console.error("Failed to update password:", err);
  } finally {
    process.exit();
  }
}

resetPassword();
