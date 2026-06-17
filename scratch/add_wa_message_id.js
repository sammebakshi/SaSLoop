const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    console.log('Adding wa_message_id column to chat_messages table...');
    await pool.query('ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS wa_message_id VARCHAR(255)');
    console.log('Column added successfully!');
  } catch (err) {
    console.error('Failed to add column:', err.message);
  } finally {
    await pool.end();
  }
}
run();
