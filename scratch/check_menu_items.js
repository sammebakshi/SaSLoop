const pool = require('../db');

async function checkMenu() {
    try {
        const items = await pool.query(`
            SELECT id, menu_id, item_name, base_price, item_type 
            FROM outlet_menu_items 
            WHERE menu_id IN (34, 35)
            ORDER BY id ASC
        `);
        console.log(`Total items for menu 34 and 35: ${items.rows.length}`);
        console.table(items.rows);

        // Check option_groups for user 55
        const ogRes = await pool.query(`
            SELECT og.id as group_id, og.name as group_name, ol.id as option_id, ol.name as option_name, ol.price_override, iog.item_id, omi.item_name
            FROM option_groups og
            LEFT JOIN options_list ol ON og.id = ol.group_id
            LEFT JOIN item_option_groups iog ON og.id = iog.group_id
            LEFT JOIN outlet_menu_items omi ON iog.item_id = omi.id
            WHERE og.user_id = 55 OR og.outlet_id = 55
            ORDER BY og.id ASC, ol.id ASC
        `);
        console.log('\n--- OPTION GROUPS FOR USER 55 ---');
        console.table(ogRes.rows);

    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
checkMenu();
