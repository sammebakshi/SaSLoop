const pool = require('../db');

async function inspectMuttonKanti() {
    try {
        console.log("=== OUTLET MENU ITEMS (Mutton Kanti) ===");
        const omiRes = await pool.query(
            `SELECT id, item_id, item_name, base_price, image_url, menu_id 
             FROM outlet_menu_items 
             WHERE item_name ILIKE '%Mutton Kanti%'`
        );
        console.table(omiRes.rows);

        console.log("\n=== BUSINESS ITEMS (Mutton Kanti) ===");
        const biRes = await pool.query(
            `SELECT id, product_name, price, image_url, availability 
             FROM business_items 
             WHERE product_name ILIKE '%Mutton Kanti%'`
        );
        console.table(biRes.rows);

        console.log("\n=== OPTIONS LIST (Mutton Kanti options) ===");
        const optRes = await pool.query(
            `SELECT id, group_id, name, price_override, image_url 
             FROM options_list 
             WHERE name ILIKE '%Half%' OR name ILIKE '%Full%' OR name ILIKE '%Mutton Kanti%'`
        );
        console.table(optRes.rows.slice(0, 15));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

inspectMuttonKanti();
