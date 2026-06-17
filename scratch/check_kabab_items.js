const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:Admin%40123@localhost:5432/sasloop_db"
});

async function run() {
  const omi = await pool.query("SELECT id, menu_id, short_code, item_name, item_type FROM outlet_menu_items WHERE item_name ILIKE '%KABAB%' OR short_code = 'DG10' ORDER BY id ASC");
  console.log("KABAB items in outlet_menu_items:");
  omi.rows.forEach(r => {
    console.log(r);
  });

  const bi = await pool.query("SELECT id, code, product_name FROM business_items WHERE user_id = 48 AND (product_name ILIKE '%KABAB%' OR code = 'DG10') ORDER BY id ASC");
  console.log("\nKABAB items in business_items:");
  bi.rows.forEach(r => {
    console.log(r);
  });

  pool.end();
}

run().catch(console.error);
