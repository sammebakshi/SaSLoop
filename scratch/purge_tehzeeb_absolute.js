const pool = require("../db");

async function purge() {
    try {
        console.log("🔥 ABSOLUTE PURGE OF LEGACY 'TEHZEEB' DATA...");
        
        // 1. Get the IDs
        const idsRes = await pool.query("SELECT id FROM app_users WHERE email ILIKE '%tehzeeb%' OR business_name ILIKE '%tehzeeb%' OR name ILIKE '%tehzeeb%'");
        const ids = idsRes.rows.map(r => r.id);

        if (ids.length === 0) {
            console.log("No legacy users found.");
            return;
        }

        console.log(`Found IDs to purge: ${ids.join(", ")}`);

        // 2. Get ALL tables
        const tablesRes = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        `);
        const tables = tablesRes.rows.map(r => r.table_name).filter(t => t !== 'app_users');

        for (const table of tables) {
            try {
                // Check if table has user_id or biz_id or owner_id
                const colRes = await pool.query(`
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name = $1 AND column_name IN ('user_id', 'biz_id', 'owner_id', 'parent_user_id')
                `, [table]);
                
                if (colRes.rows.length > 0) {
                    for (const col of colRes.rows) {
                        const delRes = await pool.query(`DELETE FROM ${table} WHERE ${col.column_name} = ANY($1)`, [ids]);
                        if (delRes.rowCount > 0) {
                            console.log(`Deleted ${delRes.rowCount} rows from ${table} using ${col.column_name}`);
                        }
                    }
                }
            } catch (e) {
                // console.warn(`Could not delete from ${table}: ${e.message}`);
            }
        }

        // 3. Delete from app_users
        const finalRes = await pool.query("DELETE FROM app_users WHERE id = ANY($1) RETURNING email", [ids]);
        console.log("DELETED USERS:", finalRes.rows.map(r => r.email));

        console.log("✅ ABSOLUTE PURGE COMPLETE.");

    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

purge();
