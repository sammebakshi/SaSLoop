const pool = require('../db');

async function run() {
  try {
    console.log('Testing orders join with app_users...');
    
    // We will test if the query from GET /recent works by running a SELECT
    const queryText = `
       SELECT o.*, COALESCE(w.name, w.username) as waiter_name 
       FROM orders o 
       LEFT JOIN app_users w ON o.waiter_id = w.id 
       ORDER BY o.created_at DESC LIMIT 1`;
       
    const res = await pool.query(queryText);
    console.log('Query executed successfully, result rows count:', res.rows.length);
    if (res.rows.length > 0) {
      console.log('First row waiter name:', res.rows[0].waiter_name);
    } else {
      console.log('No orders in database, but query syntax is valid.');
    }
  } catch (err) {
    console.error('Database query test failed:', err);
  } finally {
    pool.end();
  }
}

run();
