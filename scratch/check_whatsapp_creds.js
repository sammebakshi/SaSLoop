const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const res = await pool.query('SELECT id, business_name, email, meta_phone_id, length(meta_access_token) as token_len FROM app_users WHERE id IN (1, 48)');
    console.log('WhatsApp credentials for user 1 and 48:');
    res.rows.forEach(r => console.log(r));

    const restRes = await pool.query('SELECT id, name, user_id, notification_numbers, kitchen_number, settings FROM restaurants');
    console.log('\nRestaurants list:');
    restRes.rows.forEach(r => console.log(r));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
