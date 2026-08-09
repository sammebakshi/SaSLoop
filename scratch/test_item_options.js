require('dotenv').config();
const pool = require('./db');

async function testOptions() {
    const userId = 2;
    console.log("=== Testing Digital Default Menu Option Rates for User 2 ===");
    
    // Fetch Digital Default Menu ID
    const menuRes = await pool.query(
        `SELECT id, is_digital_default, is_pos_default FROM outlet_menus 
         WHERE (outlet_id = $1 OR user_id = $1) 
         ORDER BY is_digital_default DESC, is_digital DESC, id DESC`,
        [userId]
    );
    console.log("Menus for user 2:", menuRes.rows);

    // Fetch items with option groups
    const ogRes = await pool.query(
        `SELECT DISTINCT omi.id, omi.item_name, om.is_digital_default
         FROM outlet_menu_items omi
         JOIN outlet_menus om ON omi.menu_id = om.id
         JOIN item_option_groups iog ON omi.id = iog.item_id
         WHERE om.outlet_id = $1 OR om.user_id = $1`,
        [userId]
    );
    console.log("Items with option groups:", ogRes.rows);

    if (ogRes.rows.length > 0) {
        const item = ogRes.rows[0];
        console.log(`\nTesting options for item: ${item.item_name} (ID: ${item.id})...`);
        
        const candidateIdsRes = await pool.query(
            `SELECT omi.id, omi.menu_id, om.is_digital_default
             FROM outlet_menu_items omi
             JOIN outlet_menus om ON omi.menu_id = om.id
             WHERE (om.outlet_id = $1 OR om.user_id = $1)
               AND (omi.id = $2 OR LOWER(omi.item_name) = LOWER($3))
             ORDER BY om.is_digital_default DESC, om.is_digital DESC, om.is_pos_default DESC`,
            [userId, item.id, item.item_name]
        );
        console.log("Candidate IDs for item:", candidateIdsRes.rows);

        const candidateIds = candidateIdsRes.rows.map(r => r.id);
        const groupRes = await pool.query(
            `SELECT og.id, og.name, og.min_selectable, og.max_selectable
             FROM option_groups og
             JOIN item_option_groups iog ON og.id = iog.group_id
             WHERE iog.item_id = ANY($1) AND og.is_active = true 
             ORDER BY og.sorting_order ASC, og.id ASC`,
            [candidateIds]
        );
        console.log("Option groups:", groupRes.rows);

        if (groupRes.rows.length > 0) {
            const groupIds = groupRes.rows.map(r => r.id);
            const optionsRes = await pool.query(
                `SELECT DISTINCT ON (ol.id) 
                    ol.id, ol.group_id, ol.name, ol.price_override, 
                    omi.base_price as matched_price,
                    omi.id as menu_item_id,
                    om.is_digital_default
                 FROM options_list ol 
                 LEFT JOIN outlet_menu_items omi ON (omi.menu_id IN (
                    SELECT id FROM outlet_menus WHERE (outlet_id = $1 OR user_id = $1)
                 )) AND (
                    omi.item_name ILIKE ol.name 
                    OR omi.item_name ILIKE '%' || ol.name
                    OR ol.name ILIKE '%' || omi.item_name
                 ) AND omi.is_active = true
                 LEFT JOIN outlet_menus om ON omi.menu_id = om.id
                 WHERE ol.group_id = ANY($2) AND ol.is_active = true 
                 ORDER BY ol.id ASC, om.is_digital_default DESC NULLS LAST, om.is_digital DESC NULLS LAST, omi.id ASC`,
                [userId, groupIds]
            );
            console.log("Matched options with menu sources & prices:", optionsRes.rows);
        }
    }

    process.exit(0);
}

testOptions();
