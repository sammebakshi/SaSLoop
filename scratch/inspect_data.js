const pool = require("../db");

async function checkData() {
    try {
        console.log("=== BUSINESS ITEMS FOR KABAB, TABAK MAAZ, MEETHI ===");
        const res = await pool.query(
            "SELECT id, product_name, price, availability, code FROM business_items WHERE user_id = 48 AND (product_name = 'KABAB' OR product_name = 'TABAK MAAZ' OR product_name = 'MEETHI') ORDER BY product_name, id"
        );
        console.log(res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

checkData();
