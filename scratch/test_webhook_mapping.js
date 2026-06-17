const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const metaPhoneId = '1081456295056156';

    // Original query:
    const resOrig = await pool.query("SELECT id FROM app_users WHERE meta_phone_id = $1 LIMIT 1", [metaPhoneId]);
    console.log('Original query result user ID:', resOrig.rows[0]?.id);

    // Improved query that joins with restaurants:
    const query = `
      SELECT u.id, u.business_name, r.name as restaurant_name 
      FROM app_users u 
      LEFT JOIN restaurants r ON r.user_id = u.id 
      WHERE u.meta_phone_id = $1 
      ORDER BY r.id IS NULL ASC, r.id ASC 
      LIMIT 1
    `;
    const resNew = await pool.query(query, [metaPhoneId]);
    console.log('Improved query result:', resNew.rows[0]);

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
