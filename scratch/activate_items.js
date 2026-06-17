const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const res = await pool.query(
      `UPDATE outlet_menu_items 
       SET is_active = true 
       WHERE id IN (5638, 5640, 5663) 
       RETURNING id, item_name, is_active`
    );
    console.log('Activated items:', res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
