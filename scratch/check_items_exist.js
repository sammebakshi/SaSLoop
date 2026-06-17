const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:Admin%40123@localhost:5432/sasloop_db"
});

async function run() {
  const ids = [5418, 5644, 5655, 4767];
  for (const id of ids) {
    const omi = await pool.query("SELECT id, short_code, item_name, menu_id FROM outlet_menu_items WHERE id = $1", [id]);
    console.log(`ID ${id} in outlet_menu_items:`, omi.rows);

    const bi = await pool.query("SELECT id, code, product_name FROM business_items WHERE id = $1", [id]);
    console.log(`ID ${id} in business_items:`, bi.rows);
  }
  pool.end();
}

run().catch(console.error);
