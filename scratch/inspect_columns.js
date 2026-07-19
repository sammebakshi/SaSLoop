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
    const tableDeptCols = await pool.query(
      "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'table_departments'"
    );
    console.log("table_departments columns:", tableDeptCols.rows);

    const tablesListCols = await pool.query(
      "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'tables_list'"
    );
    console.log("\ntables_list columns:", tablesListCols.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
main();
