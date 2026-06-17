const pool = require('../db');

async function check() {
  try {
    const c = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'customers'");
    const l = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'customer_loyalty'");
    console.log('customers columns:');
    c.rows.forEach(r => console.log(`  ${r.column_name}: ${r.data_type}`));
    console.log('customer_loyalty columns:');
    l.rows.forEach(r => console.log(`  ${r.column_name}: ${r.data_type}`));
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

check();
