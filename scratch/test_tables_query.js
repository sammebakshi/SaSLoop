const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sasloop_db',
  password: process.env.DB_PASSWORD || 'Admin@123',
  port: process.env.DB_PORT || 5432,
});

async function runQuery() {
  try {
    const outletId = 55;
    const result = await pool.query(
        "SELECT t.id, t.name as table_name, t.department_id, d.department_name FROM tables_list t LEFT JOIN table_departments d ON t.department_id = d.id WHERE (t.outlet_id = $1 OR (t.outlet_id IS NULL AND t.user_id = $1)) AND t.is_active = true AND (d.id IS NULL OR d.is_active = true) ORDER BY substring(t.name from '^[a-zA-Z\\s]*') ASC, COALESCE(substring(t.name from '[0-9]+')::integer, 0) ASC, t.name ASC",
        [outletId]
    );
    console.log('Query result rows count:', result.rows.length);
    console.log('Query result rows:', result.rows);
  } catch (err) {
    console.error('SQL Query error:', err.message);
  } finally {
    await pool.end();
  }
}

runQuery();
