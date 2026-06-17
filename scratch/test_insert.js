const pool = require('../db');
const bcrypt = require('bcrypt');

async function testInsert() {
    const username = 'test_' + Date.now();
    const password = 'password123';
    const name = 'Test User';
    const phone = '9999999999';
    const email = 'test' + Date.now() + '@example.com';
    const role = 'staff';
    const parentId = 8; // Assumed brand owner
    const designation_id = null;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO app_users 
             (username, password, name, phone, email, role, parent_user_id, status, 
              designation_id, user_type, access_code, mac_address, shift_time, 
              language_preference, sub_locality, city, address, web_access) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
            [
                username, hashedPassword, name, phone, email, role, parentId, designation_id, 
                null, null, null, null, 'en', null, null, null, false
            ]
        );
        console.log("Insert Success:", result.rows[0].id);
        process.exit(0);
    } catch (err) {
        console.error("Insert Failed:", err);
        process.exit(1);
    }
}

testInsert();
