const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:Admin%40123@localhost:5432/sasloop_db"
});

async function run() {
  const bi = await pool.query("SELECT user_id, COUNT(*) FROM business_items GROUP BY user_id");
  console.log("ITEMS IN business_items BY user_id:");
  bi.rows.forEach(r => {
    console.log(r);
  });

  const omi = await pool.query("SELECT menu_id, COUNT(*) FROM outlet_menu_items GROUP BY menu_id");
  console.log("\nITEMS IN outlet_menu_items BY menu_id:");
  omi.rows.forEach(r => {
    console.log(r);
  });

  pool.end();
}

run().catch(console.error);
