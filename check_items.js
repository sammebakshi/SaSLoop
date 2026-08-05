const pool = require('./db');

(async () => {
  try {
    // First find what users exist
    const users = await pool.query("SELECT id, name FROM app_users WHERE name IS NOT NULL LIMIT 10");
    console.log('=== USERS ===');
    users.rows.forEach(u => console.log('  ID:', u.id, '| Name:', u.name));

    // Find recent orders
    const orders = await pool.query("SELECT id, user_id, items, created_at FROM orders ORDER BY created_at DESC LIMIT 5");
    console.log('\n=== RECENT ORDERS (count:', orders.rows.length, ') ===');
    orders.rows.forEach((row, i) => {
      console.log('\n--- Order ID:', row.id, '| user_id:', row.user_id, '| created_at:', row.created_at, '---');
      const items = typeof row.items === 'string' ? JSON.parse(row.items) : row.items;
      if (Array.isArray(items) && items.length > 0) {
        const first = items[0];
        console.log('  FIRST ITEM KEYS:', Object.keys(first).join(', '));
        console.log('  FIRST ITEM:', JSON.stringify(first, null, 2));
      } else {
        console.log('  ITEMS:', JSON.stringify(items));
      }
    });

    // Also check restaurant_id-based orders  
    const restaurants = await pool.query("SELECT id, name, user_id FROM restaurants LIMIT 5");
    console.log('\n=== RESTAURANTS ===');
    restaurants.rows.forEach(r => console.log('  ID:', r.id, '| Name:', r.name, '| user_id:', r.user_id));

    process.exit(0);
  } catch(e) {
    console.error('ERROR:', e.message);
    process.exit(1);
  }
})();
