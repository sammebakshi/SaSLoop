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
    const res = await pool.query("SELECT id, name, department_id, outlet_id, user_id FROM tables_list");
    console.log("All Tables in tables_list:", res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
main();
