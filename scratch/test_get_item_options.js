const pool = require('../db');

const getItemOptionsTest = async (itemId, userId) => {
    try {
        let targetItemName = null;
        const itemInfoRes = await pool.query(
            "SELECT id, item_name, menu_id FROM outlet_menu_items WHERE id = $1 LIMIT 1",
            [itemId]
        );
        if (itemInfoRes.rows.length > 0) {
            targetItemName = itemInfoRes.rows[0].item_name;
        }

        console.log(`Target Item (${itemId}):`, itemInfoRes.rows[0]);

        const candidateIdsRes = await pool.query(
            `SELECT omi.id, omi.menu_id, omi.item_name 
             FROM outlet_menu_items omi
             JOIN outlet_menus om ON omi.menu_id = om.id
             WHERE (om.outlet_id = $1 OR om.user_id = $1)
               AND (omi.id = $2 OR LOWER(omi.item_name) = LOWER($3))
             ORDER BY om.is_pos_default DESC, om.is_digital_default DESC`,
            [userId, itemId, targetItemName || '']
        );
        console.log('Candidate IDs:', candidateIdsRes.rows);

        const candidateIds = candidateIdsRes.rows.map(r => r.id);

        if (candidateIds.length > 0) {
            // 1. Check item_option_groups
            const ogRes = await pool.query(
                `SELECT og.id, og.name, og.min_selectable, og.max_selectable
                 FROM option_groups og
                 JOIN item_option_groups iog ON og.id = iog.group_id
                 WHERE iog.item_id = ANY($1) AND og.is_active = true 
                 ORDER BY og.sorting_order ASC, og.id ASC`,
                [candidateIds]
            );
            console.log('Option Groups found:', ogRes.rows);

            if (ogRes.rows.length > 0) {
                // ...
            }

            // 2. Check item_type = '1' sub-items across candidate IDs
            for (const cand of candidateIdsRes.rows) {
                console.log(`Checking sub-items for candidate ${cand.id} (menu ${cand.menu_id})...`);
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
                console.log(`Fallback sub-items for candidate ${cand.id}:`, fallbackRes.rows);
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
};

getItemOptionsTest(6203, 55); // CHEESE PIZZA in Digital Menu 35
getItemOptionsTest(6031, 55); // CHEESE PIZZA in POS Menu 34
