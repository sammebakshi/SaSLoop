const pool = require('../db');
const bcrypt = require('bcrypt');

async function hardReset() {
  try {
    console.log("🧹 PURGING ALL USERS...");
    await pool.query('DELETE FROM app_users');
    
    const email = 'master@sasloop.com';
    const pwd = 'Admin@123';
    
    console.log(`Creating fresh Master Admin: ${email}`);
    const hashed = await bcrypt.hash(pwd, 10);
    
    await pool.query(
      "INSERT INTO app_users (first_name, last_name, username, email, password, role, status) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      ['Master', 'Admin', 'masteradmin', email, hashed, 'master_admin', 'active']
    );
    
    console.log("✅ RESET SUCCESSFUL. Total users in DB: 1");
    
    const verify = await pool.query('SELECT * FROM app_users');
    console.log("Verified Record:", verify.rows[0].email);

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
hardReset();
