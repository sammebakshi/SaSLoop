const pool = require('../db');

async function test() {
  try {
    const tableInfo = await pool.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'chat_messages'
    `);
    console.log("Columns in chat_messages:", tableInfo.rows);

    const recent = await pool.query(`
      SELECT id, user_id, customer_number, role, text, is_read, created_at
      FROM chat_messages
      ORDER BY id DESC LIMIT 10
    `);
    console.log("Recent chat_messages:", recent.rows);

    const unreadCount = await pool.query(`
      SELECT user_id, COUNT(*) as count FROM chat_messages WHERE role = 'customer' AND (is_read = false OR is_read IS NULL) GROUP BY user_id
    `);
    console.log("Unread counts per user_id:", unreadCount.rows);
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    process.exit(0);
  }
}

test();
