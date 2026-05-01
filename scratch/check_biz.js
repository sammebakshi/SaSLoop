const pool = require("../db");
async function check() {
  try {
    const res = await pool.query("SELECT id, user_id, name, social_facebook, social_instagram, settings FROM restaurants WHERE name ILIKE '%SHAHE%';");
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}
check();
