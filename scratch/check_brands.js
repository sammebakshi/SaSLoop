const pool = require("../db");
async function checkBrands() {
  try {
    const res = await pool.query("SELECT * FROM brands");
    console.log("=== Brands ===");
    console.table(res.rows);
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}
checkBrands();
