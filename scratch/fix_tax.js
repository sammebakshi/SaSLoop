const pool = require("../db");

async function run() {
  try {
    const result = await pool.query("UPDATE tax_configurations SET is_inclusive = true WHERE id = 17 RETURNING *");
    console.log("--- Updated Tax ID 17 ---");
    console.log(result.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
