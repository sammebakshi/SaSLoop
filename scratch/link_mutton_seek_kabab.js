const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres:Admin%40123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    // 1. Link Mutton Seek Kabab (5681) to Kabab group (6)
    const check = await pool.query("SELECT * FROM item_option_groups WHERE item_id = 5681 AND group_id = 6");
    if (check.rows.length === 0) {
      await pool.query("INSERT INTO item_option_groups (item_id, group_id) VALUES (5681, 6)");
      console.log("Successfully linked item 5681 to group 6");
    } else {
      console.log("Already linked");
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
