const pool = require("../db");

async function checkSchema() {
  try {
    const cols = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'app_users'
    `);
    console.log("=== Columns ===");
    console.table(cols.rows);

    const constraints = await pool.query(`
      SELECT conname, pg_get_constraintdef(c.oid)
      FROM pg_constraint c
      JOIN pg_namespace n ON n.oid = c.connamespace
      WHERE conrelid = 'app_users'::regclass
    `);
    console.log("=== Constraints ===");
    console.table(constraints.rows);

    const indexes = await pool.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'app_users'
    `);
    console.log("=== Indexes ===");
    console.table(indexes.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkSchema();
