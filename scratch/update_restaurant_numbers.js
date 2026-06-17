const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    // Update app_users
    const resUsers = await pool.query(`
      UPDATE app_users 
      SET phone = '9906123989', 
          whatsapp_number = '9906123989', 
          whatsapp_api_number = '9906123989' 
      WHERE business_name ILIKE '%Tehzeeb%' 
         OR brand_name ILIKE '%Tehzeeb%' 
         OR email ILIKE '%Tehzeeb%' 
         OR username ILIKE '%Tehzeeb%'
      RETURNING id, username, business_name, phone, whatsapp_number, whatsapp_api_number
    `);
    console.log('Updated app_users:');
    console.log(JSON.stringify(resUsers.rows, null, 2));

    // Update restaurants if exists
    const resRest = await pool.query(`
      UPDATE restaurants 
      SET phone = '9906123989', 
          contact_number = '9906123989' 
      WHERE user_id IN (
        SELECT id FROM app_users 
        WHERE business_name ILIKE '%Tehzeeb%' 
           OR brand_name ILIKE '%Tehzeeb%' 
           OR email ILIKE '%Tehzeeb%' 
           OR username ILIKE '%Tehzeeb%'
      )
      RETURNING id, user_id, name, phone, contact_number
    `);
    console.log('Updated restaurants:');
    console.log(JSON.stringify(resRest.rows, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
