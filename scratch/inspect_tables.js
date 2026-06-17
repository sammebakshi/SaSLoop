const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    console.log('Database tables:');
    console.log(tablesRes.rows.map(t => t.table_name).join(', '));

    // Let's check schemas of tables containing 'menu', 'item', 'option', or 'variant'
    const targetTables = ['outlet_menus', 'outlet_menu_items', 'business_items', 'option_groups', 'options_list', 'item_options', 'menu_item_options'];
    for (const tbl of targetTables) {
      const exists = tablesRes.rows.some(t => t.table_name === tbl);
      if (exists) {
        const cols = await pool.query(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = $1
        `, [tbl]);
        console.log(`\nTable ${tbl} columns:`);
        cols.rows.forEach(c => console.log(`  ${c.column_name}: ${c.data_type}`));
      } else {
        console.log(`\nTable ${tbl} does NOT exist.`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
