const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function main() {
  // Find and remove duplicate chat_messages (keep the one with the lowest ID)
  const dupes = await pool.query(`
    DELETE FROM chat_messages 
    WHERE id NOT IN (
      SELECT MIN(id) 
      FROM chat_messages 
      GROUP BY user_id, customer_number, role, text, 
               date_trunc('second', created_at)
    )
  `);
  console.log(`Removed ${dupes.rowCount} duplicate chat messages`);
  await pool.end();
}
main().catch(e => { console.error(e); pool.end(); });
