const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:Admin%40123@localhost:5432/sasloop_db"
});

async function run() {
  try {
    const outletId = 48;
    const result = await pool.query(
        `SELECT og.id, og.name, og.min_selectable, og.max_selectable, COALESCE(omi.item_id, iog.item_id) as item_id
         FROM option_groups og
         JOIN item_option_groups iog ON og.id = iog.group_id
         LEFT JOIN outlet_menu_items omi ON iog.item_id = omi.id
         WHERE og.outlet_id = $1 AND og.is_active = true`,
        [outletId]
    );
    
    const groups = result.rows;
    console.log(`Found ${groups.length} option groups for outlet ${outletId}:`);
    for (let group of groups) {
      console.log(`\nGroup: ${group.name} (ID: ${group.id}), Item ID: ${group.item_id}`);
      
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
            ORDER BY ol.id, omi.item_type DESC, omi.id ASC
          ) sub
          ORDER BY sorting_order ASC`,
          [group.item_id, group.id]
      );
      
      console.log("  Options raw query result:", optionsRes.rows);
      
      const mappedOptions = optionsRes.rows.map(o => ({
          id: o.id,
          name: o.name,
          price_override: parseFloat(o.price_override) > 0 ? o.price_override : o.item_price
      }));
      console.log("  Mapped Options:", mappedOptions);
    }
  } catch (err) {
    console.error("QUERY FAILED:", err.message);
  }
  pool.end();
}

run().catch(console.error);
