const pool = require("../db");
async function checkAuditLogs() {
  try {
    const res = await pool.query("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 30");
    console.log("=== Recent Audit Logs ===");
    console.table(res.rows);
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}
checkAuditLogs();
