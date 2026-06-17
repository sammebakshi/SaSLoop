const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    // Check current items
    const res = await pool.query('SELECT id, product_name, price, category FROM business_items WHERE user_id = 48 ORDER BY id LIMIT 15');
    console.log('Current items (first 15):');
    res.rows.forEach(i => console.log(`  ${i.id}: ${i.product_name} - ${i.price} [${i.category}]`));
    
    // Check menus 31 & 32
    const res2 = await pool.query('SELECT COUNT(*) as cnt FROM outlet_menu_items WHERE menu_id IN (31,32)');
    console.log('Items in menus 31 & 32:', res2.rows[0].cnt);
    
    // Check outlet_menus
    const res3 = await pool.query('SELECT id, menu_name, outlet_name FROM outlet_menus');
    console.log('Outlet menus:', res3.rows);
    
    // Check the backup SQL file has business_items
    const fs = require('fs');
    const backupPath = 'backups/sasloop_backup_2026-04-27T02-21-19-565Z.sql';
    if (fs.existsSync(backupPath)) {
      const backup = fs.readFileSync(backupPath, 'utf8');
      const biMatch = backup.match(/COPY.*business_items/i);
      console.log('Backup has business_items table:', !!biMatch);
      const omiMatch = backup.match(/COPY.*outlet_menu_items/i);
      console.log('Backup has outlet_menu_items table:', !!omiMatch);
    } else {
      console.log('No backup found at', backupPath);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
