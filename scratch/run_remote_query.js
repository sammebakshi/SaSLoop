const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: 'postgresql://postgres:Admin%40123@localhost:5432/sasloop_db'
  });
  
  await client.connect();
  console.log("Connected to OCI database.");

  try {
    const res = await client.query("SELECT id, bill_no, customer_number, total_price, payment_method, status, paid_amount, credit_amount, created_at FROM orders ORDER BY id DESC LIMIT 20");
    console.log("=== RECENT ORDERS ===");
    console.log(JSON.stringify(res.rows, null, 2));

  } catch (err) {
    console.error("Query failed:", err);
  } finally {
    await client.end();
  }
}

run();
