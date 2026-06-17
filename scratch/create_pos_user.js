const pool = require('../db');
const bcrypt = require('bcrypt');

async function createStaff() {
    try {
        const password = '1234';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Clean up any existing shahetehzeebpos first
        await pool.query("DELETE FROM app_users WHERE username = 'shahetehzeebpos'");
        
        await pool.query(
            "INSERT INTO app_users (name, email, username, password, role, parent_user_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            ['Shahe Tehzeeb POS', 'sammebakshi@gmail.com', 'shahetehzeebpos', hashedPassword, 'staff', 55, 'active']
        );
        
        console.log("✅ shahetehzeebpos created successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error creating user:", err.message);
        process.exit(1);
    }
}

createStaff();
