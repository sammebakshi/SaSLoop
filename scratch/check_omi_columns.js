const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:Admin%40123@localhost:5432/sasloop_db"
});

async function run() {
  const cols = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'outlet_menu_items'
  `);
  console.log("COLUMNS IN outlet_menu_items:");
  cols.rows.forEach(c => {
    console.log(`  - ${c.column_name}: ${c.data_type}`);
  });

  const sample = await pool.query("SELECT id, item_id, short_code, item_name FROM outlet_menu_items LIMIT 5");
  console.log("\nSAMPLE DATA:");
  sample.rows.forEach(s => {
    console.log(s);
  });

  pool.end();
}

run().catch(console.error);
