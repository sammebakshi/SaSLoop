const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const res = await pool.query(
      `SELECT id, item_name, base_price, is_active 
       FROM outlet_menu_items 
       WHERE menu_id = 33 AND is_active = false`
    );
    console.log('Inactive items in Menu 33:', res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
