const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    // Check if any orders reference these items
    const orders = await pool.query('SELECT COUNT(*) as cnt FROM orders WHERE user_id = 48');
    console.log('Orders for user 48:', orders.rows[0].cnt);

    // Check foreign key references to business_items
    const fks = await pool.query(`
      SELECT tc.constraint_name, tc.table_name, kcu.column_name, 
             ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND (ccu.table_name = 'business_items' OR ccu.table_name = 'outlet_menu_items')
    `);
    console.log('\nForeign keys referencing business_items/outlet_menu_items:');
    fks.rows.forEach(fk => console.log(`  ${fk.table_name}.${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name} (${fk.constraint_name})`));

    // Check if option_groups link to business_items
    const og = await pool.query('SELECT COUNT(*) as cnt FROM option_groups WHERE user_id = 48');
    console.log('\nOption groups for user 48:', og.rows[0].cnt);

    // Check menus 31 & 32 owner
    const menus = await pool.query('SELECT id, menu_name, user_id FROM outlet_menus');
    console.log('\nAll outlet menus:');
    menus.rows.forEach(m => console.log(`  Menu ${m.id}: ${m.menu_name} (user: ${m.user_id})`));

  } catch (err) {
    console.error(err.message);
  } finally {
    await pool.end();
  }
}
run();
