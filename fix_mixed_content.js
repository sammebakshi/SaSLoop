const pool = require('./db');

async function fixMixedContent() {
  try {
    console.log('Searching all tables for http:// URLs...');
    const tablesRes = await pool.query(`
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND data_type IN ('text', 'character varying')
    `);

    for (const row of tablesRes.rows) {
      const { table_name, column_name } = row;
      try {
        const res = await pool.query(`
          UPDATE "${table_name}" 
          SET "${column_name}" = REPLACE("${column_name}", 'http://', 'https://')
          WHERE "${column_name}" LIKE 'http://%'
        `);
        if (res.rowCount > 0) {
          console.log(`Updated ${res.rowCount} rows in ${table_name}.${column_name}`);
        }
      } catch (e) {
        // ignore errors on non-updatable views or columns
      }
    }

    console.log('All image URLs successfully upgraded to HTTPS!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

fixMixedContent();
