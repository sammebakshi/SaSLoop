const pool = require("./db");

async function createTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS business_items (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                code TEXT,
                product_name TEXT NOT NULL,
                category TEXT,
                sub_category TEXT,
                price NUMERIC(10, 2),
                availability BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Table 'business_items' created successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error creating table:", err);
        process.exit(1);
    }
}

createTable();
