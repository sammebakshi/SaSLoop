const pool = require("../db");

async function checkCreds() {
  try {
    const res = await pool.query(
      "SELECT id, username, email, phone, role, meta_phone_id, meta_access_token FROM app_users WHERE meta_phone_id IS NOT NULL OR role = 'admin'"
    );
    console.log("=== REGISTERED WHATSAPP CREDENTIALS ===");
    res.rows.forEach(row => {
      const tokenPreview = row.meta_access_token 
        ? `${row.meta_access_token.substring(0, 15)}...${row.meta_access_token.substring(row.meta_access_token.length - 15)}`
        : "None";
      console.log(`User ID: ${row.id}`);
      console.log(`Username: ${row.username}`);
      console.log(`Email: ${row.email}`);
      console.log(`Phone: ${row.phone}`);
      console.log(`Role: ${row.role}`);
      console.log(`Meta Phone ID: ${row.meta_phone_id || "None"}`);
      console.log(`Meta Token: ${tokenPreview}`);
      console.log("---------------------------------------");
    });
  } catch (err) {
    console.error("Error querying credentials:", err.message);
  } finally {
    await pool.end();
  }
}

checkCreds();
