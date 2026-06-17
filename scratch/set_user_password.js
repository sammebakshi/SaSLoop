const pool = require('../db');
const bcrypt = require('bcrypt');

async function run() {
  try {
    const hashedPassword = await bcrypt.hash('123456', 10);
    const result = await pool.query(
      "UPDATE app_users SET password = $1 WHERE username = $2 RETURNING id, username",
      [hashedPassword, 'shahetehzeeb']
    );
    console.log('Password updated successfully for:', result.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

run();
