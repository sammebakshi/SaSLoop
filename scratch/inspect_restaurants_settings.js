const pool = require("../db");

async function inspectSettings() {
  try {
    const userRes = await pool.query(
      "SELECT id, username FROM app_users WHERE username ILIKE '%tehzeeb%'"
    );
    const userIds = userRes.rows.map(r => r.id);
    if (userIds.length === 0) {
      console.log("No Tehzeeb users found.");
      return;
    }
    console.log("Tehzeeb User IDs:", userIds);
    const res = await pool.query(
      "SELECT user_id, settings FROM restaurants WHERE user_id = ANY($1)",
      [userIds]
    );
    res.rows.forEach(row => {
      console.log(`\nUser ID: ${row.user_id}`);
      console.log("Settings keys:", Object.keys(row.settings || {}));
      if (row.settings) {
        // print keys starting with active_pos_state
        const posKeys = Object.keys(row.settings).filter(k => k.startsWith("active_pos_state"));
        console.log("POS state keys:", posKeys);
        posKeys.forEach(k => {
          const val = row.settings[k] || {};
          console.log(` - Key: ${k}`);
          console.log(`   Tables:`, (val.tables || []).map(t => t.table_name));
          console.log(`   Table Bills Keys:`, Object.keys(val.tableBills || {}));
        });
      }
    });
  } catch (err) {
    console.error("Error inspecting:", err);
  } finally {
    pool.end();
  }
}

inspectSettings();
