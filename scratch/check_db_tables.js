const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sasloop_db',
  password: process.env.DB_PASSWORD || 'Admin@123',
  port: process.env.DB_PORT || 5432,
});

async function testUpsert() {
  const userId = 55; // our test user_id from tables_list
  const name = 'Test Customer';
  const number = '+919999999999';
  const address = 'Test Address';
  const points = 0;
  const balance = 0.00;

  try {
    console.log('Inserting/upserting customer...');
    const dbRes = await pool.query(
      `INSERT INTO customers (user_id, name, number, address)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, number)
       DO UPDATE SET name = EXCLUDED.name, address = EXCLUDED.address
       RETURNING *`,
      [userId, name, number, address]
    );
    console.log('Customer Upsert Success:', dbRes.rows[0]);

    const loyaltyRes = await pool.query(
      `INSERT INTO customer_loyalty (user_id, customer_number, name, points, balance, total_spent, last_visit)
       VALUES ($1, $2, $3, $4, $5, 0.00, NOW())
       ON CONFLICT (user_id, customer_number)
       DO UPDATE SET name = EXCLUDED.name,
                     points = COALESCE(customer_loyalty.points, 0) + EXCLUDED.points,
                     balance = COALESCE(customer_loyalty.balance, 0) + EXCLUDED.balance
       RETURNING *`,
      [userId, number, name || 'Customer', points, balance]
    );
    console.log('Loyalty Upsert Success:', loyaltyRes.rows[0]);
  } catch (err) {
    console.error('Error during upsert:', err);
  } finally {
    await pool.end();
  }
}

testUpsert();
