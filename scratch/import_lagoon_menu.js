const pool = require("../db");
const data = require("./api_response_1779634423646.json");

async function importMenu() {
  const userId = 48; // Target Business/User ID
  const menuId = 33; // Target Menu ID
  
  console.log(`Starting import of Lagoon Menu for User ${userId}, Menu ${menuId}...`);

  try {
    // 1. Get or create categories
    console.log("Processing categories...");
    const rawCategories = Array.from(new Set(data.storeMenuItems.map(i => i.category_name.trim())));
    const categoryMap = {}; // Maps category name to its ID

    for (const catName of rawCategories) {
      // Check if category exists for user 48
      const catCheck = await pool.query(
        "SELECT id FROM categories WHERE user_id = $1 AND name = $2 LIMIT 1",
        [userId, catName]
      );
      if (catCheck.rows.length > 0) {
        categoryMap[catName] = catCheck.rows[0].id;
      } else {
        const catInsert = await pool.query(
          "INSERT INTO categories (user_id, name, is_active) VALUES ($1, $2, true) RETURNING id",
          [userId, catName]
        );
        categoryMap[catName] = catInsert.rows[0].id;
        console.log(`Created category: ${catName} (ID: ${catInsert.rows[0].id})`);
      }
    }

    // 2. Clear old items for this menu and business_items to make it a clean replica
    console.log("Clearing old menu items for Menu ID 33...");
    await pool.query("DELETE FROM outlet_menu_items WHERE menu_id = $1", [menuId]);

    console.log("Clearing old business_items for User 48...");
    await pool.query("DELETE FROM business_items WHERE user_id = $1", [userId]);

    // 3. Insert items
    console.log("Inserting new items...");
    let count = 0;
    for (const item of data.storeMenuItems) {
      const catId = categoryMap[item.category_name.trim()];
      const isVeg = item.food_type !== 2; // 2 represents non-veg usually
      const price = parseFloat(item.sale_price) || 0;
      const title = item.title;
      const description = item.description || "";
      const image = item.image || null;
      const shortCode = item.short_code || "";
      const stock = parseInt(item.current_stock) || 0;

      // A. Insert into business_items
      const bizItem = await pool.query(
        `INSERT INTO business_items (
          user_id, code, product_name, category, price, availability, image_url, description, 
          tax_applicable, is_veg, stock_count, tax_percent, cost_price, kot_category, variants, modifiers
         ) VALUES ($1, $2, $3, $4, $5, true, $6, $7, 1, $8, $9, 0.00, 0.00, 'Main Kitchen', '[]', '[]') RETURNING id`,
        [userId, shortCode, title, item.category_name.trim(), price, image, description, isVeg, stock]
      );
      const bizItemId = bizItem.rows[0].id;

      // B. Insert into outlet_menu_items
      await pool.query(
        `INSERT INTO outlet_menu_items (
          menu_id, item_id, short_code, item_name, base_price, category_id, description, 
          food_type, is_active, item_type, image_url, stock_qty, is_recommended, is_open_price
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, '0', $9, $10, false, false)`,
        [menuId, bizItemId, shortCode, title, price, catId, description, isVeg ? 'veg' : 'non-veg', image, stock]
      );
      
      count++;
    }

    console.log(`Successfully imported ${count} items!`);

  } catch (err) {
    console.error("Import failed:", err);
  } finally {
    await pool.end();
  }
}

importMenu();
