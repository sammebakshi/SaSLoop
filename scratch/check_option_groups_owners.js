const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:Admin%40123@localhost:5432/sasloop_db"
});

async function run() {
  const res = await pool.query("SELECT id, name, user_id, outlet_id, is_active FROM option_groups");
  console.log("OPTION GROUPS:");
  res.rows.forEach(r => {
    console.log(`id: ${r.id}, name: ${r.name}, user_id: ${r.user_id}, outlet_id: ${r.outlet_id}, active: ${r.is_active}`);
  });
  
  const iog = await pool.query("SELECT * FROM item_option_groups");
  console.log("\nITEM OPTION GROUPS:");
  iog.rows.forEach(r => {
    console.log(`item_id: ${r.item_id}, group_id: ${r.group_id}`);
  });

  pool.end();
}

run().catch(console.error);
