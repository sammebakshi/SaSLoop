const pool = require('../db');
async function run() {
    try {
        console.log("Standardizing deletion policy for audit logs...");
        await pool.query(`
            ALTER TABLE audit_logs 
            DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey,
            ADD CONSTRAINT audit_logs_user_id_fkey 
            FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE;
        `);
        console.log("✅ Success: Audit logs will now be automatically cleaned up when a user is deleted.");
    } catch (e) {
        console.error("❌ Failed to update constraint:", e.message);
    } finally {
        process.exit();
    }
}
run();
