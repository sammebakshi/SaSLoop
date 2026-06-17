const pool = require('../db');

async function check() {
  try {
    const res = await pool.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND (column_name LIKE '%balance%' OR column_name LIKE '%prepaid%' OR column_name LIKE '%loyalty%' OR column_name LIKE '%points%')
    `);
    console.log("Matching columns:");
    res.rows.forEach(r => console.log(`  ${r.table_name}.${r.column_name}: ${r.data_type}`));
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

check();
