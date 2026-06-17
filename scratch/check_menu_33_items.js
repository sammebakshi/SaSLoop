const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    console.log("=== Querying items surrounding 5655 (menu 33) ===");
    const res = await pool.query(
      "SELECT id, short_code, item_name, item_type, category_id, menu_id FROM outlet_menu_items WHERE menu_id = 33 AND id >= 5650 AND id <= 5670 ORDER BY id ASC"
    );
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
