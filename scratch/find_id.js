const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:Admin%40123@localhost:5432/sasloop_db"
});

async function run() {
  const tablesRes = await pool.query(`
    SELECT table_name 
    FROM information_schema.columns 
    WHERE column_name = 'id' 
      AND table_schema = 'public' 
      AND table_name NOT IN ('audit_logs', 'chat_messages')
  `);
  
  for (const row of tablesRes.rows) {
    const tableName = row.table_name;
    try {
      const res = await pool.query(`SELECT * FROM ${tableName} WHERE id = 5418`);
      if (res.rows.length > 0) {
        console.log(`FOUND 5418 in table: ${tableName}`);
        console.log(res.rows);
      }
    } catch (e) {
      // Ignore errors for tables without integer id or views
    }
  }
  pool.end();
}

run().catch(console.error);
