const pool = require("./db");
const bcrypt = require("bcrypt");

async function registerBusiness() {
    try {
        console.log("🔗 LINKING YOUR BUSINESS TO THE CLOUD...");

        // 1. Check if user already exists
        const check = await pool.query("SELECT * FROM app_users WHERE email = 'admin@sasloop.com'");
        
        const name = "SaSLoop Admin";
        const email = "admin@sasloop.com";
        const password = await bcrypt.hash("admin123", 10);
        
        // THE FINAL PERMANENT META DATA
        const meta_token = "EAF38a6uQtH0BRPQkE0FggXUWFrW3MBSqUlEsg5DOIafmwWv6rO0TNXrtDszdxgf2XZAIX9US0KZAIvTaNVzDHX7hCVLLZBtKSMT22WVpeeW4PazFI4wjDqZCT4RxOCtd2GrVqIIv9N3ZCLDYAntaZC3FTRgoPVHI8ZA2kLatWPtO4bdD8zw06h5WHel3Q0RQky0owZDZD";
        const phone_id = "1081456295056156";
        const account_id = "1116613731527246";
        const bizName = "Shahe Tehzeeb Restaurant";

        if (check.rows.length === 0) {
            await pool.query(
                "INSERT INTO app_users (name, email, password, meta_access_token, meta_phone_id, meta_account_id, business_name) VALUES ($1, $2, $3, $4, $5, $6, $7)",
                [name, email, password, meta_token, phone_id, account_id, bizName]
            );
            console.log("✅ BUSINESS REGISTERED SUCCESSFULLY!");
        } else {
            // 2. Link Meta Credentials
            await pool.query(
                "UPDATE app_users SET meta_access_token = $1, meta_phone_id = $2, meta_account_id = $3, business_name = $5 WHERE email = $4",
                [meta_token, phone_id, account_id, email, bizName]
            );

            // 3. Create/Update Restaurant Profile
            await pool.query(
                "INSERT INTO restaurants (user_id, name, address, contact_number) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id) DO UPDATE SET name = $2, address = $3, contact_number = $4",
                [check.rows[0].id, "Shahe Tehzeeb Restaurant", "Kashmir, India", "919906123989"]
            );

            // 4. Seed Sample Menu for Testing
            await pool.query(`
                INSERT INTO business_items (user_id, product_name, category, price, availability)
                VALUES 
                ($1, 'Rista', 'Main Course', 140.00, true),
                ($1, 'Gostaba', 'Main Course', 160.00, true),
                ($1, 'Mutton Kanti', 'Starter', 200.00, true)
                ON CONFLICT DO NOTHING`, [check.rows[0].id]);

            console.log("✅ BUSINESS, RESTAURANT AND MENU UPDATED SUCCESSFULLY!");
        }

    } catch (err) {
        console.error("❌ LINKING ERROR:", err);
    }
}

registerBusiness();
