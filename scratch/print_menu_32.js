const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:Admin%40123@localhost:5432/sasloop_db"
});

async function run() {
  const res = await pool.query("SELECT id, short_code, item_name, base_price, category_id, item_type FROM outlet_menu_items WHERE menu_id = 32 ORDER BY id ASC");
  console.log("ALL ITEMS IN MENU 32:");
  res.rows.forEach(r => {
    console.log(`id: ${r.id}, code: ${r.short_code}, name: ${r.item_name}, type: ${r.item_type}, cat: ${r.category_id}`);
  });
  pool.end();
}

run().catch(console.error);
