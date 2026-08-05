const pool = require('../db');

const getItemOptionsFixed = async (itemId, userId) => {
    try {
        // 1. Get the target item and its menu_id
        const itemInfoRes = await pool.query(
            "SELECT id, menu_id, item_name, base_price, item_type FROM outlet_menu_items WHERE id = $1 LIMIT 1",
            [itemId]
        );
        if (itemInfoRes.rows.length === 0) return null;
        const targetItem = itemInfoRes.rows[0];

        // 2. Check explicit option_groups in item_option_groups
        const ogRes = await pool.query(
            `SELECT og.id, og.name, og.min_selectable, og.max_selectable
             FROM option_groups og
             JOIN item_option_groups iog ON og.id = iog.group_id
             WHERE iog.item_id = $1 AND og.is_active = true 
             ORDER BY og.sorting_order ASC, og.id ASC`,
            [itemId]
        );

        if (ogRes.rows.length > 0) {
            const og = ogRes.rows[0];
            const groupIds = ogRes.rows.map(r => r.id);

            const optionsRes = await pool.query(
                `SELECT DISTINCT ON (ol.id) 
                    ol.id, ol.group_id, ol.name, ol.price_override, 
                    omi.base_price as matched_price,
                    omi.id as menu_item_id
                 FROM options_list ol 
                 LEFT JOIN outlet_menu_items omi ON omi.menu_id = $1 
                    AND LOWER(TRIM(omi.item_name)) = LOWER(TRIM(ol.name))
                    AND omi.is_active = true
                 WHERE ol.group_id = ANY($2) AND ol.is_active = true 
                 ORDER BY ol.id ASC, omi.id ASC`,
                [targetItem.menu_id, groupIds]
            );

            if (optionsRes.rows.length > 0) {
                const parsedOptions = optionsRes.rows.map(ol => {
                    const overridePrice = parseFloat(ol.price_override) || 0;
                    const matchedPrice = parseFloat(ol.matched_price) || 0;
                    const price = overridePrice > 0 ? overridePrice : matchedPrice;
                    return {
                        id: ol.menu_item_id || ol.id,
                        name: ol.name,
                        price: price
                    };
                });

                return {
                    groupId: og.id,
                    groupName: og.name,
                    minSelectable: og.min_selectable,
                    maxSelectable: og.max_selectable,
                    options: parsedOptions
                };
            }
        }

        // 3. Check for sub-items (item_type = '1') immediately below targetItem in the SAME menu
        const nextParentRes = await pool.query(
            `SELECT MIN(id) as next_id FROM outlet_menu_items 
             WHERE menu_id = $1 AND item_type = '0' AND id > $2`,
            [targetItem.menu_id, targetItem.id]
        );
        const nextParentId = nextParentRes.rows[0]?.next_id;

        // Only query sub-items if next parent is reasonably close (id difference < 20) or if sub-items exist
        let subItemQuery = `
            SELECT id, item_name as name, base_price as price
            FROM outlet_menu_items
            WHERE menu_id = $1
              AND item_type = '1'
              AND id > $2
        `;
        const queryParams = [targetItem.menu_id, targetItem.id];

        if (nextParentId) {
            subItemQuery += ` AND id < $3`;
            queryParams.push(nextParentId);
        } else {
            // If no next parent item_type = '0' exists, cap search to id <= itemId + 10 to avoid grabbing distant items
            subItemQuery += ` AND id <= $3`;
            queryParams.push(targetItem.id + 10);
        }

        subItemQuery += ` ORDER BY id ASC`;

        const fallbackRes = await pool.query(subItemQuery, queryParams);
        if (fallbackRes.rows.length > 0) {
            return {
                groupId: targetItem.id,
                groupName: "Size/Portion",
                minSelectable: 1,
                maxSelectable: 1,
                options: fallbackRes.rows.map(o => ({
                    id: o.id,
                    name: o.name,
                    price: parseFloat(o.price) || 0
                }))
            };
        }

        return null;
    } catch (e) {
        console.error("Error in getItemOptionsFixed:", e);
        return null;
    }
};

async function testAll() {
    try {
        console.log("--- TESTING CHEESE PIZZA (6203 in menu 35) ---");
        const res6203 = await getItemOptionsFixed(6203, 55);
        console.log("6203 Options:", res6203);

        console.log("\n--- TESTING CHEESE PIZZA (6031 in menu 34) ---");
        const res6031 = await getItemOptionsFixed(6031, 55);
        console.log("6031 Options:", res6031);

        console.log("\n--- TESTING TANDOORI CHICKEN (6051 in menu 34) ---");
        const res6051 = await getItemOptionsFixed(6051, 55);
        console.log("6051 Options:", res6051);

        console.log("\n--- TESTING KABAB (5887 in menu 34) ---");
        const res5887 = await getItemOptionsFixed(5887, 55);
        console.log("5887 Options:", res5887);

    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

testAll();
