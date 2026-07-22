const pool = require('../db');

async function testPosRoutesQuery() {
  try {
    const group = { id: 9, name: 'SHAHE TEHZEEB WAZWAN THALI' };

    // Get linked item ID for active menu (menu_id=34)
    const linked = await pool.query(`
      SELECT omi.id, omi.item_name, omi.menu_id 
      FROM item_option_groups iog
      JOIN outlet_menu_items omi ON omi.id = iog.item_id
      WHERE iog.group_id = $1
      ORDER BY (CASE WHEN omi.menu_id = 34 THEN 1 ELSE 2 END), omi.id DESC
    `, [group.id]);

    let menuItemId = linked.rows[0]?.id;
    if (!menuItemId) {
      const matchMain = await pool.query(`
        SELECT id FROM outlet_menu_items 
        WHERE item_name ILIKE $1 
        ORDER BY (CASE WHEN menu_id = 34 THEN 1 ELSE 2 END), id DESC 
        LIMIT 1
      `, [group.name]);
      menuItemId = matchMain.rows[0]?.id;
    }

    console.log(`Testing group ${group.id} ("${group.name}") with menuItemId ${menuItemId}`);

    // Fetch options for the group
    const optionsRes = await pool.query(
      "SELECT id, name, price_override, is_active, sorting_order FROM options_list WHERE group_id = $1 AND is_active = true ORDER BY sorting_order ASC",
      [group.id]
    );

    const resolvedOptions = [];

    for (let o of optionsRes.rows) {
      let price = parseFloat(o.price_override || 0);

      if (price === 0) {
        // Attempt A: Match within same menu_id starting after menuItemId
        const matchMenu = await pool.query(`
          SELECT base_price
          FROM outlet_menu_items
          WHERE menu_id = (SELECT menu_id FROM outlet_menu_items WHERE id = $1)
            AND item_name ILIKE $2
            AND id >= $1
            AND COALESCE(NULLIF(base_price::text, ''), '0')::numeric > 0
          ORDER BY id ASC
          LIMIT 1
        `, [menuItemId, o.name]);

        if (matchMenu.rows.length > 0) {
          price = parseFloat(matchMenu.rows[0].base_price);
        } else {
          // Attempt B: Match within same menu_id anywhere
          const matchMenuAny = await pool.query(`
            SELECT base_price
            FROM outlet_menu_items
            WHERE menu_id = (SELECT menu_id FROM outlet_menu_items WHERE id = $1)
              AND item_name ILIKE $2
              AND COALESCE(NULLIF(base_price::text, ''), '0')::numeric > 0
            ORDER BY id ASC
            LIMIT 1
          `, [menuItemId, o.name]);

          if (matchMenuAny.rows.length > 0) {
            price = parseFloat(matchMenuAny.rows[0].base_price);
          } else {
            // Attempt C: Match anywhere globally
            const matchGlobal = await pool.query(`
              SELECT base_price
              FROM outlet_menu_items
              WHERE item_name ILIKE $1
                AND COALESCE(NULLIF(base_price::text, ''), '0')::numeric > 0
              ORDER BY (CASE WHEN menu_id = 34 THEN 1 ELSE 2 END), id ASC
              LIMIT 1
            `, [o.name]);

            if (matchGlobal.rows.length > 0) {
              price = parseFloat(matchGlobal.rows[0].base_price);
            }
          }
        }
      }

      resolvedOptions.push({
        id: o.id,
        name: o.name,
        price_override: price
      });
    }

    console.log('Resolved Options for Group 9:', resolvedOptions);

  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

testPosRoutesQuery();
