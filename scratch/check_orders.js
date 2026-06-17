const pool = require("../db");

async function checkOrderCharges() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orders' 
        AND column_name LIKE '%charge%'
      ORDER BY ordinal_position;
    `);
    console.log("Orders charge columns:", res.rows);
    
    // Also check if there's a charge_details column
    const res2 = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orders'
      ORDER BY ordinal_position;
    `);
    console.log("\nAll orders columns:");
    res2.rows.forEach(r => console.log(`  ${r.column_name} (${r.data_type})`));
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    pool.end();
  }
}

checkOrderCharges();
