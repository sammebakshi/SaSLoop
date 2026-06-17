const pool = require("../db");
async function checkUsers() {
  try {
    const res = await pool.query("SELECT id, username, email, role, web_access, parent_user_id, owner_id FROM app_users WHERE id IN (12, 48)");
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}
checkUsers();
