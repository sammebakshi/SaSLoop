const pool = require("../db");

async function checkSchema() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'outlet_menus';
    `);
    console.log("COLUMNS of outlet_menus:");
    console.log(res.rows.map(r => r.column_name).sort());
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkSchema();
