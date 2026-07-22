const pool = require('../db');

async function listAllItemImages() {
    try {
        console.log("=== ALL OUTLET MENU ITEMS WITH IMAGES ===");
        const omi = await pool.query(`
            SELECT omi.id, omi.item_name, omi.short_code, omi.base_price, omi.image_url, m.menu_name
            FROM outlet_menu_items omi
            JOIN outlet_menus m ON omi.menu_id = m.id
            ORDER BY omi.id DESC
            LIMIT 40
        `);
        console.table(omi.rows);

        console.log("\n=== ALL BUSINESS ITEMS WITH IMAGES ===");
        const bi = await pool.query(`
            SELECT id, product_name, code, price, image_url
            FROM business_items
            ORDER BY id DESC
            LIMIT 40
        `);
        console.table(bi.rows);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listAllItemImages();
