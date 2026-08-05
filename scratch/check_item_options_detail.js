const pool = require('../db');

async function test() {
  try {
    const menuRes = await pool.query(
        `SELECT id, user_id, outlet_id FROM outlet_menus 
         WHERE (is_digital = true OR is_digital_default = true OR LOWER(menu_name) LIKE '%digi%') 
         ORDER BY id DESC LIMIT 5`
    );
    console.log("Digital Menus:", menuRes.rows);

    for (const m of menuRes.rows) {
      console.log(`\n========================================`);
      console.log(`MENU ID ${m.id} (User: ${m.user_id})`);
      console.log(`========================================`);

      const itemsRes = await pool.query(
        `SELECT id, item_name, base_price, item_type FROM outlet_menu_items WHERE menu_id = $1 ORDER BY id ASC LIMIT 20`,
        [m.id]
      );
      console.log("Main items sample:");
      console.table(itemsRes.rows);

      // Check item_option_groups for this menu
      const iogRes = await pool.query(
        `SELECT iog.item_id, omi.item_name, og.id as group_id, og.name as group_name
         FROM item_option_groups iog
         JOIN option_groups og ON iog.group_id = og.id
         JOIN outlet_menu_items omi ON iog.item_id = omi.id
         WHERE omi.menu_id = $1`,
        [m.id]
      );
      console.log("\nItems with linked option groups:");
      console.table(iogRes.rows);

      for (const iog of iogRes.rows) {
        console.log(`\n--- Fetching Options for item_id ${iog.item_id} (${iog.item_name}) ---`);
        const optListRes = await pool.query(
          `SELECT ol.id, ol.group_id, ol.name, ol.price_override, 
                  omi.base_price as matched_price, omi.item_name as matched_name
           FROM options_list ol 
           LEFT JOIN outlet_menu_items omi ON omi.menu_id = $1 AND (
              omi.item_name ILIKE ol.name 
              OR omi.item_name ILIKE '%' || ol.name
              OR ol.name ILIKE '%' || omi.item_name
           ) AND omi.is_active = true
           WHERE ol.group_id = $2 AND ol.is_active = true`,
          [m.id, iog.group_id]
        );
        console.table(optListRes.rows);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

test();
