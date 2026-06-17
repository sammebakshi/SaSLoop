const pool = require("../db");

async function search() {
    try {
        const res = await pool.query("SELECT * FROM app_users WHERE name ILIKE '%Shahe%' OR business_name ILIKE '%Shahe%' OR username ILIKE '%Shahe%' OR email ILIKE '%Shahe%'");
        console.log("MATCHES IN app_users:", res.rows);
        
        const res2 = await pool.query("SELECT * FROM restaurants WHERE business_type ILIKE '%Shahe%' OR location ILIKE '%Shahe%'");
        console.log("MATCHES IN restaurants:", res2.rows);
        
        // Let's check for any record at all in restaurants
        const res3 = await pool.query("SELECT * FROM restaurants LIMIT 5");
        console.log("SAMPLE RESTAURANTS:", res3.rows.map(r => ({id: r.id, brand_id: r.brand_id, outlet_code: r.outlet_code})));

    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

search();
