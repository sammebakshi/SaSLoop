const pool = require('../db');
const whatsappManager = require('../whatsappManager');

async function runTest() {
  try {
    // 1. Temporarily ensure the restaurant is OPEN by setting openingTime = '12:00 AM' and closingTime = '11:59 PM'
    // Let's check current settings first
    const res = await pool.query("SELECT settings FROM restaurants WHERE user_id = 48");
    const originalSettings = res.rows[0].settings;
    
    const testSettings = {
      ...originalSettings,
      openingTime: '12:00 AM',
      closingTime: '11:59 PM'
    };
    
    console.log("Temporarily setting restaurant to OPEN status...");
    await pool.query("UPDATE restaurants SET settings = $1 WHERE user_id = 48", [testSettings]);

    console.log("Calling processAiAutomations for new number +919469697216 with message 'Hi'...");
    // This will route to New Customer block and send the updated buttons
    await whatsappManager.processAiAutomations(48, "+919469697216", "Hi", "Azhar");
    console.log("Done calling processAiAutomations!");

    // Restore original settings
    console.log("Restoring original restaurant settings...");
    await pool.query("UPDATE restaurants SET settings = $1 WHERE user_id = 48", [originalSettings]);

  } catch (err) {
    console.error("Test execution failed:", err.message);
  } finally {
    await pool.end();
  }
}

runTest();
