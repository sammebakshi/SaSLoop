const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const res = await pool.query("SELECT id, username, phone, whatsapp_number, whatsapp_api_number FROM app_users WHERE username = 'shahetehzeeb'");
    console.log('User details:');
    console.log(JSON.stringify(res.rows, null, 2));

    const res2 = await pool.query("SELECT * FROM restaurants WHERE user_id = (SELECT id FROM app_users WHERE username = 'shahetehzeeb')");
    console.log('Restaurant details:');
    console.log(JSON.stringify(res2.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
