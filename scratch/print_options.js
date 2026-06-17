const pool = require("../db");

async function run() {
  try {
    console.log("=== OPTIONS LIST FOR GROUP 6 ===");
    const options = await pool.query("SELECT * FROM options_list WHERE group_id = 6");
    console.log(options.rows);
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

run();
