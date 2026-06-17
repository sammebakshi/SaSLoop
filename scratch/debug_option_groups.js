const pool = require("../db");

async function debug() {
  try {
    const outletId = 48;
    console.log(`Using outletId: ${outletId}`);

    console.log("\n3. Testing query: Fetching option groups...");
    const result = await pool.query(
        `SELECT og.id, og.name, og.min_selectable, og.max_selectable, iog.item_id
         FROM option_groups og
         JOIN item_option_groups iog ON og.id = iog.group_id
         WHERE og.outlet_id = $1 AND og.is_active = true`,
        [outletId]
    );
    console.log(`Found ${result.rows.length} option groups linked to items:`);
    console.log(result.rows);

    console.log("\n4. Running the full option groups and options query for each group...");
    const groups = result.rows;
    for (let group of groups) {
        console.log(`\nFetching options for group: ${group.name} (ID: ${group.id}, item_id: ${group.item_id})`);
        const optionsRes = await pool.query(
            `SELECT * FROM (
              SELECT DISTINCT ON (ol.id) ol.id, ol.name, ol.price_override, omi.base_price as item_price, ol.sorting_order
              FROM options_list ol
              LEFT JOIN outlet_menu_items omi ON ol.name = omi.item_name 
                AND omi.menu_id = (SELECT menu_id FROM outlet_menu_items WHERE id = $1)
                AND (
                  (omi.item_type = '0') 
                  OR 
                  (
                    omi.item_type = '1' 
                    AND omi.id > $1 
                    AND omi.id < COALESCE(
                      (SELECT MIN(id) FROM outlet_menu_items WHERE item_type = '0' AND menu_id = (SELECT menu_id FROM outlet_menu_items WHERE id = $1) AND id > $1), 
                      99999999
                    )
                  )
                )
              WHERE ol.group_id = $2 AND ol.is_active = true 
                AND (omi.id IS NULL OR omi.is_active = true)
              ORDER BY ol.id, omi.item_type DESC, omi.id ASC
            ) sub
            ORDER BY sorting_order ASC`,
            [group.item_id, group.id]
        );
        
        console.log("Raw options result rows:", optionsRes.rows);
        const mappedOptions = optionsRes.rows.map(o => ({
            id: o.id,
            name: o.name,
            price_override: parseFloat(o.price_override) > 0 ? o.price_override : o.item_price
        }));
        console.log("Mapped options:", mappedOptions);
    }
  } catch (err) {
    console.error("Error in debug:", err);
  } finally {
    await pool.end();
  }
}

debug();
