const pool = require('../db');

async function test() {
  try {
    console.log("=== SEARCHING FOR PIZZA ITEMS & OPTIONS IN DB ===");

    const pizzaItems = await pool.query(
      `SELECT omi.id, omi.menu_id, omi.item_name, omi.base_price, omi.item_type
       FROM outlet_menu_items omi
       WHERE LOWER(omi.item_name) LIKE '%pizza%'`
    );
    console.log("Pizza items in outlet_menu_items:");
    console.table(pizzaItems.rows);

    for (const p of pizzaItems.rows) {
      console.log(`\n--- Item ID ${p.id} (${p.item_name}) Menu ID ${p.menu_id} ---`);

      // Check item_option_groups
      const iog = await pool.query(
        `SELECT iog.*, og.name as group_name
         FROM item_option_groups iog
         JOIN option_groups og ON iog.group_id = og.id
         WHERE iog.item_id = $1`,
        [p.id]
      );
      console.log("item_option_groups:", iog.rows);

      if (iog.rows.length > 0) {
        for (const g of iog.rows) {
          const ol = await pool.query(
            `SELECT * FROM options_list WHERE group_id = $1`,
            [g.group_id]
          );
          console.log(`options_list for group ${g.group_id} (${g.group_name}):`);
          console.table(ol.rows);
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
