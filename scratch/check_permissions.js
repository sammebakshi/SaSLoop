const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sasloop_db',
  password: 'Admin@123',
  port: 5432,
});

async function main() {
  try {
    const res = await pool.query("SELECT id, username, role, staff_permissions FROM app_users WHERE username = 'shahetehzeebpos'");
    if (res.rows.length > 0) {
      console.log("User details:", JSON.stringify(res.rows[0], null, 2));
    } else {
      console.log("User not found");
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
main();
