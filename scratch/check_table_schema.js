const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const res = await pool.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'chat_messages'");
    console.log('chat_messages columns:');
    console.log(res.rows);

    const checkMsg = await pool.query("SELECT * FROM chat_messages WHERE role = 'customer'");
    console.log('Customer messages:', checkMsg.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
