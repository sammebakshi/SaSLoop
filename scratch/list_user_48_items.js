const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const items = await pool.query(
      `SELECT id, item_name, base_price, item_type 
       FROM outlet_menu_items 
       WHERE menu_id = 33 AND is_active = true
       ORDER BY id`
    );
    console.log('All menu 33 items:', items.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
