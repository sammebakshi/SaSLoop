const pool = require('./db');
const bcrypt = require('bcrypt');

async function createMaster() {
  try {
    const email = 'master@sasloop.com';
    const pwd = 'Admin@123';
    
    console.log("Hashing password...");
    const hashed = await bcrypt.hash(pwd, 10);
    console.log("Hashed password:", hashed);

    // Double check comparison
    const isOk = await bcrypt.compare(pwd, hashed);
    console.log("Verification check:", isOk);

    if(!isOk) {
        throw new Error("Bcrypt verification failed inside script!");
    }

    const checkUser = await pool.query("SELECT * FROM app_users WHERE email = $1", [email]);
    if (checkUser.rows.length > 0) {
      console.log("Updating existing master user...");
      await pool.query("UPDATE app_users SET password = $1 WHERE email = $2", [hashed, email]);
      console.log("Update complete.");
    } else {
      console.log("Creating new master user...");
      await pool.query(
        "INSERT INTO app_users (first_name, last_name, username, email, password, role, status) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        ['Master', 'Admin', 'masteradmin', email, hashed, 'master_admin', 'active']
      );
      console.log("Creation complete.");
    }
  } catch (err) {
    console.error("Master Setup Error:", err);
  } finally {
    await pool.end();
  }
}

createMaster();
