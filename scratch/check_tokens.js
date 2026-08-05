const pool = require('./db');
require('dotenv').config();

async function check() {
    console.log("ENV TOKEN:", process.env.META_ACCESS_TOKEN ? process.env.META_ACCESS_TOKEN.substring(0, 25) + "..." : "NONE");
    console.log("ENV PHONE_ID:", process.env.META_PHONE_ID);
    try {
        const res = await pool.query("SELECT id, name, meta_phone_id, SUBSTRING(meta_access_token FROM 1 FOR 25) as tok FROM app_users");
        console.log("DB APP USERS:", res.rows);
    } catch(e) {
        console.error("DB ERR:", e.message);
    }
    process.exit(0);
}
check();
