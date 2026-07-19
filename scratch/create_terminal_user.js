const pool = require("../db");
const bcrypt = require("bcryptjs");

async function createTerminalUser() {
    try {
        const username = "terminal1";
        const password = "terminal123";
        const pin = "1234";
        const name = "Terminal User";
        const role = "terminal";
        const parentId = 55; // Shahe Tehzeeb brand account
        const status = "active";
        
        console.log(`Checking if username "${username}" already exists...`);
        const checkRes = await pool.query("SELECT id FROM app_users WHERE username = $1", [username]);
        
        if (checkRes.rows.length > 0) {
            console.log(`User "${username}" already exists with ID: ${checkRes.rows[0].id}. Updating PIN to "${pin}" and role to "${role}"...`);
            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.query(
                "UPDATE app_users SET role = $1, pos_pin = $2, password = $3, status = $4, parent_user_id = $5 WHERE username = $6",
                [role, pin, hashedPassword, status, parentId, username]
            );
            console.log("User updated successfully!");
        } else {
            console.log(`Creating new user "${username}"...`);
            const hashedPassword = await bcrypt.hash(password, 10);
            const permissions = { 
                basic_pos_access: true,
                can_void_order: true, 
                can_view_reports: true, 
                can_manage_inventory: true, 
                can_edit_prices: true 
            };
            
            const insertRes = await pool.query(
                `INSERT INTO app_users 
                (name, username, password, role, parent_user_id, staff_permissions, pos_pin, status) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
                [name, username, hashedPassword, role, parentId, JSON.stringify(permissions), pin, status]
            );
            console.log(`User created successfully with ID: ${insertRes.rows[0].id}`);
        }
        
        console.log("\n--- LOGIN CREDENTIALS FOR SaSLoop POS TERMINAL ---");
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        console.log(`PIN / Code: ${pin}`);
        console.log(`Role: ${role}`);
        console.log("--------------------------------------------------\n");
    } catch (err) {
        console.error("Error creating user:", err.message);
    } finally {
        await pool.end();
    }
}

createTerminalUser();
