const pool = require('../db');
async function run() {
  try {
    const resUsers = await pool.query("SELECT count(*) FROM app_users WHERE role='user'");
    console.log("Total Users (role=user):", resUsers.rows[0].count);
    
    const resAdmins = await pool.query("SELECT count(*) FROM app_users WHERE role LIKE 'admin%'");
    console.log("Total Admins:", resAdmins.rows[0].count);
    
    const resDetails = await pool.query("SELECT id, username, role, created_by FROM app_users");
    console.log("User Table Records:");
    console.table(resDetails.rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
run();
