const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    // Find user-related tables
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema='public' 
      AND (table_name LIKE '%user%' OR table_name LIKE '%owner%' OR table_name LIKE '%restaurant%' OR table_name LIKE '%business%')
      ORDER BY table_name
    `);
    console.log('Related tables:');
    tables.rows.forEach(t => console.log('  ', t.table_name));

    // Check restaurant_owners
    const owners = await pool.query('SELECT id, business_name, phone FROM restaurant_owners ORDER BY id');
    console.log('\nRestaurant owners:');
    owners.rows.forEach(u => console.log(`  ${u.id}: ${u.business_name} - ${u.phone}`));

    // Also check outlet_menus structure
    const menus = await pool.query('SELECT * FROM outlet_menus');
    console.log('\nOutlet menus:');
    menus.rows.forEach(m => console.log(`  Menu ${m.id}:`, JSON.stringify(m)));

  } catch (err) {
    console.error(err.message);
  } finally {
    await pool.end();
  }
}
run();
