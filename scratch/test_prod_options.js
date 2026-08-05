const pool = require('./db');

async function testProd() {
    try {
        console.log("=== PROD DB DIAGNOSTIC ===");

        // 1. Get default digital menu for user_id = 2 (Shahe Tehzeeb on prod)
        const menuRes = await pool.query(
            `SELECT id, menu_name, is_pos_default, is_digital_default FROM outlet_menus 
             WHERE (outlet_id = 2 OR user_id = 2) 
               AND (is_digital_default = true OR is_digital = true) 
             ORDER BY is_digital_default DESC, is_digital DESC, id DESC LIMIT 1`
        );
        console.log("Digital Default Menu for User 2:", menuRes.rows[0]);

        // 2. Query CHEESE PIZZA items for user 2
        const pizzaRes = await pool.query(
            `SELECT omi.id, omi.menu_id, om.menu_name, omi.item_name, omi.base_price, omi.item_type 
             FROM outlet_menu_items omi
             JOIN outlet_menus om ON omi.menu_id = om.id
             WHERE (om.user_id = 2 OR om.outlet_id = 2) AND omi.item_name ILIKE '%CHEESE PIZZA%'`
        );
        console.log("CHEESE PIZZA items for User 2:");
        console.table(pizzaRes.rows);

        // 3. Test getItemOptions for each CHEESE PIZZA id
        const whatsappManager = require('./whatsappManager');
        for (const item of pizzaRes.rows) {
            console.log(`\nTesting getItemOptions for Item ID ${item.id} (${item.item_name} in menu ${item.menu_id})...`);
            // We can call getItemOptions logic directly
            const optRes = await pool.query(
                `SELECT og.id, og.name, og.min_selectable, og.max_selectable
                 FROM option_groups og
                 JOIN item_option_groups iog ON og.id = iog.group_id
                 WHERE iog.item_id = $1 AND og.is_active = true`,
                [item.id]
            );
            console.log(`Explicit Option Groups for Item ${item.id}:`, optRes.rows);

            // Sub-items immediately below item.id
            const nextParentRes = await pool.query(
                `SELECT MIN(id) as next_id FROM outlet_menu_items 
                 WHERE menu_id = $1 AND item_type = '0' AND id > $2`,
                [item.menu_id, item.id]
            );
            const nextParentId = nextParentRes.rows[0]?.next_id;
            console.log(`Next parent ID after ${item.id} in menu ${item.menu_id}:`, nextParentId);

            const subItems = await pool.query(
                `SELECT id, item_name, base_price, item_type FROM outlet_menu_items
                 WHERE menu_id = $1 AND item_type = '1' AND id > $2 AND id < COALESCE($3, $2 + 10)`,
                [item.menu_id, item.id, nextParentId]
            );
            console.log(`Sub-items for ${item.id}:`);
            console.table(subItems.rows);
        }

    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

testProd();
