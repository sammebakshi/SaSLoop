const pool = require('../db');

async function checkPizza() {
    try {
        // Find user_id for restaurant Shahe Tehzeeb
        const restRes = await pool.query("SELECT user_id, name FROM restaurants WHERE name ILIKE '%SHAHE%' OR name ILIKE '%TEHZEEB%'");
        console.log('Restaurants:', restRes.rows);
        const userId = restRes.rows[0]?.user_id || 48;

        console.log('\n========================================');
        console.log(`Checking menu items for user_id = ${userId}`);
        console.log('========================================');

        const menus = await pool.query("SELECT * FROM outlet_menus WHERE outlet_id = $1 OR user_id = $1", [userId]);
        console.log('Menus:', menus.rows.map(m => ({ id: m.id, name: m.menu_name, is_pos_default: m.is_pos_default, is_digital_default: m.is_digital_default })));

        const items = await pool.query(`
            SELECT id, menu_id, item_name, base_price, item_type, category_id 
            FROM outlet_menu_items 
            WHERE (menu_id IN (SELECT id FROM outlet_menus WHERE outlet_id = $1 OR user_id = $1))
              AND (item_name ILIKE '%PIZZA%' OR item_name ILIKE '%TANDOORI%' OR item_name ILIKE '%SMALL%' OR item_name ILIKE '%MEDIUM%' OR item_name ILIKE '%LARGE%')
            ORDER BY id ASC
        `, [userId]);
        console.log('\n--- MENU ITEMS MATCHING PIZZA / SIZE ---');
        console.table(items.rows);

        // Check option_groups for this user/outlet
        const ogRes = await pool.query(`
            SELECT og.id as group_id, og.name as group_name, ol.id as option_id, ol.name as option_name, ol.price_override, iog.item_id, omi.item_name
            FROM option_groups og
            JOIN options_list ol ON og.id = ol.group_id
            LEFT JOIN item_option_groups iog ON og.id = iog.group_id
            LEFT JOIN outlet_menu_items omi ON iog.item_id = omi.id
            WHERE og.user_id = $1 OR og.outlet_id = $1
            ORDER BY og.id ASC, ol.id ASC
        `, [userId]);
        console.log('\n--- OPTION GROUPS & OPTIONS LIST FOR USER ---');
        console.table(ogRes.rows);

    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
checkPizza();
