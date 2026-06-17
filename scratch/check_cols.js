const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db' });

async function run() {
    try {
        const mcCols = await pool.query(`
            SELECT column_name, data_type, is_nullable, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'marketing_contacts'
        `);
        console.log("marketing_contacts columns:");
        console.table(mcCols.rows);

        const custCols = await pool.query(`
            SELECT column_name, data_type, is_nullable, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'customers'
        `);
        console.log("customers columns:");
        console.table(custCols.rows);
    } catch(e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
run();
