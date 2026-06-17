const pool = require("../db");

async function check() {
  try {
    const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'outlet_menu_items'");
    console.log(res.rows.map(r => `${r.column_name} (${r.data_type})`).join(', '));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
check();
