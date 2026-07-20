const pool = require('../db');

async function checkAppUsersColumns() {
  try {
    const res = await pool.query("SELECT * FROM app_users LIMIT 5");
    console.log("App Users:", res.rows);
  } catch (err) {
    console.error("DB Error:", err.message);
  } finally {
    process.exit();
  }
}

checkAppUsersColumns();
