const pool = require('./db');

const getItemOptionsPerfect = async (itemId, userId) => {
    try {
        // 1. Target item and menu_id
        const itemInfoRes = await pool.query(
            "SELECT id, menu_id, item_name, base_price, item_type FROM outlet_menu_items WHERE id = $1 LIMIT 1",
            [itemId]
        );
        if (itemInfoRes.rows.length === 0) return null;
        const targetItem = itemInfoRes.rows[0];

        // 2. Fetch sub-items (item_type = '1') specifically belonging to targetItem in the same menu
        const nextParentRes = await pool.query(
            `SELECT MIN(id) as next_id FROM outlet_menu_items 
             WHERE menu_id = $1 AND item_type = '0' AND id > $2`,
            [targetItem.menu_id, targetItem.id]
        );
        const nextParentId = nextParentRes.rows[0]?.next_id;

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
            subItemQuery += ` AND id <= $3`;
            queryParams.push(targetItem.id + 10);
        }

        subItemQuery += ` ORDER BY id ASC`;

        const subItemsRes = await pool.query(subItemQuery, queryParams);
        const subItemsMap = {};
        subItemsRes.rows.forEach(si => {
            subItemsMap[si.name.trim().toLowerCase()] = {
                id: si.id,
                name: si.name,
                price: parseFloat(si.price) || 0
            };
        });

        // 3. Check explicit option_groups in item_option_groups for targetItem
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
                `SELECT ol.id, ol.group_id, ol.name, ol.price_override
                 FROM options_list ol
                 WHERE ol.group_id = ANY($1) AND ol.is_active = true 
                 ORDER BY ol.sorting_order ASC, ol.id ASC`,
                [groupIds]
            );

            if (optionsRes.rows.length > 0) {
                const parsedOptions = optionsRes.rows.map(ol => {
                    const overridePrice = parseFloat(ol.price_override) || 0;
                    const cleanOptName = ol.name.trim().toLowerCase();
                    const subItem = subItemsMap[cleanOptName];

                    let price = 0;
                    if (overridePrice > 0) {
                        price = overridePrice;
                    } else if (subItem && subItem.price > 0) {
                        price = subItem.price;
                    } else {
                        price = parseFloat(targetItem.base_price) || 0;
                    }

                    return {
                        id: subItem?.id || ol.id,
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

        // 4. Fallback to sub-items if no explicit option_groups defined
        if (subItemsRes.rows.length > 0) {
            return {
                groupId: targetItem.id,
                groupName: "Size/Portion",
                minSelectable: 1,
                maxSelectable: 1,
                options: subItemsRes.rows.map(o => ({
                    id: o.id,
                    name: o.name,
                    price: parseFloat(o.price) || 0
                }))
            };
        }

        return null;
    } catch (e) {
        console.error("Error in getItemOptionsPerfect:", e);
        return null;
    }
};

async function testPerfect() {
    try {
        console.log("--- TESTING CHEESE PIZZA (154 in menu 1 on Cloud DB) ---");
        const r154 = await getItemOptionsPerfect(154, 2);
        console.log("CHEESE PIZZA 154 Options:", r154);

        console.log("\n--- TESTING KABAB (10 in menu 1 on Cloud DB) ---");
        const r10 = await getItemOptionsPerfect(10, 2);
        console.log("KABAB 10 Options:", r10);

        console.log("\n--- TESTING TANDOORI CHICKEN (85 in menu 1 on Cloud DB) ---");
        const r85 = await getItemOptionsPerfect(85, 2);
        console.log("TANDOORI CHICKEN 85 Options:", r85);

    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

testPerfect();
