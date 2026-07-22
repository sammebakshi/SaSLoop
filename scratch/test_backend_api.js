const pool = require('../db');

async function testApi() {
  try {
    const ownerId = 55;
    const ogRes = await pool.query("SELECT * FROM option_groups WHERE user_id = $1 OR outlet_id = $1 ORDER BY id DESC", [ownerId]);
    const groups = ogRes.rows;

    for (let group of groups) {
      let mainItems = [];
      const linkedRes = await pool.query(
        `SELECT iog.item_id, omi.id as menu_item_id, omi.item_name, omi.menu_id, omi.base_price
         FROM item_option_groups iog
         JOIN outlet_menu_items omi ON omi.id = iog.item_id
         WHERE iog.group_id = $1`,
        [group.id]
      );

      if (linkedRes.rows.length > 0) {
        mainItems = linkedRes.rows;
      } else {
        const nameMatchRes = await pool.query(
          `SELECT id as menu_item_id, item_name, menu_id, base_price
           FROM outlet_menu_items
           WHERE item_name ILIKE $1
           ORDER BY id DESC`,
          [group.name]
        );
        mainItems = nameMatchRes.rows;
      }

      const optionsRes = await pool.query(
        "SELECT id, name, price_override, is_active, sorting_order FROM options_list WHERE group_id = $1 ORDER BY sorting_order ASC",
        [group.id]
      );

      for (let opt of optionsRes.rows) {
        if (parseFloat(opt.price_override || 0) === 0) {
          let resolvedPrice = 0;

          for (let mItem of mainItems) {
            const matchAfter = await pool.query(
              `SELECT base_price
               FROM outlet_menu_items
               WHERE menu_id = $1
                 AND item_name ILIKE $2
                 AND id >= $3
                 AND COALESCE(NULLIF(base_price::text, ''), '0')::numeric > 0
               ORDER BY id ASC
               LIMIT 1`,
              [mItem.menu_id, opt.name, mItem.menu_item_id]
            ).catch(() => null);

            if (matchAfter && matchAfter.rows.length > 0) {
              resolvedPrice = parseFloat(matchAfter.rows[0].base_price);
              break;
            }
          }

          if (resolvedPrice === 0) {
            const matchGlobal = await pool.query(
              `SELECT base_price
               FROM outlet_menu_items
               WHERE item_name ILIKE $1
                 AND COALESCE(NULLIF(base_price::text, ''), '0')::numeric > 0
               ORDER BY (CASE WHEN menu_id = 34 THEN 1 ELSE 2 END), id ASC
               LIMIT 1`,
              [opt.name]
            ).catch(() => null);

            if (matchGlobal && matchGlobal.rows.length > 0) {
              resolvedPrice = parseFloat(matchGlobal.rows[0].base_price);
            }
          }

          if (resolvedPrice > 0) {
            opt.price_override = resolvedPrice;
          }
        }
      }
      group.associated_options = optionsRes.rows;
      console.log(`\nGroup "${group.name}" -> Associated Options:`, group.associated_options);
    }
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

testApi();
