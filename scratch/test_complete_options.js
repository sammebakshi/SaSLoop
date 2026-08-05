const pool = require('../db');

async function test() {
  try {
    const userId = 55;

    // Test item loading query
    const itemsRes = await pool.query(
        `SELECT omi.id, 
                omi.item_name AS product_name, 
                omi.base_price AS price, 
                omi.is_active AS availability, 
                omi.stock_qty AS stock_count,
                COALESCE(c.name, 'General') as category,
                om.menu_name,
                om.is_pos_default,
                om.is_digital_default
         FROM outlet_menu_items omi
         JOIN outlet_menus om ON omi.menu_id = om.id
         LEFT JOIN categories c ON omi.category_id = c.id
         WHERE (om.outlet_id = $1 OR om.user_id = $1)
           AND omi.item_type = '0' 
           AND omi.is_active = true
           AND (c.id IS NULL OR c.is_active = true)
           AND omi.item_name NOT IN (SELECT name FROM options_list)
         ORDER BY om.is_pos_default DESC, om.is_digital_default DESC, omi.id ASC`,
        [userId]
    );

    console.log(`Total main items loaded for User 55: ${itemsRes.rows.length}`);

    // Deduplicate items by product_name
    const seen = new Set();
    const uniqueItems = [];
    for (const item of itemsRes.rows) {
      const key = item.product_name.trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        uniqueItems.push(item);
      }
    }
    console.log(`Unique main items for User 55: ${uniqueItems.length}`);

    console.log("\nSample items:");
    console.table(uniqueItems.slice(0, 15).map(i => ({ id: i.id, name: i.product_name, price: i.price, menu: i.menu_name })));

    // Test option resolution for a few items (e.g. MUSHROOM PIZZA, CHICKEN BIRYANI, MEETHI)
    const testNames = ['MUSHROOM PIZZA', 'CHEESE PIZZA', 'CHICKEN BIRYANI', 'MEETHI', 'KABAB'];
    for (const name of testNames) {
      const match = uniqueItems.find(i => i.product_name.toLowerCase().includes(name.toLowerCase()));
      if (match) {
        console.log(`\n========================================`);
        console.log(`Testing Options for: "${match.product_name}" (ID: ${match.id})`);
        console.log(`========================================`);

        const candidateIdsRes = await pool.query(
            `SELECT omi.id, omi.menu_id, omi.item_name, om.menu_name 
             FROM outlet_menu_items omi
             JOIN outlet_menus om ON omi.menu_id = om.id
             WHERE (om.outlet_id = $1 OR om.user_id = $1)
               AND (omi.id = $2 OR LOWER(omi.item_name) = LOWER($3))
             ORDER BY om.is_pos_default DESC, om.is_digital_default DESC`,
            [userId, match.id, match.product_name]
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
            console.log(`Found options in menu "${cand.menu_name}" for cand ID ${cand.id}:`);
            console.table(fallbackRes.rows);
          }
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
