const pool = require('../db');

async function run() {
    try {
        const res = await pool.query(`
            UPDATE business_items bi
            SET sale_price_2 = omi.sale_price_2,
                sale_price_3 = omi.sale_price_3
            FROM outlet_menu_items omi
            WHERE omi.item_id = bi.id
        `);
        console.log("Migration completed: updated rows in business_items:", res.rowCount);
    } catch (e) {
        console.error("Migration error:", e);
    } finally {
        pool.end();
    }
}
run();
