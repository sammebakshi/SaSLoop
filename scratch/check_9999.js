const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const res = await pool.query("SELECT * FROM chat_messages WHERE customer_number LIKE '%99999999%'");
    console.log(`Found ${res.rows.length} messages for 9999999999`);
    if (res.rows.length > 0) {
      console.log('First 5 messages:');
      console.log(res.rows.slice(0, 5));
    }
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

run();
