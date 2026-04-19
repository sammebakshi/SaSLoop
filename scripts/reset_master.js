const pool = require('../db');
const bcrypt = require('bcrypt');

async function reset() {
  try {
    const email = 'master@sasloop.com';
    const pwd = 'password123';
    
    console.log("Hashing password123...");
    const hashed = await bcrypt.hash(pwd, 10);
    
    await pool.query('UPDATE app_users SET password = $1 WHERE email = $2', [hashed, email]);
    console.log("SUCCESS: Password reset to 'password123' for master@sasloop.com");

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
reset();
