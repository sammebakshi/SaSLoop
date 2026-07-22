const pool = require('../db');

async function checkOutletMenus() {
    try {
        console.log("=== OUTLET MENUS ===");
        const menus = await pool.query(`SELECT id, menu_name, is_pos_default, is_digital, is_digital_default, outlet_id, user_id FROM outlet_menus WHERE user_id = 55 OR outlet_id = 55`);
        console.table(menus.rows);

        console.log("=== ITEM COUNTS PER MENU ID ===");
        const counts = await pool.query(`SELECT menu_id, COUNT(*) as item_count FROM outlet_menu_items GROUP BY menu_id ORDER BY menu_id ASC`);
        console.table(counts.rows);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkOutletMenus();
