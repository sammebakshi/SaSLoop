const pool = require('../db');
const bcrypt = require('bcrypt');

async function reset() {
  try {
    const email = 'admin@loop.com';
    const pwd = 'Loop@2026';
    
    console.log("Hashing Loop@2026...");
    const hashed = await bcrypt.hash(pwd, 10);
    
    // Check if exists
    const check = await pool.query('SELECT * FROM app_users WHERE email = $1', [email]);
    if (check.rows.length > 0) {
        await pool.query('UPDATE app_users SET password = $1, role = \'master_admin\' WHERE email = $2', [hashed, email]);
    } else {
        await pool.query(
            "INSERT INTO app_users (first_name, last_name, username, email, password, role, status) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            ['Admin', 'Loop', 'adminloop', email, hashed, 'master_admin', 'active']
        );
    }
    console.log("SUCCESS: Master Admin set to admin@loop.com / Loop@2026");

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
reset();
