const pool = require('./db');

async function migrate() {
    try {
        await pool.query('ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS kitchen_number TEXT');
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS marketing_contacts (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id),
                phone_number TEXT,
                name TEXT,
                tags TEXT DEFAULT 'customer',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, phone_number)
            )
        `);

        await pool.query('ALTER TABLE app_users ADD COLUMN IF NOT EXISTS payment_info JSONB');
        
        console.log('✅ Migration successful');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
}

migrate();
