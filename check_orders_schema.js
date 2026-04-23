const pool = require("./db");

async function checkOrdersSchema() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orders'
      ORDER BY ordinal_position;
    `);
    console.log("Columns in 'orders' table:");
    res.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkOrdersSchema();
