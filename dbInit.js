const pool = require("./db");

async function initializeDatabase() {
    try {
        console.log("🐘 INITIALIZING DATABASE SCHEMA...");

        const queries = [
            // 1. Create app_users table (full schema)
            `CREATE TABLE IF NOT EXISTS app_users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                username VARCHAR(255) UNIQUE,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(100) DEFAULT 'user',
                status VARCHAR(50) DEFAULT 'active',
                phone VARCHAR(30) UNIQUE,
                address TEXT,
                parentage VARCHAR(255),
                dof DATE,
                business_name VARCHAR(255),
                business_type VARCHAR(255),
                gst_number VARCHAR(100),
                security_question TEXT,
                security_answer TEXT,
                meta_access_token TEXT,
                meta_phone_id VARCHAR(100),
                meta_account_id VARCHAR(100),
                bot_knowledge TEXT,
                whatsapp_number VARCHAR(20),
                broadcast_credits INTEGER DEFAULT 500,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

            // 2. Safety-net: add missing columns to app_users for existing databases
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS first_name VARCHAR(255)`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS last_name VARCHAR(255)`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS username VARCHAR(255)`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS role VARCHAR(100) DEFAULT 'user'`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active'`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS phone VARCHAR(30)`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS address TEXT`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS parentage VARCHAR(255)`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS dof DATE`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS business_type VARCHAR(255)`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS gst_number VARCHAR(100)`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS security_question TEXT`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS security_answer TEXT`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS broadcast_credits INTEGER DEFAULT 500`,

            // 2b. Phase 1: Role & Permission System columns
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS admin_permissions JSONB DEFAULT '{"can_create_accounts":false,"can_view_only":false,"can_manage_subscriptions":false,"full_access":false}'`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS created_by INTEGER`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS assigned_admin_id INTEGER`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR(50) DEFAULT 'free'`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS dob DATE`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS meta_access_token TEXT`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS meta_phone_id TEXT`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS meta_account_id TEXT`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS parent_user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS staff_permissions JSONB DEFAULT '{}'`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS pos_pin VARCHAR(10) DEFAULT NULL`,
            `ALTER TABLE app_users ADD CONSTRAINT app_users_username_key UNIQUE (username) ON CONFLICT DO NOTHING`,
            `ALTER TABLE app_users ADD CONSTRAINT app_users_phone_key UNIQUE (phone) ON CONFLICT DO NOTHING`,

            // 3. Create business_items table
            `CREATE TABLE IF NOT EXISTS business_items (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                code VARCHAR(100),
                product_name VARCHAR(255) NOT NULL,
                category VARCHAR(100),
                sub_category VARCHAR(100),
                price DECIMAL(10,2) NOT NULL,
                description TEXT,
                image_url TEXT,
                availability BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

            // 4. Create orders table
            `CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id),
                restaurant_id INTEGER,
                customer_name VARCHAR(255),
                customer_number VARCHAR(20),
                address TEXT,
                items JSONB NOT NULL,
                total_price DECIMAL(10,2) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

            // 5. Create restaurants table
            `CREATE TABLE IF NOT EXISTS restaurants (
                id SERIAL PRIMARY KEY,
                user_id INTEGER UNIQUE REFERENCES app_users(id),
                name VARCHAR(255),
                address TEXT,
                phone VARCHAR(30),
                contact_number VARCHAR(20),
                cuisine_type TEXT,
                business_type VARCHAR(100) DEFAULT 'Restaurant',
                settings JSONB DEFAULT '{}',
                opening_hours TEXT,
                delivery_available BOOLEAN DEFAULT true,
                min_order_value DECIMAL(10,2) DEFAULT 0.00,
                bot_status BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

            // 6. Safety-net: add missing columns to restaurants for existing databases
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS business_type VARCHAR(100) DEFAULT 'Restaurant'`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS address TEXT`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS phone VARCHAR(30)`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS bot_status_message TEXT`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS active_offer TEXT`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS currency_code VARCHAR(10) DEFAULT 'INR'`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS kitchen_number VARCHAR(20)`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS notification_numbers TEXT[]`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN DEFAULT false`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,6)`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS longitude DECIMAL(10,6)`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS delivery_radius_km DECIMAL(5,2)`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS cgst_percent DECIMAL(5,2) DEFAULT 0.00`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS sgst_percent DECIMAL(5,2) DEFAULT 0.00`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS gst_included BOOLEAN DEFAULT false`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS show_gst_on_receipt BOOLEAN DEFAULT false`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS logo_url TEXT`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS social_instagram VARCHAR(255)`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS social_facebook VARCHAR(255)`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS social_twitter VARCHAR(255)`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS social_youtube VARCHAR(255)`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS social_website VARCHAR(255)`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS banner_url TEXT`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS loyalty_enabled BOOLEAN DEFAULT true`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS points_per_100 INTEGER DEFAULT 5`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS points_to_amount_ratio DECIMAL(10,2) DEFAULT 10.00`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS min_redeem_points INTEGER DEFAULT 300`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS max_redeem_per_order INTEGER DEFAULT 300`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS delivery_tiers JSONB DEFAULT '[]'`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS is_auth_required BOOLEAN DEFAULT false`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS fulfillment_options JSONB DEFAULT '{"dinein": true, "pickup": true, "delivery": true}'`,

            // 7b. business_items enhancements
            `ALTER TABLE business_items ADD COLUMN IF NOT EXISTS stock_count INTEGER`,
            `ALTER TABLE business_items ADD COLUMN IF NOT EXISTS unit VARCHAR(50)`,
            `ALTER TABLE business_items ADD COLUMN IF NOT EXISTS tags TEXT[]`,
            `ALTER TABLE business_items ADD COLUMN IF NOT EXISTS tax_applicable INTEGER DEFAULT 1`,
            `ALTER TABLE business_items ADD COLUMN IF NOT EXISTS is_veg BOOLEAN DEFAULT false`,

            // 7. Create conversation_sessions table (AI memory)
            `CREATE TABLE IF NOT EXISTS conversation_sessions (
                id SERIAL PRIMARY KEY,
                customer_number VARCHAR(20) NOT NULL,
                user_id INTEGER REFERENCES app_users(id),
                state VARCHAR(100) DEFAULT 'IDLE',
                context JSONB DEFAULT '{}',
                is_paused BOOLEAN DEFAULT false,
                last_interaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(customer_number, user_id)
            )`,
            `ALTER TABLE conversation_sessions ADD COLUMN IF NOT EXISTS is_paused BOOLEAN DEFAULT false`,

            // 8. Create customer_loyalty table
            `CREATE TABLE IF NOT EXISTS customer_loyalty (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id),
                customer_number TEXT,
                name VARCHAR(255) DEFAULT 'Customer',
                points INTEGER DEFAULT 0,
                total_spent DECIMAL(10,2) DEFAULT 0.00,
                last_visit TIMESTAMP DEFAULT NOW(),
                UNIQUE(user_id, customer_number)
            )`,
            `ALTER TABLE customer_loyalty ALTER COLUMN customer_number TYPE TEXT`,
            `ALTER TABLE customer_loyalty ADD COLUMN IF NOT EXISTS name VARCHAR(255) DEFAULT 'Customer'`,
            `ALTER TABLE customer_loyalty ADD COLUMN IF NOT EXISTS total_spent DECIMAL(10,2) DEFAULT 0.00`,
            `ALTER TABLE customer_loyalty ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0`,
            `ALTER TABLE customer_loyalty ADD COLUMN IF NOT EXISTS last_visit TIMESTAMP DEFAULT NOW()`,

            // Migration: add missing columns to orders
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id INTEGER`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255)`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_number TEXT`,
            `ALTER TABLE orders ALTER COLUMN customer_number TYPE TEXT`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS address TEXT`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS items JSONB`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending'`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS table_number VARCHAR(50)`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_reference VARCHAR(50)`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_charge NUMERIC DEFAULT 0`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS service_charge NUMERIC DEFAULT 0`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'CASH'`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'PENDING'`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_lat NUMERIC`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_long NUMERIC`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS rider_id INTEGER`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS redeemed_points INTEGER DEFAULT 0`,

            // 20. Delivery Partners
            `CREATE TABLE IF NOT EXISTS leads (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                phone VARCHAR(50),
                business VARCHAR(255),
                interest VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS delivery_partners (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(30) NOT NULL,
                status VARCHAR(50) DEFAULT 'available',
                last_lat DECIMAL(10,6),
                last_lng DECIMAL(10,6),
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

            // 21. Rider Locations (History/Live)
            `CREATE TABLE IF NOT EXISTS rider_locations (
                id SERIAL PRIMARY KEY,
                rider_id INTEGER REFERENCES delivery_partners(id) ON DELETE CASCADE,
                order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
                lat DECIMAL(10,6) NOT NULL,
                lng DECIMAL(10,6) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

            // 9. Chat messages table (for Live AI Inbox)
            `CREATE TABLE IF NOT EXISTS chat_messages (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id),
                customer_number TEXT NOT NULL,
                role VARCHAR(10) NOT NULL DEFAULT 'customer',
                text TEXT NOT NULL,
                message_type VARCHAR(20) DEFAULT 'text',
                is_read BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `ALTER TABLE chat_messages ALTER COLUMN customer_number TYPE TEXT`,
            `ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false`,

            // 11. Marketing Contacts table (for Campaigns)
            `CREATE TABLE IF NOT EXISTS marketing_contacts (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id),
                phone_number TEXT NOT NULL,
                name VARCHAR(255) DEFAULT 'Customer',
                last_order_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, phone_number)
            )`,
            `ALTER TABLE marketing_contacts ADD COLUMN IF NOT EXISTS phone_number TEXT`,
            `ALTER TABLE marketing_contacts ALTER COLUMN phone_number TYPE TEXT`,
            `ALTER TABLE marketing_contacts ADD COLUMN IF NOT EXISTS last_order_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
            `ALTER TABLE marketing_contacts ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false`,

            // 12. Customer Feedback table
            `CREATE TABLE IF NOT EXISTS customer_feedback (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id),
                customer_number VARCHAR(30),
                rating INTEGER CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

            // 13. System Notifications table (For Admin -> Businesses)
            `CREATE TABLE IF NOT EXISTS system_notifications (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id),
                title VARCHAR(255),
                message TEXT,
                is_read BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

            // 14. Payment Settings (For Master Admin)
            `CREATE TABLE IF NOT EXISTS payment_settings (
                id SERIAL PRIMARY KEY,
                upi_id VARCHAR(255),
                bank_account VARCHAR(255),
                ifsc_code VARCHAR(255),
                qr_code_url TEXT,
                razorpay_link TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

            // 15. Recharge Requests
            `CREATE TABLE IF NOT EXISTS recharge_requests (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id),
                plan_amount DECIMAL(10,2),
                credits_requested INTEGER,
                transaction_id VARCHAR(255),
                status VARCHAR(50) DEFAULT 'PENDING',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

            // 16. Audit Logs
            `CREATE TABLE IF NOT EXISTS audit_logs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id),
                action VARCHAR(255),
                details JSONB,
                ip_address VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            // 17. System Status (to track crashes/restarts)
            `CREATE TABLE IF NOT EXISTS system_status (
                id SERIAL PRIMARY KEY,
                restart_count INTEGER DEFAULT 0,
                last_restart_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                server_uptime_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `INSERT INTO system_status (id, restart_count) VALUES (1, 0) ON CONFLICT DO NOTHING`,

            // 19. Table Reservations
            `CREATE TABLE IF NOT EXISTS reservations (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id),
                customer_name VARCHAR(255),
                customer_number VARCHAR(50),
                guests INTEGER,
                reservation_date DATE,
                reservation_time TIME,
                status VARCHAR(50) DEFAULT 'confirmed',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            // 20. Scheduled Messages (for Auto Follow-ups)
            `CREATE TABLE IF NOT EXISTS scheduled_messages (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                customer_number TEXT NOT NULL,
                message TEXT NOT NULL,
                scheduled_for TIMESTAMP NOT NULL,
                status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, SENT, FAILED
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            // 21. Waiter Requests
            `CREATE TABLE IF NOT EXISTS waiter_requests (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                table_number VARCHAR(50),
                status VARCHAR(50) DEFAULT 'PENDING',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            // 22. Business Expenses (Ledger)
            `CREATE TABLE IF NOT EXISTS business_expenses (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                category VARCHAR(255) NOT NULL, -- e.g. Vegetables, Rent, Electricity
                amount DECIMAL(10,2) NOT NULL,
                note TEXT,
                expense_date DATE DEFAULT CURRENT_DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            // 23. WhatsApp Point Redemption Verification
            `CREATE TABLE IF NOT EXISTS pending_redemptions (
                id SERIAL PRIMARY KEY,
                token VARCHAR(50) UNIQUE NOT NULL,
                phone VARCHAR(20),
                user_id INTEGER REFERENCES app_users(id),
                points INTEGER DEFAULT 0,
                is_verified BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            // 24. WhatsApp Secure Login Verification
            `CREATE TABLE IF NOT EXISTS pending_auths (
                id SERIAL PRIMARY KEY,
                token VARCHAR(50) UNIQUE NOT NULL,
                phone VARCHAR(20),
                user_id INTEGER REFERENCES app_users(id),
                is_verified BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            // 25. POS Floor Plan Tables
            `CREATE TABLE IF NOT EXISTS pos_tables (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                table_name VARCHAR(50) NOT NULL,
                x_pos INTEGER DEFAULT 0,
                y_pos INTEGER DEFAULT 0,
                status VARCHAR(50) DEFAULT 'AVAILABLE',
                capacity INTEGER DEFAULT 4,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`
        ];

        for (let q of queries) {
            if (q) await pool.query(q);
        }

        // ✅ AUTO-NORMALIZATION: Standardize on full International format (+91...)
        console.log("🐘 STANDARDIZING PHONE FORMAT TO INTERNATIONAL...");
        try {
            await pool.query(`
                DO $$ BEGIN
                    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'customer_loyalty') THEN
                        -- We now respect the full number provided by the frontend.
                        -- No more stripping to 10 digits.
                    END IF;
                END $$;
            `);
        } catch (mErr) { console.error("Standardization update:", mErr); }

        console.log("✅ DATABASE SCHEMA INITIALIZED SUCCESSFULLY");
    } catch (err) {
        console.error("❌ DATABASE INITIALIZATION ERROR:", err);
    }
}

module.exports = { initializeDatabase };
