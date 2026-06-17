const pool = require('../db');

async function run() {
  try {
    // Get orders table columns
    const colsRes = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orders'
    `);
    console.log('Orders columns:');
    colsRes.rows.forEach(r => {
      console.log(`- ${r.column_name} (${r.data_type})`);
    });

    // Inspect orders
    const ordersRes = await pool.query("SELECT id, bill_no, waiter_id, created_at FROM orders ORDER BY id DESC LIMIT 10");
    console.log('recent orders rows:', ordersRes.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

run();
