const pool = require("../db");

async function check() {
    try {
        const outletId = '12'; // String
        const result = await pool.query(
            `SELECT og.id, og.name, og.min_selectable, og.max_selectable, iog.item_id
             FROM option_groups og
             JOIN item_option_groups iog ON og.id = iog.group_id
             WHERE og.outlet_id = $1`,
            [outletId]
        );
        console.log("Option groups found:", result.rows);
        
        for (let group of result.rows) {
            const optionsRes = await pool.query(
                `SELECT ol.id, ol.name, ol.price_override, omi.base_price as item_price
                 FROM options_list ol
                 LEFT JOIN outlet_menu_items omi ON ol.name = omi.item_name AND omi.menu_id = (SELECT id FROM outlet_menus WHERE outlet_id = $1 LIMIT 1)
                 WHERE ol.group_id = $2 ORDER BY ol.sorting_order ASC`,
                [outletId, group.id]
            );
            console.log(`Options for group ${group.name}:`, optionsRes.rows);
        }
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

check();
