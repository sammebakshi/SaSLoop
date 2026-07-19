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
    const deptsRes = await pool.query("SELECT * FROM table_departments");
    console.log("All Table Departments in DB:", deptsRes.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
main();
