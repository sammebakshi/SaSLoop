const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const resBi1 = await pool.query('SELECT COUNT(*) as cnt FROM business_items WHERE user_id = 1');
    const resBi48 = await pool.query('SELECT COUNT(*) as cnt FROM business_items WHERE user_id = 48');
    console.log('business_items:');
    console.log('  User 1 (Master Admin):', resBi1.rows[0].cnt);
    console.log('  User 48 (Tehzeeb):', resBi48.rows[0].cnt);

    const resOmi1 = await pool.query(`
      SELECT COUNT(*) as cnt FROM outlet_menu_items omi
      JOIN outlet_menus om ON omi.menu_id = om.id
      WHERE om.user_id = 1 OR om.outlet_id = 1
    `);
    const resOmi48 = await pool.query(`
      SELECT COUNT(*) as cnt FROM outlet_menu_items omi
      JOIN outlet_menus om ON omi.menu_id = om.id
      WHERE om.user_id = 48 OR om.outlet_id = 48
    `);
    console.log('outlet_menu_items:');
    console.log('  User 1 (Master Admin):', resOmi1.rows[0].cnt);
    console.log('  User 48 (Tehzeeb):', resOmi48.rows[0].cnt);

    // Let's also check the menus
    const menus = await pool.query('SELECT id, menu_name, user_id, outlet_id, is_digital_default, is_pos_default FROM outlet_menus');
    console.log('\nAll outlet menus in DB:');
    menus.rows.forEach(m => console.log(m));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
