const pool = require('../db');

async function testParamBug() {
    try {
        console.log("=== TEST MENU ID 34 (pos menu) ===");
        const q34 = await pool.query(`
            SELECT omi.id, omi.short_code, omi.item_name, m.menu_name 
            FROM outlet_menu_items omi
            JOIN outlet_menus m ON omi.menu_id = m.id
            WHERE (m.outlet_id = $1 OR m.user_id = $1) AND m.id = $2
        `, [55, 34]);
        console.log(`Menu 34 count: ${q34.rows.length}`);

        console.log("=== TEST MENU ID 35 (DIGI MENU) ===");
        const q35 = await pool.query(`
            SELECT omi.id, omi.short_code, omi.item_name, m.menu_name 
            FROM outlet_menu_items omi
            JOIN outlet_menus m ON omi.menu_id = m.id
            WHERE (m.outlet_id = $1 OR m.user_id = $1) AND m.id = $2
        `, [55, 35]);
        console.log(`Menu 35 count: ${q35.rows.length}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testParamBug();
