const pool = require("../db");

async function runTest() {
  try {
    // 1. Insert test user and restaurant if not exists
    await pool.query("INSERT INTO app_users (id, name, username, email, password, role) VALUES (999, 'Test User', 'testuser', 'test@example.com', 'pwd', 'user') ON CONFLICT DO NOTHING");
    await pool.query("INSERT INTO restaurants (user_id, name) VALUES (999, 'Test Restaurant') ON CONFLICT (user_id) DO NOTHING");

    const stateDev1 = { tableStatuses: { "1": "SAVED" } };
    const stateDev2 = { tableStatuses: { "1": "PRINTED" } };

    console.log("Saving state for DEV1...");
    await pool.query(
      `UPDATE restaurants 
       SET settings = jsonb_set(COALESCE(settings, '{}'::jsonb), ARRAY[$1], $2::jsonb) 
       WHERE user_id = 999`,
      ["active_pos_state_DEV1", JSON.stringify(stateDev1)]
    );

    console.log("Saving state for DEV2...");
    await pool.query(
      `UPDATE restaurants 
       SET settings = jsonb_set(COALESCE(settings, '{}'::jsonb), ARRAY[$1], $2::jsonb) 
       WHERE user_id = 999`,
      ["active_pos_state_DEV2", JSON.stringify(stateDev2)]
    );

    // Fetch and check
    const selectRes = await pool.query("SELECT settings FROM restaurants WHERE user_id = 999");
    const settings = selectRes.rows[0].settings;
    console.log("Settings keys in DB:", Object.keys(settings));
    console.log("active_pos_state_DEV1:", settings.active_pos_state_DEV1);
    console.log("active_pos_state_DEV2:", settings.active_pos_state_DEV2);
    
    // Clean up
    await pool.query("DELETE FROM restaurants WHERE user_id = 999");
    await pool.query("DELETE FROM app_users WHERE id = 999");
    console.log("Cleanup done!");
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await pool.end();
  }
}

runTest();
