const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sasloop_db',
  password: process.env.DB_PASSWORD || 'Admin@123',
  port: process.env.DB_PORT || 5432,
});

async function checkCounts() {
  try {
    const tablesListCount = await pool.query('SELECT COUNT(*) FROM tables_list');
    console.log('tables_list Count:', tablesListCount.rows[0].count);
    
    const menuItemsCount = await pool.query('SELECT COUNT(*) FROM outlet_menu_items');
    console.log('outlet_menu_items Count:', menuItemsCount.rows[0].count);
    
    if (tablesListCount.rows[0].count > 0) {
      const sampleTables = await pool.query('SELECT * FROM tables_list LIMIT 3');
      console.log('Sample Tables:', sampleTables.rows);
    }
  } catch (err) {
    console.error('Database query error:', err.message);
  } finally {
    await pool.end();
  }
}

checkCounts();
