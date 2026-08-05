const pool = require('../db');

async function updateMetaCreds() {
    try {
        const token = "EAF38a6uQtH0BRPQkE0FggXUMFrW3MBSqUlEsg5DDIAfmwVu6rO8TNXrtDszdxgf2XZAIX9US0KZAIVTaNVzDHX7hCVLLZBtKSMT22MVpeew4PazFI4wjDqZCT4RxOCtd2GrVqIIv9N3ZCLDYAntaZC3FTRgoPVHI8ZA2kLmWptO4bdD8zwO6h5WHe13O0RQky0owZDZD";
        const phoneId = "1001456295056156";
        const wabaId = "1116613731527246";

        const res = await pool.query(
            "UPDATE app_users SET meta_access_token = $1, meta_phone_id = $2, meta_account_id = $3",
            [token, phoneId, wabaId]
        );

        console.log(`✅ Success! Updated ${res.rowCount} users in app_users database table.`);
        process.exit(0);
    } catch (err) {
        console.error("❌ SQL Error:", err);
        process.exit(1);
    }
}

updateMetaCreds();
