const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  const userId = 48;
  const fromNumber = '+919469697216';
  const contactName = 'Sajad Test';
  const textBody = 'Hello';

  try {
    console.log('Testing upsertContact...');
    const upsertRes = await pool.query(
      `INSERT INTO marketing_contacts (user_id, phone_number, name, last_order_at) 
       VALUES ($1, $2, $3, NOW()) 
       ON CONFLICT (user_id, phone_number) DO UPDATE SET name = EXCLUDED.name, last_order_at = NOW()`,
      [userId, fromNumber, contactName]
    );
    console.log('upsertContact succeeded:', upsertRes.rowCount);
  } catch (err) {
    console.error('upsertContact failed:', err.message);
  }

  try {
    console.log('Testing logChat...');
    const logRes = await pool.query(
      "INSERT INTO chat_messages (user_id, customer_number, role, text, wa_message_id) VALUES ($1, $2, $3, $4, $5)",
      [userId, fromNumber, 'customer', textBody, null]
    );
    console.log('logChat succeeded:', logRes.rowCount);
  } catch (err) {
    console.error('logChat failed:', err.message);
  }

  await pool.end();
}
run();
