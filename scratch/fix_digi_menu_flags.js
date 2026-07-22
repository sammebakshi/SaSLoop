const pool = require('../db');

async function fixDigiMenuFlags() {
    try {
        console.log("=== UPDATING OUTLET MENUS DIGITAL FLAGS ===");
        await pool.query(`
            UPDATE outlet_menus 
            SET is_digital = true, is_digital_default = true 
            WHERE UPPER(menu_name) LIKE '%DIGI%' OR UPPER(menu_name) LIKE '%DIGITAL%'
        `);
        
        const res = await pool.query(`SELECT id, menu_name, is_pos_default, is_digital, is_digital_default FROM outlet_menus`);
        console.table(res.rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixDigiMenuFlags();
