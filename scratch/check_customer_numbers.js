const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function check() {
  try {
    console.log('--- CUSTOMERS TABLE ---');
    const custRes = await pool.query('SELECT id, name, number FROM customers LIMIT 15');
    console.table(custRes.rows);

    console.log('--- CUSTOMER LOYALTY TABLE ---');
    const loyRes = await pool.query('SELECT id, name, customer_number, points FROM customer_loyalty LIMIT 15');
    console.table(loyRes.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
