const pool = require('./db');
async function checkSchema() {
    const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'orders'");
    console.log(res.rows.map(r => `${r.column_name} (${r.data_type})`).join(', '));
    process.exit();
}
checkSchema();
