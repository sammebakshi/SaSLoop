const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sasloop_db',
  password: 'Admin@123',
  port: 5432
});

async function main() {
  try {
    const res = await pool.query("SELECT id, username, name, staff_permissions FROM app_users");
    for (const row of res.rows) {
      console.log(`User: ${row.username} (${row.name})`);
      console.log(JSON.stringify(row.staff_permissions, null, 2));
      console.log("-----------------------------------------");
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
