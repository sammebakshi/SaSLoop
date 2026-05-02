const pool = require('../db');
async function check() {
  try {
    const res = await pool.query("SELECT to_regclass('public.pos_tables')");
    console.log(res.rows[0]);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
check();
