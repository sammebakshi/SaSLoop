const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  const userId = 48; // Shahe Tehzeeb Restaurant
  const menuId = 33; // POS Menu

  try {
    console.log(`Starting back office synchronization for User ${userId}, Menu ${menuId}...`);

    // 1. Fetch all main items in the outlet menu with category names
    const menuItemsRes = await pool.query(
      `SELECT omi.id, omi.item_name, omi.base_price, omi.short_code, omi.description, omi.food_type, omi.image_url, omi.stock_qty, c.name as category
       FROM outlet_menu_items omi
       LEFT JOIN categories c ON omi.category_id = c.id
       WHERE omi.menu_id = $1 AND omi.item_type = '0'`,
      [menuId]
    );
    const menuItems = menuItemsRes.rows;
    console.log(`Found ${menuItems.length} main items in outlet_menu_items.`);

    let insertedCount = 0;
    let linkedCount = 0;

    for (const item of menuItems) {
      const categoryName = item.category || 'Uncategorized';

      // Check if it already exists in business_items by name and category
      const biCheck = await pool.query(
        "SELECT id FROM business_items WHERE user_id = $1 AND product_name = $2 AND category = $3 LIMIT 1",
        [userId, item.item_name, categoryName]
      );

      let biId = null;
      if (biCheck.rows.length > 0) {
        const potentialId = biCheck.rows[0].id;
        // Check if this business item ID is already linked in outlet_menu_items for this menu
        const linkCheck = await pool.query(
          "SELECT id FROM outlet_menu_items WHERE menu_id = $1 AND item_id = $2 AND id != $3 LIMIT 1",
          [menuId, potentialId, item.id]
        );
        if (linkCheck.rows.length === 0) {
          biId = potentialId;
        }
      }

      if (!biId) {
        const isVeg = item.food_type === 'veg';
        const price = parseFloat(item.base_price) || 0;
        const stockCount = item.stock_qty ? Math.round(parseFloat(item.stock_qty)) : 0;
        
        // Insert into business_items
        const insertRes = await pool.query(
          `INSERT INTO business_items (
            user_id, code, product_name, category, price, availability, image_url, description, 
            tax_applicable, is_veg, stock_count, tax_percent, cost_price, kot_category, variants, modifiers
           ) VALUES ($1, $2, $3, $4, $5, true, $6, $7, 1, $8, $9, 0.00, 0.00, 'Main Kitchen', '[]', '[]') RETURNING id`,
          [userId, item.short_code, item.item_name, categoryName, price, item.image_url, item.description, isVeg, stockCount]
        );
        biId = insertRes.rows[0].id;
        insertedCount++;
      }

      // Update outlet_menu_items to set item_id
      await pool.query(
        "UPDATE outlet_menu_items SET item_id = $1 WHERE id = $2",
        [biId, item.id]
      );
      linkedCount++;
    }

    console.log(`Synchronization complete!`);
    console.log(`Inserted ${insertedCount} new items into business_items.`);
    console.log(`Linked ${linkedCount} items in outlet_menu_items.`);

  } catch (err) {
    console.error("Synchronization failed:", err);
  } finally {
    await pool.end();
  }
}

run();
