const pool = require('../db');

async function check() {
    try {
        const uRes = await pool.query('SELECT id, username FROM app_users');
        console.log('Users:', uRes.rows);

        const items = await pool.query(`
            SELECT id, item_name, base_price, item_type, menu_id 
            FROM outlet_menu_items 
            WHERE item_name ILIKE '%PIZZA%' OR item_name ILIKE '%CHEESE%' OR item_name ILIKE '%TANDOORI%'
            ORDER BY id ASC
        `);
        console.log('\n--- OUTLET MENU ITEMS (PIZZA / TANDOORI) ---');
        console.log(items.rows);

        const ogRes = await pool.query('SELECT * FROM option_groups');
        console.log('\n--- OPTION GROUPS ---');
        console.log(ogRes.rows);

        const olRes = await pool.query('SELECT * FROM options_list');
        console.log('\n--- OPTIONS LIST ---');
        console.log(olRes.rows);

        const iogRes = await pool.query('SELECT * FROM item_option_groups');
        console.log('\n--- ITEM OPTION GROUPS ---');
        console.log(iogRes.rows);

    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
check();
