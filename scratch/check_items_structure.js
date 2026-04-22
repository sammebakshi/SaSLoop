const pool = require("../db");
async function check() {
    try {
        const res = await pool.query("SELECT product_name, category, sub_category FROM business_items LIMIT 20");
        console.table(res.rows);
    } catch (e) { console.error(e); }
    finally { process.exit(); }
}
check();
