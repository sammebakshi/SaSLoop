const pool = require('../db');

async function checkSchema() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'pre_orders';
    `);
    console.log("=== Columns in pre_orders ===");
    res.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type} (Nullable: ${row.is_nullable})`);
    });
    
    const countRes = await pool.query('SELECT count(*) FROM pre_orders');
    console.log(`Total pre-orders count: ${countRes.rows[0].count}`);
  } catch (err) {
    console.error("Error querying schema:", err);
  } finally {
    pool.end();
  }
}

checkSchema();
