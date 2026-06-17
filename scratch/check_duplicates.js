const pool = require('../db');

async function checkDuplicates() {
    try {
        const res = await pool.query(
            "SELECT id, product_name, price, category, image_url, availability, user_id FROM business_items WHERE product_name IN ('AAB GHOST', 'BREAD OMELETTE') ORDER BY product_name, id"
        );
        console.log("AAB GHOST and BREAD OMELETTE rows:");
        console.table(res.rows);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkDuplicates();
