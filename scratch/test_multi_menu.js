const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:Admin%40123@localhost:5432/sasloop_db"
});

async function run() {
  const ownerId = 55;

  // Let's set BOTH menus 34 and 35 as POS default
  console.log("Setting both menus (34 & 35) as POS default...");
  await pool.query("UPDATE outlet_menus SET is_pos_default = true WHERE id IN (34, 35)");

  // Get active POS default menus
  const posMenuRes = await pool.query(
      `SELECT id, menu_name FROM outlet_menus 
       WHERE (outlet_id = $1 OR user_id = $1) AND is_pos_default = true`,
      [ownerId]
  );
  const menuIds = posMenuRes.rows.map(row => row.id);
  console.log("Active POS Menu IDs:", menuIds);

  // Run catalog query with ANY
  const itemsRes = await pool.query(
      `SELECT DISTINCT ON (bi.id) 
              bi.id, 
              COALESCE(omi.short_code, bi.code) as code, 
              omi.item_name as product_name
       FROM business_items bi
       JOIN outlet_menu_items omi ON omi.menu_id = ANY($2) AND (
         (omi.item_id = bi.id)
         OR (omi.item_id IS NULL AND omi.short_code IS NOT NULL AND omi.short_code != '' AND omi.short_code = bi.code)
         OR (omi.item_id IS NULL AND (omi.short_code IS NULL OR omi.short_code = '') AND omi.item_name = bi.product_name)
       )
       WHERE bi.user_id = $1 AND omi.item_type = '0'
       ORDER BY bi.id ASC, omi.id ASC`,
      [ownerId, menuIds]
  );
  console.log(`Total unique items loaded from both menus: ${itemsRes.rows.length}`);

  // Run categories query with ANY
  const categoriesRes = await pool.query(
      `SELECT DISTINCT c.name 
       FROM categories c
       JOIN outlet_menu_items omi ON omi.category_id = c.id
       WHERE omi.menu_id = ANY($1) AND omi.item_type = '0' AND omi.is_active = true
       ORDER BY c.name ASC`,
      [menuIds]
  );
  console.log("Categories loaded:", categoriesRes.rows.map(r => r.name));

  // Reset to original states
  console.log("Restoring menu 35 to is_pos_default = true and 34 to true (original)");
  await pool.query("UPDATE outlet_menus SET is_pos_default = true WHERE id IN (34, 35)");

  pool.end();
}

run().catch(console.error);
