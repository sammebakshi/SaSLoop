const pool = require('../db');
async function run() {
  try {
    const res = await pool.query("SELECT id, menu_name, is_digital_default, is_pos_default, user_id, outlet_id FROM outlet_menus WHERE user_id = 48 OR outlet_id = 48");
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
