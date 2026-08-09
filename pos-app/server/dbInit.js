const pool = require("./db");

async function initializeDatabase() {
    try {
        console.log("🐘 INITIALIZING DATABASE SCHEMA...");

        // Test database connection before running schema migrations
        try {
            await pool.query("SELECT 1");
        } catch (connErr) {
            console.error("\n❌ DATABASE CONNECTION FAILED: Could not connect to the PostgreSQL server.");
            console.error("👉 Check if the PostgreSQL service is running and that port, user, and password in your .env are correct.");
            console.error("Error details:", connErr.message, "\n");
            return;
        }

        const queries = [
            // 1. Create app_users table (full schema)
            `CREATE TABLE IF NOT EXISTS app_users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                username VARCHAR(255) UNIQUE,
                email VARCHAR(255) UNIQUE,
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
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS brand_name VARCHAR(255)`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS whatsapp_api_number VARCHAR(100)`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS country_code VARCHAR(10) DEFAULT '+91'`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS owner_id INTEGER REFERENCES app_users(id) ON DELETE SET NULL`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS city VARCHAR(255)`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS verify_mac_ip BOOLEAN DEFAULT false`,
            `ALTER TABLE app_users ADD CONSTRAINT app_users_username_key UNIQUE (username)`,
            `ALTER TABLE app_users ADD CONSTRAINT app_users_phone_key UNIQUE (phone)`,

            // 2c. Create designations table
            `CREATE TABLE IF NOT EXISTS outlet_designations (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                outlet_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, name, outlet_id)
            )`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS designation_id INTEGER REFERENCES outlet_designations(id) ON DELETE SET NULL`,

            // 2c. Create designations table
            `CREATE TABLE IF NOT EXISTS outlet_designations (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                outlet_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, name, outlet_id)
            )`,
            `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS designation_id INTEGER REFERENCES outlet_designations(id) ON DELETE SET NULL`,

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
                sale_price_2 DECIMAL(10,2),
                sale_price_3 DECIMAL(10,2),
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
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS loyalty_joining_points INTEGER DEFAULT 0`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS loyalty_bill_amount_threshold DECIMAL(10,2) DEFAULT 100.00`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS loyalty_points_earned INTEGER DEFAULT 1`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS loyalty_points_dinein BOOLEAN DEFAULT true`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS loyalty_points_pickup BOOLEAN DEFAULT true`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS loyalty_points_delivery BOOLEAN DEFAULT true`,
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
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax_cgst NUMERIC DEFAULT 0`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax_sgst NUMERIC DEFAULT 0`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS bill_no VARCHAR(50)`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_type VARCHAR(50)`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS tip_amount NUMERIC DEFAULT 0`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS pre_order_id INTEGER`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS pre_order_advance NUMERIC DEFAULT 0`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS pre_order_balance NUMERIC DEFAULT 0`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'POS_TERMINAL'`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS rejection_reason TEXT DEFAULT NULL`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS device_id VARCHAR(255) DEFAULT NULL`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS pre_order_scheduled_date DATE`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS pre_order_scheduled_time TIME`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(100)`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS pdf_sent BOOLEAN DEFAULT false`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,

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
            `ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS wa_message_id VARCHAR(255)`,

            // 11. Marketing Contacts table (for Campaigns)
            `CREATE TABLE IF NOT EXISTS marketing_contacts (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id),
                phone_number TEXT NOT NULL,
                name VARCHAR(255) DEFAULT 'Customer',
                total_spent NUMERIC DEFAULT 0.00,
                last_order_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, phone_number)
            )`,
            `ALTER TABLE marketing_contacts ADD COLUMN IF NOT EXISTS phone_number TEXT`,
            `ALTER TABLE marketing_contacts ALTER COLUMN phone_number TYPE TEXT`,
            `ALTER TABLE marketing_contacts ADD COLUMN IF NOT EXISTS last_order_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
            `ALTER TABLE marketing_contacts ADD COLUMN IF NOT EXISTS total_spent NUMERIC DEFAULT 0.00`,
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
            `CREATE TABLE IF NOT EXISTS waiter_requests (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                table_number VARCHAR(50),
                status VARCHAR(50) DEFAULT 'PENDING',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `ALTER TABLE waiter_requests ADD COLUMN IF NOT EXISTS message TEXT`,
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
            )`,
            // 26. Inventory Raw Materials
            `CREATE TABLE IF NOT EXISTS inventory_raw (
                id SERIAL PRIMARY KEY,
                biz_id INTEGER NOT NULL,
                item_name VARCHAR(255) NOT NULL,
                sku_code VARCHAR(100),
                unit VARCHAR(20) DEFAULT 'Kg',
                current_stock NUMERIC(12,3) DEFAULT 0.000,
                min_stock NUMERIC(12,3) DEFAULT 0.000,
                last_purchase_price NUMERIC(10,2) DEFAULT 0.00,
                unit_cost NUMERIC(10,2) DEFAULT 0.00,
                category VARCHAR(100),
                category_id INTEGER,
                location_id INTEGER,
                vendor_id INTEGER,
                hsn_code VARCHAR(50),
                gst_percent NUMERIC(5,2) DEFAULT 0.00,
                yield_percent NUMERIC(5,2) DEFAULT 100.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `ALTER TABLE inventory_raw ADD COLUMN IF NOT EXISTS sku_code VARCHAR(100)`,
            `ALTER TABLE inventory_raw ADD COLUMN IF NOT EXISTS unit_cost NUMERIC(10,2) DEFAULT 0.00`,
            `ALTER TABLE inventory_raw ADD COLUMN IF NOT EXISTS category_id INTEGER`,
            `ALTER TABLE inventory_raw ADD COLUMN IF NOT EXISTS location_id INTEGER`,
            `ALTER TABLE inventory_raw ADD COLUMN IF NOT EXISTS vendor_id INTEGER`,
            `ALTER TABLE inventory_raw ADD COLUMN IF NOT EXISTS hsn_code VARCHAR(50)`,
            `ALTER TABLE inventory_raw ADD COLUMN IF NOT EXISTS gst_percent NUMERIC(5,2) DEFAULT 0.00`,
            `ALTER TABLE inventory_raw ADD COLUMN IF NOT EXISTS yield_percent NUMERIC(5,2) DEFAULT 100.00`,

            // 26b. Raw Material Categories
            `CREATE TABLE IF NOT EXISTS inventory_rm_categories (
                id SERIAL PRIMARY KEY,
                biz_id INTEGER NOT NULL,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

            // 26c. Inventory Measurement Units
            `CREATE TABLE IF NOT EXISTS inventory_units (
                id SERIAL PRIMARY KEY,
                biz_id INTEGER NOT NULL,
                name VARCHAR(50) NOT NULL,
                symbol VARCHAR(20),
                base_unit VARCHAR(50),
                conversion_factor NUMERIC(10,4) DEFAULT 1.0000,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

            // 26d. Inventory Locations / Storage Warehouses
            `CREATE TABLE IF NOT EXISTS inventory_locations (
                id SERIAL PRIMARY KEY,
                biz_id INTEGER NOT NULL,
                name VARCHAR(255) NOT NULL,
                code VARCHAR(50),
                description TEXT,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

            // 27. Recipes (BOM)
            `CREATE TABLE IF NOT EXISTS recipes (
                id SERIAL PRIMARY KEY,
                menu_item_id INTEGER REFERENCES business_items(id) ON DELETE CASCADE,
                raw_item_id INTEGER REFERENCES inventory_raw(id) ON DELETE CASCADE,
                quantity NUMERIC(12,3) NOT NULL,
                unit VARCHAR(20) NOT NULL
            )`,

            // 28. Inventory Logs
            `CREATE TABLE IF NOT EXISTS inventory_logs (
                id SERIAL PRIMARY KEY,
                biz_id INTEGER NOT NULL,
                raw_item_id INTEGER REFERENCES inventory_raw(id),
                type VARCHAR(50), -- STOCK_IN, STOCK_OUT, WASTAGE, RECIPE_DEDUCTION, ADJUSTMENT
                quantity NUMERIC(12,3) NOT NULL,
                unit VARCHAR(20),
                unit_price NUMERIC(10,2) DEFAULT 0.00,
                total_cost NUMERIC(10,2) DEFAULT 0.00,
                vendor_id INTEGER,
                reference_no VARCHAR(100),
                note TEXT,
                created_by INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `ALTER TABLE inventory_logs ADD COLUMN IF NOT EXISTS unit VARCHAR(20)`,
            `ALTER TABLE inventory_logs ADD COLUMN IF NOT EXISTS unit_price NUMERIC(10,2) DEFAULT 0.00`,
            `ALTER TABLE inventory_logs ADD COLUMN IF NOT EXISTS total_cost NUMERIC(10,2) DEFAULT 0.00`,
            `ALTER TABLE inventory_logs ADD COLUMN IF NOT EXISTS vendor_id INTEGER`,
            `ALTER TABLE inventory_logs ADD COLUMN IF NOT EXISTS reference_no VARCHAR(100)`,
            `ALTER TABLE inventory_logs ADD COLUMN IF NOT EXISTS created_by INTEGER`,

            // 29. Vendors
            `CREATE TABLE IF NOT EXISTS vendors (
                id SERIAL PRIMARY KEY,
                biz_id INTEGER NOT NULL,
                name VARCHAR(255) NOT NULL,
                contact_person VARCHAR(255),
                phone VARCHAR(30),
                email VARCHAR(255),
                address TEXT,
                gst_number VARCHAR(30),
                opening_balance NUMERIC(10,2) DEFAULT 0.00,
                payment_terms VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `ALTER TABLE vendors ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255)`,
            `ALTER TABLE vendors ADD COLUMN IF NOT EXISTS opening_balance NUMERIC(10,2) DEFAULT 0.00`,
            `ALTER TABLE vendors ADD COLUMN IF NOT EXISTS payment_terms VARCHAR(100)`,
            // 30. business_items TMBill-parity upgrades
            `ALTER TABLE business_items ADD COLUMN IF NOT EXISTS tax_percent NUMERIC(5,2) DEFAULT 0.00`,
            `ALTER TABLE business_items ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb`,
            `ALTER TABLE business_items ADD COLUMN IF NOT EXISTS modifiers JSONB DEFAULT '[]'::jsonb`,
            `ALTER TABLE business_items ADD COLUMN IF NOT EXISTS kot_category VARCHAR(50) DEFAULT 'Main Kitchen'`,
            `ALTER TABLE business_items ADD COLUMN IF NOT EXISTS hsn_code VARCHAR(20)`,
            `ALTER TABLE business_items ADD COLUMN IF NOT EXISTS barcode VARCHAR(50)`,
            `ALTER TABLE business_items ADD COLUMN IF NOT EXISTS cost_price NUMERIC(10,2) DEFAULT 0.00`,
            // 31. Outlet Payment Modes
            `CREATE TABLE IF NOT EXISTS outlet_payment_modes (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                method_name VARCHAR(50) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, method_name)
            )`,
            // 32. Master Payment Modes (Global Pool for the Brand)
            `CREATE TABLE IF NOT EXISTS master_payment_modes (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                method_name VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, method_name)
            )`,
            // 33. Tax Product Groups (Master Pool)
            `CREATE TABLE IF NOT EXISTS tax_product_groups (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                group_name VARCHAR(100) NOT NULL,
                description TEXT,
                is_active BOOLEAN DEFAULT true,
                outlet_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, group_name, outlet_id)
            )`,
            `ALTER TABLE tax_product_groups ADD COLUMN IF NOT EXISTS outlet_id INTEGER`,
            `ALTER TABLE tax_product_groups ADD COLUMN IF NOT EXISTS description TEXT`,
            `ALTER TABLE tax_product_groups ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true`,
            
            // 34. Categories (High-Density Taxonomy)
            `CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                outlet_id INTEGER,
                name VARCHAR(255) NOT NULL,
                alt_name VARCHAR(255),
                parent_id INTEGER,
                sorting_order INTEGER DEFAULT 0,
                description TEXT,
                alt_description TEXT,
                ondc_category VARCHAR(100),
                color_code VARCHAR(20) DEFAULT '#000000',
                image_url TEXT,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, name, outlet_id)
            )`,
            `ALTER TABLE categories ADD COLUMN IF NOT EXISTS outlet_id INTEGER`,

            // 35. Kitchen Departments (High-Density Isolation)
            `CREATE TABLE IF NOT EXISTS kitchen_departments (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                outlet_id INTEGER,
                name VARCHAR(255) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, name, outlet_id)
            )`,
            `ALTER TABLE kitchen_departments ADD COLUMN IF NOT EXISTS outlet_id INTEGER`,
            `ALTER TABLE kitchen_departments ADD COLUMN IF NOT EXISTS name VARCHAR(255)`,
            `DO $$ BEGIN
                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kitchen_departments' AND column_name = 'department_name') THEN
                    ALTER TABLE kitchen_departments ALTER COLUMN department_name DROP NOT NULL;
                    UPDATE kitchen_departments SET name = department_name WHERE name IS NULL;
                END IF;
            END $$;`,
            // 36. KOTs (Kitchen Order Tickets)
            `CREATE TABLE IF NOT EXISTS kots (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                table_number VARCHAR(50),
                items JSONB NOT NULL,
                status VARCHAR(50) DEFAULT 'PENDING',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            // 37. Waiters
            `CREATE TABLE IF NOT EXISTS waiters (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            // 38. Link Waiter to Orders
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS waiter_id INTEGER`,
            // 39. Discounts
            `CREATE TABLE IF NOT EXISTS discounts (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                rate NUMERIC(10,2) NOT NULL DEFAULT 0,
                discount_type VARCHAR(50) DEFAULT 'percent', -- 'percent' or 'fixed'
                outlet_id INTEGER,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            // 40. Additional Charges
            `CREATE TABLE IF NOT EXISTS additional_charges (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                amount NUMERIC(10,2) NOT NULL,
                charge_type VARCHAR(50) DEFAULT 'percent',
                applicable_on VARCHAR(255) DEFAULT 'All Channels',
                platform VARCHAR(100),
                menu_id INTEGER,
                billing_flag VARCHAR(100),
                free_after_amount NUMERIC(10,2),
                is_default BOOLEAN DEFAULT false,
                tax_applicable BOOLEAN DEFAULT false,
                tax_type VARCHAR(50),
                tax_amount NUMERIC(10,2),
                tax_title VARCHAR(100),
                tax_dividable BOOLEAN DEFAULT false,
                apply_on_subtotal_logic VARCHAR(100),
                outlet_id INTEGER,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `ALTER TABLE additional_charges ADD COLUMN IF NOT EXISTS outlet_id INTEGER`,
            // 41. Customers table
            `CREATE TABLE IF NOT EXISTS customers (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                name VARCHAR(255),
                number VARCHAR(30) NOT NULL,
                address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, number)
            )`,
            // 42. Pre-Orders (Advance / Scheduled Orders)
            `CREATE TABLE IF NOT EXISTS pre_orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                customer_name VARCHAR(255),
                customer_number TEXT,
                customer_address TEXT,
                items JSONB NOT NULL,
                total_price NUMERIC(10,2) NOT NULL,
                advance_paid NUMERIC(10,2) DEFAULT 0,
                balance_due NUMERIC(10,2) DEFAULT 0,
                scheduled_date DATE NOT NULL,
                scheduled_time TIME NOT NULL,
                order_type VARCHAR(50) DEFAULT 'PICKUP',
                table_number VARCHAR(50),
                status VARCHAR(50) DEFAULT 'SCHEDULED',
                notes TEXT,
                discount NUMERIC(10,2) DEFAULT 0,
                coupon_code VARCHAR(100) DEFAULT NULL,
                coupon_discount NUMERIC(10,2) DEFAULT 0,
                points_redeemed INTEGER DEFAULT 0,
                points_discount NUMERIC(10,2) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            // 43. WhatsApp templates table (Live Integration)
            `CREATE TABLE IF NOT EXISTS whatsapp_templates (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(100) DEFAULT 'MARKETING',
                language VARCHAR(50) DEFAULT 'en',
                header_type VARCHAR(50) DEFAULT 'NONE',
                header_text TEXT DEFAULT '',
                body TEXT NOT NULL,
                footer TEXT DEFAULT '',
                buttons JSONB DEFAULT '[]'::jsonb,
                status VARCHAR(50) DEFAULT 'APPROVED',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, name)
            )`,
            // 44. WhatsApp campaigns table (Live Integration)
            `CREATE TABLE IF NOT EXISTS whatsapp_campaigns (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                template_name VARCHAR(255) NOT NULL,
                audience_size INTEGER DEFAULT 0,
                sent INTEGER DEFAULT 0,
                delivered INTEGER DEFAULT 0,
                read INTEGER DEFAULT 0,
                failed INTEGER DEFAULT 0,
                status VARCHAR(50) DEFAULT 'PENDING',
                scheduled_for TIMESTAMP DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            // 45. WhatsApp chatflows table (Live Integration)
            `CREATE TABLE IF NOT EXISTS whatsapp_chatflows (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                description TEXT DEFAULT '',
                triggers TEXT[] DEFAULT '{}'::text[],
                steps JSONB DEFAULT '[]'::jsonb,
                is_active BOOLEAN DEFAULT true,
                runs_count INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            // 46. Outlet Menus
            `CREATE TABLE IF NOT EXISTS outlet_menus (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                outlet_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                menu_name VARCHAR(255) NOT NULL,
                short_name VARCHAR(100),
                is_pos_default BOOLEAN DEFAULT false,
                is_digital_default BOOLEAN DEFAULT false,
                is_digital BOOLEAN DEFAULT false,
                use_for_mobile BOOLEAN DEFAULT false,
                is_ondc BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `ALTER TABLE outlet_menus ADD COLUMN IF NOT EXISTS is_table_default BOOLEAN DEFAULT false`,
            // 47. Outlet Menu Items
            `CREATE TABLE IF NOT EXISTS outlet_menu_items (
                id SERIAL PRIMARY KEY,
                menu_id INTEGER REFERENCES outlet_menus(id) ON DELETE CASCADE,
                short_code VARCHAR(100),
                item_name VARCHAR(255) NOT NULL,
                base_price DECIMAL(10,2) NOT NULL,
                category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
                kitchen_dept_id INTEGER REFERENCES kitchen_departments(id) ON DELETE SET NULL,
                tax_group_id INTEGER REFERENCES tax_product_groups(id) ON DELETE SET NULL,
                food_type VARCHAR(50),
                description TEXT,
                stock_qty INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT true,
                item_type VARCHAR(50) DEFAULT '0',
                hsn_code VARCHAR(100),
                is_recommended BOOLEAN DEFAULT false,
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            // 48. Unique partial index for outlet_menu_items
            `CREATE UNIQUE INDEX IF NOT EXISTS unique_menu_short_code_idx ON outlet_menu_items (menu_id, short_code) WHERE short_code IS NOT NULL AND short_code != ''`,
            // 49. Support Tickets Table
            `CREATE TABLE IF NOT EXISTS support_tickets (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                subject VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                admin_reply TEXT DEFAULT '',
                status VARCHAR(50) DEFAULT 'open',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            // 50. Tax Configurations Table
            `CREATE TABLE IF NOT EXISTS tax_configurations (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                tax_name VARCHAR(255) NOT NULL,
                display_name VARCHAR(255),
                tax_value DECIMAL(10,2) NOT NULL,
                tax_product_group_id INTEGER REFERENCES tax_product_groups(id) ON DELETE SET NULL,
                is_inclusive BOOLEAN DEFAULT false,
                is_dividable BOOLEAN DEFAULT false,
                hide_on_bill BOOLEAN DEFAULT false,
                is_active BOOLEAN DEFAULT true,
                outlet_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            // 51. Alter kitchen_departments user_id foreign key constraint to ON DELETE CASCADE
            `ALTER TABLE kitchen_departments DROP CONSTRAINT IF EXISTS kitchen_departments_user_id_fkey`,
            `ALTER TABLE kitchen_departments ADD CONSTRAINT kitchen_departments_user_id_fkey FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE`,
            // 52. Add charge_details JSONB to orders for storing per-charge breakdown
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS charge_details JSONB DEFAULT '[]'`,
            // 53. Add paid_amount and credit_amount to orders
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_amount NUMERIC DEFAULT 0`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS credit_amount NUMERIC DEFAULT 0`,
            // 54. Multiple Pricing for outlet_menu_items
            `ALTER TABLE outlet_menu_items ADD COLUMN IF NOT EXISTS sale_price_2 DECIMAL(10,2)`,
            `ALTER TABLE outlet_menu_items ADD COLUMN IF NOT EXISTS sale_price_3 DECIMAL(10,2)`,
            // 55. Multiple Pricing for business_items
            `ALTER TABLE business_items ADD COLUMN IF NOT EXISTS sale_price_2 DECIMAL(10,2)`,
            `ALTER TABLE business_items ADD COLUMN IF NOT EXISTS sale_price_3 DECIMAL(10,2)`,
            // 56. Item order-type pricing table
            `CREATE TABLE IF NOT EXISTS item_multiple_pricing (
                id SERIAL PRIMARY KEY,
                item_id INTEGER NOT NULL REFERENCES business_items(id) ON DELETE CASCADE,
                order_type VARCHAR(100) NOT NULL,
                price NUMERIC(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(item_id, order_type)
            )`,
            // 57. Outlet Payment QRs Table
            `CREATE TABLE IF NOT EXISTS outlet_qrs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                brand VARCHAR(50) NOT NULL,
                upi_id VARCHAR(255) NOT NULL,
                qr_type VARCHAR(50) DEFAULT 'static',
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            // 58. Add rate/discount_type columns if not exists
            `ALTER TABLE discounts ADD COLUMN IF NOT EXISTS rate NUMERIC(10,2) DEFAULT 0`,
            `ALTER TABLE discounts ADD COLUMN IF NOT EXISTS discount_type VARCHAR(50) DEFAULT 'percent'`,
            // 59. Align discounts and additional_charges foreign key constraints to reference app_users(id)
            `UPDATE additional_charges SET outlet_id = NULL WHERE outlet_id IS NOT NULL AND outlet_id NOT IN (SELECT id FROM app_users)`,
            `UPDATE discounts SET outlet_id = NULL WHERE outlet_id IS NOT NULL AND outlet_id NOT IN (SELECT id FROM app_users)`,
            `ALTER TABLE discounts DROP CONSTRAINT IF EXISTS discounts_outlet_id_fkey`,
            `ALTER TABLE additional_charges DROP CONSTRAINT IF EXISTS additional_charges_outlet_id_fkey`,
            `ALTER TABLE discounts ADD CONSTRAINT discounts_outlet_id_fkey FOREIGN KEY (outlet_id) REFERENCES app_users(id) ON DELETE CASCADE`,
            `ALTER TABLE additional_charges ADD CONSTRAINT additional_charges_outlet_id_fkey FOREIGN KEY (outlet_id) REFERENCES app_users(id) ON DELETE CASCADE`,
            // 60. Create user_store_access table for multi-store permissions management
            `CREATE TABLE IF NOT EXISTS user_store_access (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                outlet_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, outlet_id)
            )`,
            // 61. Create coupon_codes table
            `CREATE TABLE IF NOT EXISTS coupon_codes (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
                outlet_id INTEGER REFERENCES app_users(id) ON DELETE SET NULL,
                coupon_code VARCHAR(100) NOT NULL,
                order_type VARCHAR(50) DEFAULT 'ALL',
                amount NUMERIC(10,2) DEFAULT 0,
                fixed_perct VARCHAR(50) DEFAULT 'Fixed',
                applicable_order_amt NUMERIC(10,2) DEFAULT 0,
                customer_type VARCHAR(50) DEFAULT 'ALL',
                status VARCHAR(50) DEFAULT 'ACTIVE',
                created_by VARCHAR(100) DEFAULT 'ADMIN',
                created_at TIMESTAMP DEFAULT NOW()
            )`,
            // 62. Pre-Order enhancements migrations
            `ALTER TABLE pre_orders ADD COLUMN IF NOT EXISTS discount NUMERIC(10,2) DEFAULT 0`,
            `ALTER TABLE pre_orders ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(100) DEFAULT NULL`,
            `ALTER TABLE pre_orders ADD COLUMN IF NOT EXISTS coupon_discount NUMERIC(10,2) DEFAULT 0`,
            `ALTER TABLE pre_orders ADD COLUMN IF NOT EXISTS points_redeemed INTEGER DEFAULT 0`,
            `ALTER TABLE pre_orders ADD COLUMN IF NOT EXISTS points_discount NUMERIC(10,2) DEFAULT 0`,
            
            // 63. Create table_reservations table
            `CREATE TABLE IF NOT EXISTS table_reservations (
                id SERIAL PRIMARY KEY,
                user_id INT,
                outlet_id INT,
                reservation_ref VARCHAR(50) UNIQUE,
                customer_name VARCHAR(255),
                customer_phone VARCHAR(50),
                guests_count INT DEFAULT 2,
                reservation_date DATE NOT NULL,
                reservation_time VARCHAR(50) NOT NULL,
                seating_preference VARCHAR(100) DEFAULT 'Indoor',
                special_notes TEXT,
                assigned_table_number VARCHAR(50),
                status VARCHAR(50) DEFAULT 'PENDING',
                created_at TIMESTAMP DEFAULT NOW()
            )`,
            `ALTER TABLE marketing_contacts ADD COLUMN IF NOT EXISTS last_winback_sent_at TIMESTAMP`,
            `ALTER TABLE table_reservations ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT false`
        ];



        for (let q of queries) {
            try {
                if (q) await pool.query(q);
            } catch (queryErr) {
                // If it's a "Duplicate Constraint" error, we ignore it and keep the server running
                if (queryErr.code === '23505' || queryErr.message.includes('already exists')) {
                    console.warn("⚠️ Skipping constraint: duplicates exist. Please clean up database.");
                } else {
                    console.error("❌ Query Failed:", q.substring(0, 50) + "...", queryErr.message);
                }
            }
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

        // WIPE REQUEST CHECK FOR DATA RESET
        if (process.env.WIPE_CUSTOMERS_SALES === 'true') {
            console.log("⚠️ WIPE FLAG DETECTED! Clearing all customer, loyalty, and order/sales tables...");
            try {
                await pool.query("TRUNCATE TABLE customer_transactions CASCADE;");
                await pool.query("TRUNCATE TABLE customer_loyalty CASCADE;");
                await pool.query("TRUNCATE TABLE customer_feedback CASCADE;");
                await pool.query("TRUNCATE TABLE conversation_sessions CASCADE;");
                await pool.query("TRUNCATE TABLE chat_messages CASCADE;");
                await pool.query("TRUNCATE TABLE customers CASCADE;");
                await pool.query("TRUNCATE TABLE kots CASCADE;");
                await pool.query("TRUNCATE TABLE pre_orders CASCADE;");
                await pool.query("TRUNCATE TABLE orders CASCADE;");
                console.log("✅ Wiped successfully!");
            } catch (wipeErr) {
                console.error("❌ Wipe error:", wipeErr.message);
            }
        }

        console.log("✅ DATABASE SCHEMA INITIALIZED SUCCESSFULLY");
    } catch (err) {
        console.error("❌ DATABASE INITIALIZATION ERROR:", err);
    }
}

module.exports = { initializeDatabase };
