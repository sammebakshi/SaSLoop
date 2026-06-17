const pool = require("../db");

async function check() {
  try {
    const res = await pool.query("SELECT * FROM outlet_menus LIMIT 10");
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
check();
