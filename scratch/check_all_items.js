const pool = require('../db');

async function checkAll() {
    try {
        const users = await pool.query("SELECT id, username, name FROM app_users");
        console.log('ALL USERS:', users.rows);

        const restaurants = await pool.query("SELECT id, user_id, name FROM restaurants");
        console.log('ALL RESTAURANTS:', restaurants.rows);

        const menus = await pool.query("SELECT id, outlet_id, user_id, menu_name, is_pos_default, is_digital_default FROM outlet_menus");
        console.log('ALL MENUS:', menus.rows);

        const pizzaItems = await pool.query(`
            SELECT omi.id, omi.menu_id, om.user_id, om.outlet_id, omi.item_name, omi.base_price, omi.item_type
            FROM outlet_menu_items omi
            JOIN outlet_menus om ON omi.menu_id = om.id
            WHERE omi.item_name ILIKE '%PIZZA%' OR omi.item_name ILIKE '%CHEESE%' OR omi.item_name ILIKE '%TANDOORI%'
            ORDER BY omi.id ASC
        `);
        console.log('\n--- ALL PIZZA / TANDOORI ITEMS IN OUTLET_MENU_ITEMS ---');
        console.table(pizzaItems.rows);

        // Check fallback business_items table
        const bizItems = await pool.query(`
            SELECT id, user_id, product_name, price, availability
            FROM business_items
            WHERE product_name ILIKE '%PIZZA%' OR product_name ILIKE '%CHEESE%' OR product_name ILIKE '%TANDOORI%'
            ORDER BY id ASC
        `);
        console.log('\n--- BUSINESS ITEMS ---');
        console.table(bizItems.rows);

    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
checkAll();
