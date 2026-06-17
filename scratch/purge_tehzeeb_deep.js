const pool = require("../db");

async function purge() {
    try {
        console.log("🔥 DEEP PURGING LEGACY 'TEHZEEB' DATA...");
        
        // 1. Get the IDs
        const idsRes = await pool.query("SELECT id FROM app_users WHERE email ILIKE '%tehzeeb%' OR business_name ILIKE '%tehzeeb%' OR name ILIKE '%tehzeeb%'");
        const ids = idsRes.rows.map(r => r.id);

        if (ids.length === 0) {
            console.log("No legacy users found.");
            return;
        }

        console.log(`Found IDs to purge: ${ids.join(", ")}`);

        // 2. Delete from related tables
        const tables = [
            "audit_logs", "orders", "conversation_sessions", "customer_loyalty", 
            "chat_messages", "marketing_contacts", "customer_feedback", 
            "system_notifications", "recharge_requests", "pos_tables", 
            "inventory_logs", "vendors", "restaurants", "business_items",
            "delivery_partners"
        ];

        for (const table of tables) {
            try {
                // Some tables use user_id, some use biz_id
                const col = (table === 'inventory_raw' || table === 'inventory_logs' || table === 'vendors') ? 'biz_id' : 'user_id';
                const delRes = await pool.query(`DELETE FROM ${table} WHERE ${col} = ANY($1)`, [ids]);
                console.log(`Deleted ${delRes.rowCount} rows from ${table}`);
            } catch (e) {
                console.warn(`Could not delete from ${table}: ${e.message}`);
            }
        }

        // Special case for recipes (they reference business_items)
        // Since I already deleted from business_items, if it had CASCADE it would be fine.
        // But let's be safe.

        // 3. Delete from app_users
        const finalRes = await pool.query("DELETE FROM app_users WHERE id = ANY($1) RETURNING email", [ids]);
        console.log("DELETED USERS:", finalRes.rows.map(r => r.email));

        console.log("✅ DEEP PURGE COMPLETE.");

    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

purge();
