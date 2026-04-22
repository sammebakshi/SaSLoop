const pool = require("./db");

async function applyLoyaltyOtpSchema() {
  console.log("Checking for 'loyalty_otps' table...");
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS loyalty_otps (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        customer_number TEXT NOT NULL,
        otp_code VARCHAR(10) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_loyalty_otps_expiry ON loyalty_otps(expires_at);
      CREATE INDEX IF NOT EXISTS idx_loyalty_otps_phone ON loyalty_otps(customer_number);
    `);
    console.log("✅ 'loyalty_otps' table is ready.");
  } catch (err) {
    console.error("❌ Error applying schema:", err.message);
  } finally {
    process.exit();
  }
}

applyLoyaltyOtpSchema();
