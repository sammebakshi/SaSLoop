const pool = require("../db");

async function runTests() {
  try {
    // 1. Check if item_type column exists
    const columnCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'outlet_menu_items' AND column_name = 'item_type'
    `);
    
    if (columnCheck.rows.length === 0) {
      console.error("FAIL: 'item_type' column does not exist on 'outlet_menu_items'!");
      process.exit(1);
    }
    console.log("PASS: 'item_type' column exists. Type:", columnCheck.rows[0].data_type);

    // 2. Fetch a default menu id to use for testing
    const menuRes = await pool.query("SELECT id, outlet_id FROM outlet_menus LIMIT 1");
    if (menuRes.rows.length === 0) {
      console.error("FAIL: No outlet menu found in database to link test items!");
      process.exit(1);
    }
    const testMenuId = menuRes.rows[0].id;
    console.log("Using menu_id:", testMenuId);

    // Fetch a category if any exists
    const categoryRes = await pool.query("SELECT id FROM categories LIMIT 1");
    const testCategoryId = categoryRes.rows.length > 0 ? categoryRes.rows[0].id : null;
    console.log("Using category_id:", testCategoryId);

    // 3. Test insert standard item (item_type = '0')
    console.log("Testing creation of standard item (item_type = '0')...");
    const standardInsert = await pool.query(`
      INSERT INTO outlet_menu_items 
      (menu_id, short_code, item_name, base_price, category_id, is_active, item_type)
      VALUES ($1, 'TST-STD', 'TEST STANDARD ITEM', 99.99, $2, true, '0')
      RETURNING *
    `, [testMenuId, testCategoryId]);
    
    const stdItem = standardInsert.rows[0];
    console.log("PASS: Standard item created:", stdItem);

    // 4. Test insert option/modifier item (item_type = '1', category_id = null)
    console.log("Testing creation of option item (item_type = '1')...");
    const optionInsert = await pool.query(`
      INSERT INTO outlet_menu_items 
      (menu_id, short_code, item_name, base_price, category_id, is_active, item_type)
      VALUES ($1, 'TST-OPT', 'TEST OPTION ITEM', 15.00, null, true, '1')
      RETURNING *
    `, [testMenuId]);
    
    const optItem = optionInsert.rows[0];
    console.log("PASS: Option item created:", optItem);

    // 5. Test update item properties (e.g. food_type, price, item_type)
    console.log("Testing updates on created items...");
    const updateRes = await pool.query(`
      UPDATE outlet_menu_items
      SET base_price = 120.00, food_type = 'non-veg', item_type = '0'
      WHERE id = $1
      RETURNING *
    `, [stdItem.id]);
    console.log("PASS: Updated standard item base_price and food_type:", updateRes.rows[0]);

    // 6. Clean up test items
    console.log("Cleaning up test items...");
    await pool.query("DELETE FROM outlet_menu_items WHERE id IN ($1, $2)", [stdItem.id, optItem.id]);
    console.log("PASS: Test items successfully deleted.");

  } catch (err) {
    console.error("FAIL: Error occurred during database validation:", err.message);
  } finally {
    await pool.end();
  }
}

runTests();
