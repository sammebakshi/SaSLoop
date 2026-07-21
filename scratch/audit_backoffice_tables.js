const pool = require('../db');

async function main() {
    try {
        const tablesRes = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);
        console.log("=== ALL BACKOFFICE DB TABLES ===");
        const tables = tablesRes.rows.map(r => r.table_name);
        console.log(tables);

        console.log("\n=== ROW COUNTS PER TABLE ===");
        for (const t of tables) {
            try {
                const countRes = await pool.query(`SELECT COUNT(*) FROM "${t}"`);
                console.log(`${t}: ${countRes.rows[0].count} rows`);
            } catch (e) {
                console.log(`${t}: Error (${e.message})`);
            }
        }
    } catch (e) {
        console.error("Audit error:", e);
    } finally {
        process.exit(0);
    }
}
main();
