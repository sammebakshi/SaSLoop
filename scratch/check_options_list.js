const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:Admin%40123@localhost:5432/sasloop_db"
});

async function run() {
  const res = await pool.query("SELECT * FROM options_list WHERE group_id IN (7, 8) ORDER BY id ASC");
  console.log("OPTIONS FOR GROUPS 7 & 8:");
  res.rows.forEach(o => {
    console.log(`id: ${o.id}, group_id: ${o.group_id}, name: ${o.name}, price_override: ${o.price_override}, active: ${o.is_active}`);
  });
  pool.end();
}

run().catch(console.error);
