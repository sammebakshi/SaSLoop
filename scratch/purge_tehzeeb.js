const pool = require("../db");

async function purge() {
    try {
        console.log("🔥 PURGING LEGACY 'TEHZEEB' DATA...");
        
        const res = await pool.query("DELETE FROM app_users WHERE email ILIKE '%tehzeeb%' OR business_name ILIKE '%tehzeeb%' OR name ILIKE '%tehzeeb%' RETURNING id, email, business_name");
        console.log("DELETED USERS:", res.rows);

        const res2 = await pool.query("DELETE FROM restaurants WHERE name ILIKE '%tehzeeb%' RETURNING id, name");
        console.log("DELETED RESTAURANTS:", res2.rows);

        console.log("✅ DATA PURGED.");

    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

purge();
