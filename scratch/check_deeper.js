const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    // Check restaurants table
    const res = await pool.query('SELECT * FROM restaurants');
    console.log('Restaurants:');
    res.rows.forEach(r => console.log(`  ${r.id}:`, JSON.stringify(r)));

    // Check app_users
    const au = await pool.query('SELECT id, business_name, phone, email FROM app_users ORDER BY id');
    console.log('\nApp users:');
    au.rows.forEach(u => console.log(`  ${u.id}: ${u.business_name} - ${u.phone} - ${u.email}`));

    // Check if there are categories for user 48
    const cats = await pool.query('SELECT id, name, user_id FROM categories WHERE user_id = 48 ORDER BY name');
    console.log('\nCategories for user 48:');
    cats.rows.forEach(c => console.log(`  ${c.id}: ${c.name}`));

    // Check what data is in the Lagoon API response
    const fs = require('fs');
    const apiFile = 'scratch/api_response_1779634423646.json';
    if (fs.existsSync(apiFile)) {
      const data = JSON.parse(fs.readFileSync(apiFile, 'utf8'));
      console.log('\nLagoon API data item count:', data.storeMenuItems ? data.storeMenuItems.length : 'N/A');
      if (data.storeMenuItems) {
        console.log('Sample Lagoon items:');
        data.storeMenuItems.slice(0, 5).forEach(i => console.log(`  ${i.title} - ${i.sale_price} [${i.category_name}]`));
      }
    }

  } catch (err) {
    console.error(err.message);
  } finally {
    await pool.end();
  }
}
run();
