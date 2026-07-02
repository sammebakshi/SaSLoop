const pool = require('../db');

async function run() {
  try {
    console.log("Checking database tables...");

    // 1. Get users matching SHAHETEHZEEBPOS
    const usersRes = await pool.query("SELECT id, username, email, role, parent_user_id FROM app_users WHERE username ILIKE '%shah%' OR email ILIKE '%shah%'");
    console.log("\n--- Users found ---");
    console.log(usersRes.rows);

    if (usersRes.rows.length === 0) {
      console.log("No user found containing 'shah'");
      return;
    }

    const firstUser = usersRes.rows[0];
    const bizId = firstUser.parent_user_id || firstUser.id;
    console.log(`\nResolving business ID as: ${bizId}`);

    // 2. Count business items by category for this bizId
    const itemsCountRes = await pool.query(
      "SELECT category, COUNT(*) as count FROM business_items WHERE user_id = $1 GROUP BY category",
      [bizId]
    );
    console.log("\n--- Business Items count by category ---");
    console.log(itemsCountRes.rows);

    // 3. Check categories table
    const categoriesRes = await pool.query(
      "SELECT id, name, user_id FROM categories WHERE user_id = $1",
      [bizId]
    );
    console.log("\n--- Categories from categories table ---");
    console.log(categoriesRes.rows);

    // 4. Check if any menus exist for this business
    const menusRes = await pool.query(
      "SELECT id, name, is_pos_default FROM outlet_menus WHERE outlet_id = $1 OR user_id = $1",
      [bizId]
    );
    console.log("\n--- Outlet Menus ---");
    console.log(menusRes.rows);

  } catch (e) {
    console.error("Database query failed:", e);
  } finally {
    await pool.end();
  }
}

run();
