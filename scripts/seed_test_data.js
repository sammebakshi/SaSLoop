const pool = require("./db");
const bcrypt = require("bcrypt");

async function seedData() {
    console.log("🚀 Seeding Enterprise Test Data...");
    try {
        const hashedPass = await bcrypt.hash("123456", 10);

        // 1. Create Master Admin (if not exists)
        await pool.query(`
            INSERT INTO app_users (username, first_name, email, password, role, status)
            VALUES ('masteradmin', 'Master', 'master@sasloop.com', $1, 'master_admin', 'active')
            ON CONFLICT (username) DO NOTHING
        `, [hashedPass]);

        // 2. Create a Brand Owner (The Admin)
        const brandOwnerRes = await pool.query(`
            INSERT INTO app_users (username, first_name, brand_name, email, password, role, status)
            VALUES ('brand_owner_test', 'Sajad', 'SaSLoop Global', 'owner@sasloop.com', $1, 'brand_owner', 'active')
            RETURNING id
        `, [hashedPass]);
        const ownerId = brandOwnerRes.rows[0].id;

        // 3. Create Linked Outlets
        await pool.query(`
            INSERT INTO app_users (username, first_name, business_name, brand_name, email, password, role, status, owner_id)
            VALUES 
            ('outlet_ny', 'Manager NY', 'SaSLoop - New York', 'SaSLoop Global', 'ny@sasloop.com', $1, 'user', 'active', $2),
            ('outlet_dubai', 'Manager Dubai', 'SaSLoop - Dubai', 'SaSLoop Global', 'dubai@sasloop.com', $1, 'user', 'active', $2)
        `, [hashedPass, ownerId]);

        // 4. Create Individual Brands (Standalone)
        await pool.query(`
            INSERT INTO app_users (username, first_name, business_name, brand_name, email, password, role, status)
            VALUES 
            ('standalone_burger', 'Joe', 'Joe Burger Standalone', 'Joe Burger', 'joe@burger.com', $1, 'user', 'active')
        `, [hashedPass]);

        // 5. Create a "Sold" Outlet (Initially linked, then we can check unlinking)
        await pool.query(`
            INSERT INTO app_users (username, first_name, business_name, brand_name, email, password, role, status, owner_id)
            VALUES ('sold_cafe', 'Cafe Manager', 'Old Cafe (To Be Sold)', 'SaSLoop Global', 'sold@sasloop.com', $1, 'user', 'active', $2)
        `, [hashedPass, ownerId]);

        console.log("✅ Seed Data Injected Successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding Failed:", err);
        process.exit(1);
    }
}

seedData();
