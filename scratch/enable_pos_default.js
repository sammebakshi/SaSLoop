const pool = require('../db');

async function enablePosDefault() {
  try {
    await pool.query("UPDATE outlet_menus SET is_pos_default = true WHERE id = 34");
    console.log("Updated Menu 34 (pos menu) to is_pos_default = true");
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}

enablePosDefault();
