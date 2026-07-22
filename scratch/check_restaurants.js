const pool = require('../db');

async function testRestaurantsTable() {
    try {
        console.log("=== RESTAURANTS TABLE IN DB ===");
        const res = await pool.query(`SELECT id, user_id, name, currency_code FROM restaurants`);
        console.table(res.rows);

        console.log("=== ORDERS TABLE COLUMNS AND CONSTRAINTS ===");
        const cols = await pool.query(`SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'orders'`);
        console.table(cols.rows);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testRestaurantsTable();
