const pool = require("./db");

async function checkData() {
    try {
        const res = await pool.query(`
            SELECT id, user_id, name, delivery_tiers, fulfillment_options 
            FROM restaurants 
            ORDER BY created_at DESC 
            LIMIT 1;
        `);
        if (res.rows.length > 0) {
            const row = res.rows[0];
            console.log("Last updated restaurant:");
            console.log(`ID: ${row.id}`);
            console.log(`User ID: ${row.user_id}`);
            console.log(`Name: ${row.name}`);
            console.log(`Delivery Tiers Type: ${typeof row.delivery_tiers}`);
            console.log(`Delivery Tiers Content:`, row.delivery_tiers);
            console.log(`Fulfillment Options Type: ${typeof row.fulfillment_options}`);
            console.log(`Fulfillment Options Content:`, row.fulfillment_options);
        } else {
            console.log("No restaurants found.");
        }
    } catch (err) {
        console.error("Error checking data:", err);
    } finally {
        process.exit();
    }
}

checkData();
