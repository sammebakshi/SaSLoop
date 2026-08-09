require('dotenv').config();
const pool = require('./db');

async function checkAfghaniChicken() {
    console.log("=== Inspecting AFGHANI CHICKEN Menu Structure ===");
    
    // Find Afghani Chicken in outlet_menu_items for Digital Default Menu
    const res = await pool.query(
        `SELECT omi.id, omi.menu_id, omi.item_name, omi.item_type, omi.base_price, omi.short_code, om.is_digital_default
         FROM outlet_menu_items omi
         JOIN outlet_menus om ON omi.menu_id = om.id
         WHERE omi.item_name ILIKE '%AFGHANI CHICKEN%' AND om.is_digital_default = true`
    );
    console.log("Base items for AFGHANI CHICKEN in Digital Menu:", res.rows);

    for (const baseItem of res.rows) {
        // Fetch item_type = '1' sub-items right below this base item in outlet_menu_items
        const subItemsRes = await pool.query(
            `SELECT id, item_name, base_price, item_type, short_code
             FROM outlet_menu_items
             WHERE menu_id = $1
               AND item_type = '1'
               AND id > $2
               AND id < COALESCE(
                 (SELECT MIN(id) FROM outlet_menu_items WHERE item_type = '0' AND menu_id = $1 AND id > $2),
                 99999999
               )
             ORDER BY id ASC`,
            [baseItem.menu_id, baseItem.id]
        );
        console.log(`Sub-items (item_type='1') for base item ID ${baseItem.id} (${baseItem.item_name}):`, subItemsRes.rows);

        // Fetch option_groups attached to this base item
        const ogRes = await pool.query(
            `SELECT og.id, og.name, ol.id as option_id, ol.name as option_name, ol.price_override
             FROM option_groups og
             JOIN item_option_groups iog ON og.id = iog.group_id
             JOIN options_list ol ON og.id = ol.group_id
             WHERE iog.item_id = $1`,
            [baseItem.id]
        );
        console.log(`Option groups attached to base item ID ${baseItem.id}:`, ogRes.rows);
    }

    process.exit(0);
}

checkAfghaniChicken();
