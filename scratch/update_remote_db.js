const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "sasloop_db",
  password: "Admin@123",
  port: 5432,
});

async function main() {
  try {
    console.log("⚡ Starting production DB setup for User 2...");
    
    // 1. Update app_users credentials for User 2 (shahetehzeeb)
    const updateRes = await pool.query(
      `UPDATE app_users 
       SET meta_access_token = $1, 
           meta_phone_id = $2, 
           meta_account_id = $3 
       WHERE id = 2`,
      [
        "EAF38a6uQtH0BRPQkE0FggXUWFrW3MBSqUlEsg5DOIafmwWv6rO0TNXrtDszdxgf2XZAIX9US0KZAIvTaNVzDHX7hCVLLZBtKSMT22WVpeeW4PazFI4wjDqZCT4RxOCtd2GrVqIIv9N3ZCLDYAntaZC3FTRgoPVHI8ZA2kLatWPtO4bdD8zw06h5WHel3Q0RQky0owZDZD",
        "1081456295056156",
        "1116613731527246"
      ]
    );
    console.log("✅ Updated User 2 credentials:", updateRes.rowCount);

    // 2. Insert restaurant profile for User 2
    const restRes = await pool.query(
      `INSERT INTO restaurants (user_id, name, address, phone, contact_number, settings, loyalty_enabled)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id) DO UPDATE 
       SET name = EXCLUDED.name, address = EXCLUDED.address, phone = EXCLUDED.phone
       RETURNING id`,
      [
        2,
        "Shahe Tehzeeb Restaurant",
        "Kashmir, India",
        "9906123989",
        "9906123989",
        JSON.stringify({}),
        true
      ]
    );
    console.log("✅ Restaurant profile created/updated. ID:", restRes.rows[0]?.id);

  } catch (err) {
    console.error("❌ Setup failed:", err);
  } finally {
    await pool.end();
  }
}

main();
