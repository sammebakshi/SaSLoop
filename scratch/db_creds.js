const pool = require("../db");
async function checkCreds() {
  try {
    const res = await pool.query("SELECT id, name, meta_access_token, meta_phone_id, meta_account_id FROM app_users WHERE id = 1 OR meta_access_token IS NOT NULL");
    console.log("==> METRICS / CREDS:", res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
checkCreds();
