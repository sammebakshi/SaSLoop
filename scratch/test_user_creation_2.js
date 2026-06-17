const pool = require("../db");
const bcrypt = require("bcrypt");

async function run() {
  const payload = {
    username: "testuser2",
    password: "password123",
    name: "Test User 2",
    phone: "", // empty
    email: "", // empty
    designation_id: null,
    user_type: "POS Billing",
    role: "staff",
    target_user_id: 12 // sold_cafe
  };

  const { 
    username, password, name, phone, email, designation_id, 
    user_type, access_code, mac_address, shift_time, language_preference, 
    sub_locality, city, address, web_access, role, target_user_id
  } = payload;
  
  const parentId = target_user_id;

  try {
    console.log("1. Running collision check...");
    const existing = await pool.query(
      "SELECT id, username, email, phone FROM app_users WHERE username = $1 OR email = $2 OR phone = $3",
      [username, email, phone]
    );

    if (existing.rows.length > 0) {
      console.log("Collision found in check:", existing.rows);
      // Let's print which matched
      existing.rows.forEach(row => {
        if (row.username === username) console.log("-> Username matches");
        if (row.email === email) console.log("-> Email matches");
        if (row.phone === phone) console.log("-> Phone matches");
      });
      process.exit(0);
    }

    console.log("2. Hashing password...");
    const hashedPassword = await bcrypt.hash(password || 'user123', 10);
    
    console.log("3. Inserting into app_users...");
    const result = await pool.query(
      `INSERT INTO app_users 
       (username, password, name, phone, email, role, parent_user_id, status, 
        designation_id, user_type, access_code, mac_address, shift_time, 
        language_preference, sub_locality, address, web_access) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
      [
        username, hashedPassword, name, phone, email, role || 'staff', parentId, designation_id || null, 
        user_type || null, access_code || null, mac_address || null, shift_time || null, 
        language_preference || 'en', sub_locality || null, address || null, 
        web_access || false
      ]
    );
    console.log("Insert success! Created user ID:", result.rows[0].id);
  } catch (err) {
    console.error("Error creating user:", err);
  } finally {
    await pool.end();
  }
}

run();
