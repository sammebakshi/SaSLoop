const pool = require('../db');

async function inspectPsVsDg() {
  try {
    const menus = await pool.query("SELECT id, menu_name, short_name, is_pos_default, is_digital_default, user_id, outlet_id FROM outlet_menus");
    console.log("=== ALL OUTLET MENUS ===");
    console.table(menus.rows);

    const dgItemsInMenu = await pool.query("SELECT menu_id, count(*) FROM outlet_menu_items WHERE short_code LIKE 'DG%' GROUP BY menu_id");
    console.log("\n=== DG% ITEMS COUNT PER MENU ===");
    console.table(dgItemsInMenu.rows);

    const psItemsInMenu = await pool.query("SELECT menu_id, count(*) FROM outlet_menu_items WHERE short_code LIKE 'PS%' GROUP BY menu_id");
    console.log("\n=== PS% ITEMS COUNT PER MENU ===");
    console.table(psItemsInMenu.rows);

    const allPsItems = await pool.query("SELECT id, menu_id, short_code, item_name, base_price FROM outlet_menu_items WHERE short_code LIKE 'PS%' LIMIT 10");
    console.log("\n=== SAMPLE PS% ITEMS IN outlet_menu_items ===");
    console.table(allPsItems.rows);

    const bizPsItems = await pool.query("SELECT id, code, product_name, price FROM business_items WHERE code LIKE 'PS%' OR short_code LIKE 'PS%' LIMIT 10");
    console.log("\n=== SAMPLE PS% ITEMS IN business_items ===");
    console.table(bizPsItems.rows);

    const totalPsInOutletItems = await pool.query("SELECT count(*) FROM outlet_menu_items WHERE short_code LIKE 'PS%'");
    console.log("\nTotal PS% items in outlet_menu_items:", totalPsInOutletItems.rows[0].count);

    const totalDgInOutletItems = await pool.query("SELECT count(*) FROM outlet_menu_items WHERE short_code LIKE 'DG%'");
    console.log("Total DG% items in outlet_menu_items:", totalDgInOutletItems.rows[0].count);

    const allCodes = await pool.query("SELECT LEFT(short_code, 2) as prefix, count(*) FROM outlet_menu_items GROUP BY LEFT(short_code, 2)");
    console.log("\n=== ALL SHORT CODE PREFIXES IN outlet_menu_items ===");
    console.table(allCodes.rows);

  } catch (e) {
    console.error("DB Error:", e);
  } finally {
    process.exit();
  }
}

inspectPsVsDg();
