const pool = require("../db");

async function check() {
    try {
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'marketing_contacts';
        `);
        console.log("Columns in marketing_contacts:", res.rows);
        
        const res2 = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'customer_loyalty';
        `);
        console.log("Columns in customer_loyalty:", res2.rows);

    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}
check();
