const pool = require('../db');

async function verifyQueryLogic() {
    try {
        console.log("=== VERIFYING QUERY FOR menu_id = 34 ===");
        const q34 = await pool.query(`
            SELECT omi.id, omi.short_code, omi.item_name, m.menu_name 
            FROM outlet_menu_items omi
            JOIN outlet_menus m ON omi.menu_id = m.id
            WHERE ($1::boolean = true OR m.outlet_id = $2 OR m.user_id = $2) AND m.id = $3
            ORDER BY m.is_pos_default DESC, omi.id ASC
        `, [false, 55, 34]);
        console.log(`Menu 34 (POS Default) returned: ${q34.rows.length} items`);
        console.log("First item:", q34.rows[0]);

        console.log("=== VERIFYING QUERY FOR menu_id = 35 ===");
        const q35 = await pool.query(`
            SELECT omi.id, omi.short_code, omi.item_name, m.menu_name 
            FROM outlet_menu_items omi
            JOIN outlet_menus m ON omi.menu_id = m.id
            WHERE ($1::boolean = true OR m.outlet_id = $2 OR m.user_id = $2) AND m.id = $3
            ORDER BY m.is_pos_default DESC, omi.id ASC
        `, [false, 55, 35]);
        console.log(`Menu 35 (DIGI MENU) returned: ${q35.rows.length} items`);
        console.log("First item:", q35.rows[0]);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

verifyQueryLogic();
