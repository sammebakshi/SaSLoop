const pool = require("../db");

async function test() {
  try {
    const userId = 48; // Change as needed to match active test user
    console.log(`--- Testing menu retrieval for user ${userId} ---`);

    // Let's get the menus first to see what's available
    const menus = await pool.query(
      "SELECT id, menu_name, is_pos_default, is_digital_default FROM outlet_menus WHERE user_id = $1 OR outlet_id = $1",
      [userId]
    );
    console.log("Menus in DB:", menus.rows);

    // Let's test calling the public menus
    console.log("\n--- Testing POS Default Menu retrieval ---");
    const posRes = await pool.query(
      "SELECT id FROM outlet_menus WHERE (outlet_id = $1 OR user_id = $1) AND is_pos_default = true LIMIT 1",
      [userId]
    );
    if (posRes.rows.length > 0) {
      const menuId = posRes.rows[0].id;
      const itemsRes = await pool.query(
        `SELECT omi.id, omi.item_name as product_name, omi.base_price as price, c.name as category
         FROM outlet_menu_items omi
         LEFT JOIN categories c ON omi.category_id = c.id
         WHERE omi.menu_id = $1 AND omi.item_type = '0' AND omi.is_active = true`,
        [menuId]
      );
      console.log(`POS menu ID ${menuId} has ${itemsRes.rows.length} items. Sample items:`);
      console.table(itemsRes.rows.slice(0, 5));
    } else {
      console.log("No POS default menu found.");
    }

    console.log("\n--- Testing Digital Default Menu retrieval ---");
    const digitalRes = await pool.query(
      "SELECT id FROM outlet_menus WHERE (outlet_id = $1 OR user_id = $1) AND is_digital_default = true LIMIT 1",
      [userId]
    );
    if (digitalRes.rows.length > 0) {
      const menuId = digitalRes.rows[0].id;
      const itemsRes = await pool.query(
        `SELECT omi.id, omi.item_name as product_name, omi.base_price as price, c.name as category
         FROM outlet_menu_items omi
         LEFT JOIN categories c ON omi.category_id = c.id
         WHERE omi.menu_id = $1 AND omi.item_type = '0' AND omi.is_active = true`,
        [menuId]
      );
      console.log(`Digital menu ID ${menuId} has ${itemsRes.rows.length} items. Sample items:`);
      console.table(itemsRes.rows.slice(0, 5));
    } else {
      console.log("No Digital default menu found.");
    }

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

test();
