const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:Admin%40123@localhost:5432/sasloop_db"
});

async function run() {
  const menus = await pool.query("SELECT id, menu_name, is_pos_default, is_digital_default, outlet_id FROM outlet_menus");
  console.log("MENUS:");
  menus.rows.forEach(m => {
    console.log(`id: ${m.id}, name: ${m.menu_name}, is_pos_default: ${m.is_pos_default}, is_digital_default: ${m.is_digital_default}, outlet_id: ${m.outlet_id}`);
  });
  pool.end();
}

run().catch(console.error);
