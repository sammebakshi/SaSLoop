const pool = require('../db');

async function checkNonNullImages() {
    try {
        const omi = await pool.query(`SELECT id, item_name, image_url, menu_id FROM outlet_menu_items WHERE image_url IS NOT NULL AND image_url != ''`);
        console.log(`Found ${omi.rows.length} outlet_menu_items with non-empty image_url:`);
        console.table(omi.rows);

        const bi = await pool.query(`SELECT id, product_name, image_url FROM business_items WHERE image_url IS NOT NULL AND image_url != ''`);
        console.log(`Found ${bi.rows.length} business_items with non-empty image_url:`);
        console.table(bi.rows);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkNonNullImages();
