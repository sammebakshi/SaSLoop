const pool = require('../db');

async function findPrices() {
    try {
        const res = await pool.query(`
            SELECT omi.id, omi.menu_id, om.menu_name, om.user_id, omi.item_name, omi.base_price, omi.item_type
            FROM outlet_menu_items omi
            JOIN outlet_menus om ON omi.menu_id = om.id
            WHERE omi.item_name IN ('SMALL', 'MEDIUM', 'LARGE', 'FULL', 'HALF')
               OR omi.base_price IN ('180.00', '350.00', '900.00', '180', '350', '900')
            ORDER BY omi.id ASC
        `);
        console.table(res.rows);
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
findPrices();
