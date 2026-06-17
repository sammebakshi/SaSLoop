const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const res = await pool.query("SELECT * FROM outlet_menus");
    console.log("Outlet Menus:", res.rows);
    const resItems = await pool.query("SELECT DISTINCT menu_id FROM outlet_menu_items");
    console.log("Distinct menu IDs in items:", resItems.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
