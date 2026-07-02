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
    const res = await pool.query("SELECT image_url, COUNT(*) FROM outlet_menu_items GROUP BY image_url");
    console.log('Image URLs Breakdown:');
    res.rows.forEach(r => {
        console.log(`- URL: "${r.image_url}", Count: ${r.count}`);
    });
  } catch (err) {
    console.error('Database query error:', err.message);
  } finally {
    await pool.end();
  }
}

checkImages();
