const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const r = await pool.query("SELECT * FROM outlet_menus WHERE outlet_id = 48 OR user_id = 48");
    console.log("Outlet Menus:");
    r.rows.forEach(m => {
      console.log(`ID: ${m.id}, Name: ${m.menu_name}, DigitalDefault: ${m.is_digital_default}, POSDefault: ${m.is_pos_default}, UserID: ${m.user_id}`);
    });
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}
run();
