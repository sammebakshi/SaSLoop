const pool = require("./db");

async function check() {
    try {
        const res = await pool.query("SELECT id, product_name, description, image_url FROM business_items LIMIT 10");
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

check();
