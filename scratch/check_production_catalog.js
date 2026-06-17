const pool = require('../db');

async function run() {
    try {
        const res = await pool.query(`
            SELECT id, product_name, price, sale_price_2, sale_price_3 
            FROM business_items 
            WHERE sale_price_2 IS NOT NULL OR sale_price_3 IS NOT NULL
            LIMIT 5
        `);
        console.log("Items with multiple pricing on remote database:");
        console.log(res.rows);
    } catch (e) {
        console.error("Error:", e);
    } finally {
        pool.end();
    }
}
run();
