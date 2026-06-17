const pool = require("../db");

async function check() {
  try {
    // Check if table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'additional_charges'
      );
    `);
    console.log("Table exists:", tableCheck.rows[0].exists);
    
    // Check columns
    const cols = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'additional_charges'
      ORDER BY ordinal_position;
    `);
    console.log("Columns:", cols.rows);
    
    // Check rows
    const rows = await pool.query(`SELECT * FROM additional_charges LIMIT 5;`);
    console.log("Row count:", rows.rows.length);
    console.log("Rows:", rows.rows);
    
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    pool.end();
  }
}

check();
