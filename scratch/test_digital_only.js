const pool = require('../db');

async function test() {
  try {
    const userId = 55;

    // Resolve digital default menu
    const menuRes = await pool.query(
        `SELECT id, menu_name, is_digital_default, is_digital FROM outlet_menus 
         WHERE (outlet_id = $1 OR user_id = $1) 
           AND (is_digital_default = true OR is_digital = true) 
         ORDER BY is_digital_default DESC, is_digital DESC, id DESC LIMIT 1`,
        [userId]
    );
    console.log("Selected Digital Default Menu:", menuRes.rows);

    const menuId = menuRes.rows[0].id;
    const itemsRes = await pool.query(
        `SELECT omi.id, 
                omi.item_name AS product_name, 
                omi.base_price AS price, 
                omi.is_active AS availability, 
                omi.stock_qty AS stock_count,
                COALESCE(c.name, 'General') as category
         FROM outlet_menu_items omi
         LEFT JOIN categories c ON omi.category_id = c.id
         WHERE omi.menu_id = $1 AND omi.item_type = '0' AND omi.is_active = true
           AND (c.id IS NULL OR c.is_active = true)
           AND omi.item_name NOT IN (SELECT name FROM options_list)
         ORDER BY omi.id ASC`,
        [menuId]
    );
    console.log(`Loaded items count from digital menu ${menuId}: ${itemsRes.rows.length}`);
    console.table(itemsRes.rows);

    // Test options for MUSHROOM PIZZA from digital menu
    const mushroomItem = itemsRes.rows.find(i => i.product_name.includes('MUSHROOM PIZZA'));
    if (mushroomItem) {
      console.log(`\nTesting options for Mushroom Pizza (ID ${mushroomItem.id}) from digital menu:`);
      const candidateIdsRes = await pool.query(
          `SELECT omi.id, omi.menu_id, omi.item_name, om.menu_name 
           FROM outlet_menu_items omi
           JOIN outlet_menus om ON omi.menu_id = om.id
           WHERE (om.outlet_id = $1 OR om.user_id = $1)
             AND (omi.id = $2 OR LOWER(omi.item_name) = LOWER($3))
           ORDER BY om.is_pos_default DESC, om.is_digital_default DESC`,
          [userId, mushroomItem.id, mushroomItem.product_name]
      );
      console.log("Candidate IDs across menus:", candidateIdsRes.rows);

      for (const cand of candidateIdsRes.rows) {
        const fallbackRes = await pool.query(
            `SELECT id, item_name as name, base_price as price
             FROM outlet_menu_items
             WHERE menu_id = $1
               AND item_type = '1'
               AND id > $2
               AND id < COALESCE(
                 (SELECT MIN(id) FROM outlet_menu_items WHERE item_type = '0' AND menu_id = $1 AND id > $2),
                 99999999
               )
             ORDER BY id ASC`,
            [cand.menu_id, cand.id]
        );
        if (fallbackRes.rows.length > 0) {
          console.log(`Resolved options from menu "${cand.menu_name}":`);
          console.table(fallbackRes.rows);
        }
      }
    }

  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

test();
