const pool = require("../db");

async function inspect() {
    try {
        console.log("=== INSPECTING OUTLET DESIGNATIONS ===");
        const des = await pool.query("SELECT * FROM outlet_designations LIMIT 10");
        console.log(des.rows);

        console.log("=== INSPECTING TAX PRODUCT GROUPS ===");
        const tg = await pool.query("SELECT * FROM tax_product_groups LIMIT 10");
        console.log(tg.rows);

        console.log("=== INSPECTING KITCHEN DEPARTMENTS ===");
        const kd = await pool.query("SELECT * FROM kitchen_departments LIMIT 10");
        console.log(kd.rows);

        console.log("=== INSPECTING RESTAURANTS ===");
        const rest = await pool.query("SELECT id, user_id, name FROM restaurants LIMIT 10");
        console.log(rest.rows);

        console.log("=== INSPECTING APP USERS ===");
        const users = await pool.query("SELECT id, name, username, role, parent_user_id FROM app_users LIMIT 20");
        console.log(users.rows);
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

inspect();
