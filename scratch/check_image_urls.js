const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sasloop_db',
  password: process.env.DB_PASSWORD || 'Admin@123',
  port: process.env.DB_PORT || 5432,
});

async function checkImages() {
  try {
    const res = await pool.query('SELECT id, item_name, image_url FROM outlet_menu_items WHERE image_url IS NOT NULL AND image_url != \'\' LIMIT 10');
    console.log('Sample Image URLs from DB:');
    res.rows.forEach(r => {
        console.log(`- Item: "${r.item_name}", Image URL: "${r.image_url}"`);
    });
  } catch (err) {
    console.error('Database query error:', err.message);
  } finally {
    await pool.end();
  }
}

checkImages();
