const pool = require("../db");
const bcrypt = require("bcrypt");

async function simulateLogin() {
    try {
        const username = "nasirpos";
        const password = "1234";

        const result = await pool.query(
            "SELECT id, email, role, password as hashed_password, pos_pin, parent_user_id, name, business_name, status FROM app_users WHERE username = $1 OR email = $1",
            [username]
        );

        if (result.rows.length === 0) {
            console.log("SIMULATION RESULT: User not found");
            return;
        }

        const user = result.rows[0];
        console.log("User Row:", { ...user, hashed_password: "[hidden]" });

        if (user.status !== 'active') {
            console.log("SIMULATION RESULT: Account is inactive");
            return;
        }

        const backofficeRoles = ['user', 'brand_owner', 'master_admin'];
        if (backofficeRoles.includes(user.role) || (user.role && user.role.startsWith('admin'))) {
            console.log("SIMULATION RESULT: Access denied. Backoffice accounts cannot access the POS.");
            return;
        }

        let isMatch = false;
        if (user.pos_pin && password === user.pos_pin) {
            console.log("SIMULATION RESULT: PIN matched literal");
            isMatch = true;
        } else {
            console.log("SIMULATION RESULT: Falling back to main password bcrypt compare...");
            isMatch = await bcrypt.compare(password, user.hashed_password);
            console.log("SIMULATION RESULT: bcrypt match result:", isMatch);
        }

        if (!isMatch) {
            console.log("SIMULATION RESULT: Invalid PIN or Password");
            return;
        }

        console.log("SIMULATION RESULT: Success!");
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

simulateLogin();
