const pool = require('../db');
const { isBusinessOpen } = require('../utils/businessUtils');

async function run() {
  try {
    const res = await pool.query("SELECT name, settings FROM restaurants WHERE user_id = 48");
    const biz = res.rows[0];
    console.log("Restaurant:", biz.name);
    console.log("Settings:", biz.settings);
    const status = isBusinessOpen(biz.settings);
    console.log("isBusinessOpen status:", status);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
