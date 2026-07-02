const pool = require('../db');

async function run() {
  try {
    const res = await pool.query("SELECT id, username, role, parent_user_id, staff_permissions FROM app_users WHERE id = 57");
    console.log(JSON.stringify(res.rows[0], null, 2));
  } catch (e) {
    console.error("Failed to query staff permissions:", e);
  } finally {
    await pool.end();
  }
}

run();
