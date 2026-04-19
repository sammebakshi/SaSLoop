const pool = require("./db");

async function verifyDB() {
    try {
        console.log("🧐 VERIFYING CLOUD DATABASE STATE...");
        const res = await pool.query("SELECT id, name, email, meta_phone_id FROM app_users");
        
        if (res.rows.length === 0) {
            console.log("❌ DATABASE IS EMPTY! No businesses registered.");
        } else {
            console.log("✅ FOUND REGISTERED BUSINESSES:");
            res.rows.forEach(user => {
                console.log(`- User ID: ${user.id}, Name: ${user.name}, Phone ID: ${user.meta_phone_id}`);
            });
        }
    } catch (err) {
        console.error("❌ DB VERIFICATION ERROR:", err);
    }
}

verifyDB();
