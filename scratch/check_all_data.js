const pool = require("../db");

async function run() {
  try {
    console.log("=== USERS ===");
    const users = await pool.query("SELECT id, username, phone, role FROM app_users");
    console.log(users.rows);

    const targetUser = users.rows.find(u => u.username === 'shahetehzeebpos');
    if (!targetUser) {
      console.log("Target user 'shahetehzeebpos' not found!");
      return;
    }
    console.log("\nTarget user details:", targetUser);

    console.log("\n=== OPTION GROUPS FOR TARGET USER ===");
    const og = await pool.query("SELECT * FROM option_groups WHERE outlet_id = $1", [targetUser.id]);
    console.log(og.rows);

    console.log("\n=== ALL ITEM OPTION GROUPS FOR TARGET USER ===");
    const iog = await pool.query(`
      SELECT iog.*, og.name as group_name
      FROM item_option_groups iog
      JOIN option_groups og ON iog.group_id = og.id
      WHERE og.outlet_id = $1
    `, [targetUser.id]);
    console.log(iog.rows);

    console.log("\n=== ALL OPTION GROUPS IN DB ===");
    const allOg = await pool.query("SELECT * FROM option_groups LIMIT 10");
    console.log(allOg.rows);

  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

run();
