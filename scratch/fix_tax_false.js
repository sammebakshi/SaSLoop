const pool = require("../db");

async function run() {
  try {
    const result = await pool.query("UPDATE tax_configurations SET is_inclusive = false WHERE id = 17 RETURNING *");
    console.log("--- Reverted Tax ID 17 to False ---");
    console.log(result.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
