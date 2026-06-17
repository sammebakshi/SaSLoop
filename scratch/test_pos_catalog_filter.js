const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:Admin%40123@localhost:5432/sasloop_db"
});

async function run() {
  const ownerId = 55; // Using outlet_id 55 from output

  // Check if there are any outlet menus defined for this user/outlet
  const activeMenuCheck = await pool.query(
      `SELECT id FROM outlet_menus WHERE outlet_id = $1 OR user_id = $1`,
      [ownerId]
  );
  console.log(`Total menus found: ${activeMenuCheck.rows.length}`);

  // Fetch the POS default menu
  const posMenuRes = await pool.query(
      `SELECT id, menu_name FROM outlet_menus 
       WHERE (outlet_id = $1 OR user_id = $1) AND is_pos_default = true 
       LIMIT 1`,
      [ownerId]
  );

  if (posMenuRes.rows.length === 0) {
      console.log("No POS default menu found! POS catalog should be EMPTY.");
  } else {
      const menuId = posMenuRes.rows[0].id;
      const menuName = posMenuRes.rows[0].menu_name;
      console.log(`POS default menu: ${menuName} (ID: ${menuId})`);

      const itemsRes = await pool.query(
          `SELECT bi.id, 
                  COALESCE(omi.short_code, bi.code) as code, 
                  omi.item_name as product_name, 
                  omi.base_price as price, 
                  omi.is_active as availability
           FROM business_items bi
           JOIN outlet_menu_items omi ON omi.menu_id = $2 AND (
             (omi.item_id = bi.id)
             OR (omi.item_id IS NULL AND omi.short_code IS NOT NULL AND omi.short_code != '' AND omi.short_code = bi.code)
             OR (omi.item_id IS NULL AND (omi.short_code IS NULL OR omi.short_code = '') AND omi.item_name = bi.product_name)
           )
           WHERE bi.user_id = $1
             AND omi.item_type = '0'
           ORDER BY omi.id ASC`,
          [ownerId, menuId]
      );
      console.log(`Total items in POS default menu: ${itemsRes.rows.length}`);
      if (itemsRes.rows.length > 0) {
          console.log("First few items:");
          console.log(itemsRes.rows.slice(0, 5));
      }
  }

  // Test category query
  if (posMenuRes.rows.length > 0) {
      const menuId = posMenuRes.rows[0].id;
      const categoriesRes = await pool.query(
          `SELECT DISTINCT c.* 
           FROM categories c
           JOIN outlet_menu_items omi ON omi.category_id = c.id
           WHERE omi.menu_id = $1 AND omi.item_type = '0' AND omi.is_active = true
           ORDER BY c.sorting_order ASC, c.name ASC`,
          [menuId]
      );
      console.log(`Total categories for menu: ${categoriesRes.rows.length}`);
      console.log("Categories:", categoriesRes.rows.map(c => c.name));
  }

  pool.end();
}

run().catch(console.error);
