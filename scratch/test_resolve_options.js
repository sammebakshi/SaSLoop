const pool = require('../db');

async function testResolution() {
  try {
    const ogs = await pool.query('SELECT * FROM option_groups ORDER BY id DESC');
    console.log(`Found ${ogs.rows.length} option groups.`);

    for (let group of ogs.rows) {
      console.log(`\n========================================`);
      console.log(`GROUP ID ${group.id}: "${group.name}"`);

      // 1. Fetch main items (either linked or matched by group name)
      let mainItems = [];
      let linkedRes = await pool.query(`
        SELECT iog.item_id, omi.id as menu_item_id, omi.item_name, omi.menu_id, omi.base_price
        FROM item_option_groups iog
        JOIN outlet_menu_items omi ON omi.id = iog.item_id
        WHERE iog.group_id = $1
      `, [group.id]);

      if (linkedRes.rows.length > 0) {
        mainItems = linkedRes.rows;
      } else {
        const nameMatchRes = await pool.query(`
          SELECT id as menu_item_id, item_name, menu_id, base_price
          FROM outlet_menu_items
          WHERE item_name ILIKE $1
          ORDER BY id DESC
        `, [group.name]);
        mainItems = nameMatchRes.rows;
      }

      console.log('Main Items Found:', mainItems.map(m => `${m.item_name} (ID: ${m.menu_item_id}, Menu: ${m.menu_id})`).join(', '));

      // 2. Fetch options
      const options = await pool.query('SELECT * FROM options_list WHERE group_id = $1', [group.id]);

      for (let opt of options.rows) {
        let price = parseFloat(opt.price_override || 0);
        console.log(`  Option: "${opt.name}" (Stored price_override: ${opt.price_override})`);

        if (price === 0) {
          let resolvedPrice = 0;

          // Attempt A: Search for option item immediately following main item (id >= main_item_id)
          for (let mItem of mainItems) {
            const matchAfter = await pool.query(`
              SELECT base_price, item_name, id, menu_id
              FROM outlet_menu_items
              WHERE menu_id = $1
                AND item_name ILIKE $2
                AND id >= $3
                AND COALESCE(NULLIF(base_price::text, ''), '0')::numeric > 0
              ORDER BY id ASC
              LIMIT 1
            `, [mItem.menu_id, opt.name, mItem.menu_item_id]);

            if (matchAfter.rows.length > 0) {
              resolvedPrice = parseFloat(matchAfter.rows[0].base_price);
              console.log(`    -> Resolved via Main Item ID ${mItem.menu_item_id} context: ₹${resolvedPrice} (Option Item ID: ${matchAfter.rows[0].id}, Name: "${matchAfter.rows[0].item_name}")`);
              break;
            }
          }

          // Fallback: Global search in menu 34
          if (resolvedPrice === 0) {
            const matchGlobal = await pool.query(`
              SELECT base_price, item_name, id, menu_id
              FROM outlet_menu_items
              WHERE item_name ILIKE $1
                AND COALESCE(NULLIF(base_price::text, ''), '0')::numeric > 0
              ORDER BY (CASE WHEN menu_id = 34 THEN 1 ELSE 2 END), id ASC
              LIMIT 1
            `, [opt.name]);

            if (matchGlobal.rows.length > 0) {
              resolvedPrice = parseFloat(matchGlobal.rows[0].base_price);
              console.log(`    -> Resolved via Fallback Match: ₹${resolvedPrice} (Item ID: ${matchGlobal.rows[0].id})`);
            }
          }

          if (resolvedPrice === 0) {
            console.log(`    -> COULD NOT RESOLVE PRICE (0)`);
          }
        }
      }
    }
  } catch(e) {
    console.error('ERROR:', e);
  } finally {
    process.exit(0);
  }
}

testResolution();
