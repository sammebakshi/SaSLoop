const pool = require('../db');

async function testMenuFilterFix() {
    try {
        console.log("=== TEST 1: menu_id = 'digital_only' ===");
        const qDigital = await pool.query(`
            SELECT omi.id, omi.short_code, omi.item_name, m.menu_name, m.is_digital, m.is_pos_default
            FROM outlet_menu_items omi
            JOIN outlet_menus m ON omi.menu_id = m.id
            WHERE (m.outlet_id = 55 OR m.user_id = 55)
              AND (m.is_digital = true OR m.is_digital_default = true OR LOWER(m.menu_name) LIKE '%digi%')
            ORDER BY omi.id ASC
        `);
        console.log(`Digital Menu items count: ${qDigital.rows.length}`);
        console.table(qDigital.rows.slice(0, 10));

        console.log("=== TEST 2: menu_id = 'pos_only' ===");
        const qPos = await pool.query(`
            SELECT omi.id, omi.short_code, omi.item_name, m.menu_name, m.is_digital, m.is_pos_default
            FROM outlet_menu_items omi
            JOIN outlet_menus m ON omi.menu_id = m.id
            WHERE (m.outlet_id = 55 OR m.user_id = 55)
              AND (m.is_pos_default = true OR LOWER(m.menu_name) LIKE '%pos%')
            ORDER BY omi.id ASC
        `);
        console.log(`POS Menu items count: ${qPos.rows.length}`);
        console.table(qPos.rows.slice(0, 10));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testMenuFilterFix();
