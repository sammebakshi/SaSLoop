const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const menus = await pool.query(
      `SELECT * FROM outlet_menus WHERE user_id = 48`
    );
    console.log('Menus for user 48:', menus.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
