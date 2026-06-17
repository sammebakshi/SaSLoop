const pool = require("../db");

async function check() {
    try {
        const result = await pool.query(
            `SELECT og.id, og.name, og.min_selectable, og.max_selectable, iog.item_id
             FROM option_groups og
             JOIN item_option_groups iog ON og.id = iog.group_id
             WHERE og.user_id = $1`,
            [12]
        );
        console.log("Option groups found:", result.rows.length);
        if (result.rows.length > 0) {
            console.log("Sample group:", result.rows[0]);
        }
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

check();
