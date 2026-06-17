const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const menus = await pool.query(
      `SELECT * FROM outlet_menus WHERE user_id = 8`
    );
    console.log('Menus for user 8:', menus.rows);

    const items = await pool.query(
      `SELECT count(*) FROM outlet_menu_items WHERE menu_id IN (31, 32)`
    );
    console.log('Items count for menu 31 and 32:', items.rows[0]);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
