const pool = require("../db");

async function checkData() {
    try {
        const res = await pool.query("SELECT * FROM restaurants LIMIT 1");
        console.log("RESTAURANT COLUMNS:", Object.keys(res.rows[0] || {}));
        
        const res2 = await pool.query("SELECT * FROM app_users WHERE name ILIKE '%shahe tehzeeb%' OR business_name ILIKE '%shahe tehzeeb%';");
        console.log("SHAH TEHZEEB IN USERS:", res2.rows);
        
        // Let's search all tables for 'shahe tehzeeb'
        // Just kidding, that's too much. I'll search common ones.
        
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

checkData();
