const pool = require("../db");

async function run() {
  try {
    console.log("=== CATALOG ITEMS FOR USER 48 (shahetehzeeb) ===");
    // Query business_items or outlet_menu_items
    const items = await pool.query("SELECT id, product_name, price, is_veg, stock_count FROM business_items WHERE user_id = 48 LIMIT 10");
    console.log(items.rows);

    console.log("\n=== OUTLET MENU ITEMS FOR USER 48 ===");
    const menuItems = await pool.query("SELECT * FROM outlet_menu_items WHERE menu_id IN (SELECT id FROM outlet_menus WHERE outlet_id = 48) LIMIT 10");
    console.log(menuItems.rows);

  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

run();
