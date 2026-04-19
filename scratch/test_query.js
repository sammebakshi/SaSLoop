const pool = require('../db');
async function run() {
  const adminId = 49;
  try {
    const result = await pool.query(
      `SELECT id, username, first_name, last_name, email, role, status, 
              phone, business_type, business_name, gst_number, created_at,
              meta_phone_id, admin_permissions
       FROM app_users 
       WHERE created_by = $1 AND role = 'user'
       ORDER BY id DESC`,
      [adminId]
    );
    console.log("Admin 49's Users:", result.rows.length);
    console.log(JSON.stringify(result.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
run();
