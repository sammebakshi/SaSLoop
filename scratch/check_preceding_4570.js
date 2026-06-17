const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    console.log("=== Querying items surrounding 4570 ===");
    const res = await pool.query(
      "SELECT id, short_code, item_name, item_type, category_id FROM outlet_menu_items WHERE menu_id = 32 AND id >= 4560 AND id <= 4595 ORDER BY id ASC"
    );
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
