const pool = require("../db");

async function checkSettings() {
  try {
    const result = await pool.query(
      "SELECT settings FROM restaurants WHERE user_id = 48"
    );
    if (result.rows.length === 0) {
      console.log("No restaurant found for user_id = 48");
      return;
    }
    const settings = result.rows[0].settings || {};
    console.log("Restaurant settings keys:", Object.keys(settings));
    console.log("Full settings:", JSON.stringify(settings, null, 2));
  } catch (err) {
    console.error("Error reading database:", err);
  } finally {
    await pool.end();
  }
}

checkSettings();
