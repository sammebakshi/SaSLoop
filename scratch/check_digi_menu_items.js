const pool = require('../db');

async function checkDigiMenuItems() {
    try {
        console.log("=== CHECK MENUS FOR USER 55 ===");
        const menus = await pool.query(`SELECT * FROM outlet_menus WHERE user_id = 55 OR outlet_id = 55`);
        console.table(menus.rows);

        console.log("=== CHECK ITEM COUNTS BY MENU ID ===");
        const counts = await pool.query(`
            SELECT menu_id, COUNT(*) as count 
            FROM outlet_menu_items 
            GROUP BY menu_id
        `);
        console.table(counts.rows);

        console.log("=== CHECK SAMPLE ITEMS IN ALL MENUS ===");
        const sample = await pool.query(`
            SELECT omi.id, omi.menu_id, omi.item_name, m.menu_name, m.is_pos_default, m.is_digital 
            FROM outlet_menu_items omi
            JOIN outlet_menus m ON omi.menu_id = m.id
            LIMIT 20
        `);
        console.table(sample.rows);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDigiMenuItems();
