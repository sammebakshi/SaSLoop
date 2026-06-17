const pool = require("../db");

async function check() {
  try {
    const res = await pool.query("SELECT id, bill_no, status, source, device_id, created_at FROM orders ORDER BY created_at DESC LIMIT 10");
    console.log("=== RECENT ORDERS ===");
    console.log(res.rows);
    
    const distinctRes = await pool.query("SELECT DISTINCT device_id FROM orders");
    console.log("=== DISTINCT DEVICE_IDs ===");
    console.log(distinctRes.rows);
    
    // Also print active state keys
    const restRes = await pool.query("SELECT settings FROM restaurants WHERE settings IS NOT NULL LIMIT 5");
    console.log("=== RESTAURANTS SETTINGS KEYS ===");
    restRes.rows.forEach((r, idx) => {
        console.log(`Row ${idx}:`, Object.keys(r.settings).filter(k => k.startsWith('active_pos_state')));
    });
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
