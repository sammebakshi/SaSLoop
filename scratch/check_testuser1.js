const pool = require("../db");
async function checkTestUser() {
  try {
    const res = await pool.query("SELECT * FROM app_users WHERE username = 'testuser1'");
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}
checkTestUser();
