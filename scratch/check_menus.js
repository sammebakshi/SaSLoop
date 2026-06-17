const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    console.log("=== Querying menus ===");
    const res = await pool.query(
      "SELECT id, menu_name, is_pos_default, is_digital_default FROM outlet_menus"
    );
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
