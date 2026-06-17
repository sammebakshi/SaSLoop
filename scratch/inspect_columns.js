const pool = require('../db');

async function run() {
    try {
        const biCols = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'business_items' AND column_name IN ('sale_price_2', 'sale_price_3')
        `);
        console.log("business_items pricing columns:", biCols.rows.map(r => r.column_name));

        const omiCols = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'outlet_menu_items' AND column_name IN ('sale_price_2', 'sale_price_3')
        `);
        console.log("outlet_menu_items pricing columns:", omiCols.rows.map(r => r.column_name));
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
run();
