const pool = require("../db");

async function check() {
    try {
        const posTables = await pool.query("SELECT * FROM pos_tables;");
        console.log("pos_tables rows:", posTables.rows);

        const tablesList = await pool.query("SELECT * FROM tables_list;");
        console.log("tables_list rows:", tablesList.rows);
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}
check();
