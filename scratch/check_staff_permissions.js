const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sasloop_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function checkPermissions() {
  try {
    const res = await pool.query("SELECT username, role, staff_permissions FROM app_users WHERE username = 'shahetehzeebpos'");
    if (res.rows.length > 0) {
      console.log("User:", res.rows[0].username);
      console.log("Role:", res.rows[0].role);
      console.log("Permissions:", JSON.stringify(res.rows[0].staff_permissions, null, 2));
    } else {
      console.log("User shahetehzeebpos not found.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

checkPermissions();
