const pool = require('../db');

async function testQuery() {
  try {
    const ownerId = 55;
    const name = 'HALF';

    console.log('--- TEST 1: Direct query by item_name ---');
    const res1 = await pool.query("SELECT id, item_name, base_price, menu_id FROM outlet_menu_items WHERE item_name ILIKE $1", [name]);
    console.log('res1:', res1.rows);

    console.log('--- TEST 2: Option group query fix ---');
    const res2 = await pool.query(`
      SELECT omi.base_price 
      FROM outlet_menu_items omi
      WHERE omi.item_name ILIKE $1 
        AND omi.base_price IS NOT NULL 
        AND omi.base_price != '' 
        AND CAST(omi.base_price AS NUMERIC) > 0 
      LIMIT 1
    `, [name]);
    console.log('res2:', res2.rows);

  } catch(e) {
    console.error('ERROR IN TEST:', e);
  } finally {
    process.exit(0);
  }
}

testQuery();
