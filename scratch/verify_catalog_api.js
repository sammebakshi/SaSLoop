const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:Admin%40123@localhost:5432/sasloop_db"
});

async function run() {
  const ownerId = 55; // Owner ID from our previous checks

  console.log("=== STARTING POS CATALOG API VERIFICATION ===");

  // 1. Save original menu states
  const originalMenus = await pool.query(
    "SELECT id, is_pos_default, is_digital_default FROM outlet_menus WHERE outlet_id = $1 OR user_id = $1",
    [ownerId]
  );
  console.log("Original Menu States:", originalMenus.rows);

  try {
    // SCENARIO A: Set one menu as POS default, one as false
    console.log("\n--- SCENARIO A: Menu 34 is POS default, Menu 35 is NOT ---");
    await pool.query("UPDATE outlet_menus SET is_pos_default = false WHERE outlet_id = $1 OR user_id = $1", [ownerId]);
    await pool.query("UPDATE outlet_menus SET is_pos_default = true WHERE id = 34");

    const resultA = await getCatalog(ownerId);
    const categoriesA = await getCategories(ownerId);
    console.log(`Scenario A Items count: ${resultA.length}`);
    console.log(`Scenario A Categories: ${JSON.stringify(categoriesA)}`);
    if (resultA.length === 0) throw new Error("Scenario A should have returned items!");

    // SCENARIO B: Uncheck POS default on BOTH menus
    console.log("\n--- SCENARIO B: Uncheck POS default on ALL menus ---");
    await pool.query("UPDATE outlet_menus SET is_pos_default = false WHERE outlet_id = $1 OR user_id = $1", [ownerId]);

    const resultB = await getCatalog(ownerId);
    const categoriesB = await getCategories(ownerId);
    console.log(`Scenario B Items count: ${resultB.length}`);
    console.log(`Scenario B Categories: ${JSON.stringify(categoriesB)}`);
    if (resultB.length !== 0 || categoriesB.length !== 0) {
      throw new Error("Scenario B should return empty lists when no POS default menu is active!");
    }
    console.log("✅ Scenario B correctly returned empty lists!");

    // SCENARIO C: Legacy Fallback (No menus exist)
    console.log("\n--- SCENARIO C: No menus exist (simulated by querying a non-existent owner) ---");
    const fakeOwnerId = 99999;
    const resultC = await getCatalog(fakeOwnerId);
    console.log(`Scenario C (Fake Owner) Items count: ${resultC.length}`);
    // Should be 0 since fake owner has no items, but check that it didn't throw/crash
    console.log("✅ Scenario C completed without error!");

  } finally {
    // Restore original menu states
    console.log("\nRestoring original menu states...");
    for (const menu of originalMenus.rows) {
      await pool.query(
        "UPDATE outlet_menus SET is_pos_default = $1, is_digital_default = $2 WHERE id = $3",
        [menu.is_pos_default, menu.is_digital_default, menu.id]
      );
    }
    console.log("Original states restored.");
  }

  pool.end();
}

async function getCatalog(ownerId) {
  const activeMenuCheck = await pool.query(
      `SELECT id FROM outlet_menus WHERE outlet_id = $1 OR user_id = $1`,
      [ownerId]
  );

  if (activeMenuCheck.rows.length === 0) {
      const result = await pool.query(
          `SELECT bi.id FROM business_items bi WHERE bi.user_id = $1 AND NOT EXISTS (
               SELECT 1 FROM outlet_menu_items omi WHERE omi.short_code = bi.code AND omi.item_type = '1'
           )`,
          [ownerId]
      );
      return result.rows;
  }

  const posMenuRes = await pool.query(
      `SELECT id FROM outlet_menus WHERE (outlet_id = $1 OR user_id = $1) AND is_pos_default = true LIMIT 1`,
      [ownerId]
  );

  if (posMenuRes.rows.length === 0) {
      return [];
  }

  const menuId = posMenuRes.rows[0].id;
  const result = await pool.query(
      `SELECT bi.id, omi.item_name
       FROM business_items bi
       JOIN outlet_menu_items omi ON omi.menu_id = $2 AND (
         (omi.item_id = bi.id)
         OR (omi.item_id IS NULL AND omi.short_code IS NOT NULL AND omi.short_code != '' AND omi.short_code = bi.code)
         OR (omi.item_id IS NULL AND (omi.short_code IS NULL OR omi.short_code = '') AND omi.item_name = bi.product_name)
       )
       WHERE bi.user_id = $1 AND omi.item_type = '0'`,
      [ownerId, menuId]
  );
  return result.rows;
}

async function getCategories(ownerId) {
  const activeMenuCheck = await pool.query(
      `SELECT id FROM outlet_menus WHERE outlet_id = $1 OR user_id = $1`,
      [ownerId]
  );

  if (activeMenuCheck.rows.length === 0) {
      const result = await pool.query(`SELECT name FROM categories WHERE user_id = $1`, [ownerId]);
      return result.rows.map(r => r.name);
  }

  const posMenuRes = await pool.query(
      `SELECT id FROM outlet_menus WHERE (outlet_id = $1 OR user_id = $1) AND is_pos_default = true LIMIT 1`,
      [ownerId]
  );

  if (posMenuRes.rows.length === 0) {
      return [];
  }

  const menuId = posMenuRes.rows[0].id;
  const result = await pool.query(
      `SELECT DISTINCT c.name 
       FROM categories c
       JOIN outlet_menu_items omi ON omi.category_id = c.id
       WHERE omi.menu_id = $1 AND omi.item_type = '0' AND omi.is_active = true`,
      [menuId]
  );
  return result.rows.map(r => r.name);
}

run().catch(console.error);
