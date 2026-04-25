const pool = require("../db");

async function checkBiz() {
    try {
        const res = await pool.query("SELECT id, user_id, name, settings, bot_knowledge FROM restaurants LIMIT 5");
        console.log("RESTAURANTS DATA:");
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

checkBiz();
