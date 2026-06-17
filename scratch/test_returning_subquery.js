const pool = require('../db');

async function run() {
  try {
    const res = await pool.query(`
      SELECT 1 as test
    `);
    console.log('Postgres connection works');
    
    // We will test if subquery in RETURNING is syntax-valid by doing a dummy INSERT or just checking if we can parse it.
    // Let's create a temporary transaction to try inserting/updating and rollback.
    await pool.query('BEGIN');
    
    // Let's try to update orders RETURNING with a subquery
    // Since there might be no orders, we can insert a dummy order and then update it.
    const insRes = await pool.query(`
      INSERT INTO orders (user_id, items, total_price) 
      VALUES (54, '[]'::jsonb, 0) 
      RETURNING id, waiter_id, (SELECT username FROM app_users WHERE id = 54) as waiter_name
    `);
    console.log('Insert RETURNING subquery result:', insRes.rows);
    
    await pool.query('ROLLBACK');
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    pool.end();
  }
}

run();
