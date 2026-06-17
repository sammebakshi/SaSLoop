const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");
const Groq = require("groq-sdk");
const axios = require("axios");
const path = require("path");
const fs = require("fs");


// ✅ GET SMART MARKETING SUGGESTIONS
router.get("/suggestions", authMiddleware, async (req, res) => {
    try {
        const { target_user_id } = req.query;
        let userId = req.user.id;
        
        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin') || req.user.role === 'brand_owner')) {
            userId = target_user_id;
        }
        
        // Fetch last 50 orders and top products
        const [ordersRes, topRes] = await Promise.all([
            pool.query("SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50", [userId]),
            pool.query("SELECT product_name, COUNT(*) as count FROM orders, jsonb_to_recordset(items) as x(product_name text) WHERE user_id = $1 GROUP BY product_name ORDER BY count DESC LIMIT 5", [userId])
        ]);

        const orders = ordersRes.rows;
        const topProducts = topRes.rows;

        if (orders.length < 5) {
            return res.json({ 
                suggestions: [
                    { title: "Increase Reach", desc: "You have fewer than 5 orders. Try sharing your QR menu on Instagram to get started!", action: "Share QR" },
                    { title: "Loyalty Bonus", desc: "Enable 'Join VIP' bonus to encourage first-time WhatsApp orders.", action: "Setup Loyalty" }
                ] 
            });
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const prompt = `
            Analyze this business data and provide 3 ultra-short, actionable marketing suggestions.
            Data:
            - Recent Orders: ${orders.length}
            - Top Selling: ${topProducts.map(p => p.product_name).join(", ")}
            
            Return ONLY a valid JSON array of objects with "title", "desc", and "action" (2-word button text).
            Example: { "title": "Upsell Sides", "desc": "Customers buying burgers rarely buy fries. Try a combo.", "action": "Create Combo" }
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" }
        });

        const raw = completion.choices[0].message.content;
        const jsonMatch = raw.match(/\[[\s\S]*\]/);
        const suggestions = JSON.parse(jsonMatch ? jsonMatch[0] : raw);

        res.json({ suggestions });
    } catch (err) {
        console.error("AI Suggestions Error:", err);
        res.status(500).json({ error: "Failed to generate suggestions" });
    }
});

// ✅ AI EXECUTIVE CONSULTANT (Deep Analysis)
router.post("/consultant", authMiddleware, async (req, res) => {
    try {
        const { prompt, target_user_id } = req.body;
        let userId = req.user.id;

        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin') || req.user.role === 'brand_owner')) {
            userId = target_user_id;
        }

        // Fetch comprehensive data for context
        const [ordersRes, productsRes, customersRes] = await Promise.all([
            pool.query("SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100", [userId]),
            pool.query("SELECT product_name, category, price, COUNT(*) as sales_count FROM orders, jsonb_to_recordset(items) as x(product_name text) WHERE user_id = $1 GROUP BY product_name, category, price ORDER BY sales_count DESC", [userId]),
            pool.query("SELECT COUNT(*) as total_customers FROM customers WHERE user_id = $1", [userId])
        ]);

        const context = {
            totalOrders: ordersRes.rowCount,
            topProducts: productsRes.rows.slice(0, 5),
            totalCustomers: customersRes.rows[0].total_customers,
            recentTrends: ordersRes.rows.slice(0, 10).map(o => ({ date: o.created_at, total: o.total_amount }))
        };

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const systemPrompt = `
            You are the SaSLoop Executive AI Consultant. Your goal is to help business owners grow their revenue using their data.
            Current Business Context:
            - Total Customers: ${context.totalCustomers}
            - Top Items: ${context.topProducts.map(p => p.product_name).join(", ")}
            - Recent Sales Trend: ${JSON.stringify(context.recentTrends)}

            Be professional, data-driven, and brief. Use bold text for key insights.
            If the user asks for marketing, suggest specific WhatsApp campaign ideas.
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ],
            model: "llama-3.3-70b-versatile"
        });

        res.json({ reply: completion.choices[0].message.content });
    } catch (err) {
        console.error("AI Consultant Error:", err);
        res.status(500).json({ error: "Brain is currently overloaded. Try again in a moment." });
    }
});

// ✅ AI SENTIMENT & CHURN ANALYSIS
router.get("/sentiment", authMiddleware, async (req, res) => {
    try {
        const { target_user_id } = req.query;
        let userId = req.user.id;

        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin') || req.user.role === 'brand_owner')) {
            userId = target_user_id;
        }
        // Mocking sentiment for premium UI feel until we have real review data
        // In production, this would scan customer feedback/chats
        res.json({
            happiness_score: 88,
            top_positive: "Fast delivery, quality food",
            top_negative: "Waiting time on weekends",
            churn_risk_count: 12,
            predicted_revenue_growth: "+15% next month"
        });
    } catch (err) {
        res.status(500).json({ error: "Sentiment analysis failed" });
    }
});

// ✅ AI IMAGE GENERATION (Marketing Studio)
router.post("/generate-image", authMiddleware, async (req, res) => {
    try {
        const { prompt } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!prompt) return res.status(400).json({ error: "Prompt is required" });

        console.log(`🎨 AI Creative Studio: Generating image for prompt: "${prompt}"`);

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/imagen-3:generateContent?key=${apiKey}`,
            {
                instances: [{ prompt }],
                parameters: { sampleCount: 1 }
            },
            { headers: { 'Content-Type': 'application/json' } }
        );

        // NOTE: Imagen API returns base64. We will save it to local uploads.
        const base64Data = response.data.predictions[0].bytesBase64Encoded;
        const fileName = `ai_gen_${Date.now()}.png`;
        const uploadPath = path.join(process.cwd(), "uploads", fileName);

        fs.writeFileSync(uploadPath, base64Data, 'base64');
        
        res.json({ url: `/uploads/${fileName}` });
    } catch (err) {
        console.error("AI Image Gen Error:", err.response?.data || err.message);
        res.status(500).json({ error: "Image generation currently unavailable on this API tier." });
    }
});

// ✅ AI IMAGE MAGIC TOUCH (Upscaler / Enhancer)
router.post("/enhance-image", authMiddleware, async (req, res) => {
    try {
        const { imageUrl, productName } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!imageUrl) return res.status(400).json({ error: "Image URL is required" });

        console.log(`✨ AI Magic Touch: Enhancing ${productName}`);

        // We use the product name and current context to generate a "Studio" version
        const prompt = `A professional studio food photography of ${productName}. Cinematic lighting, ultra-high resolution, 8k, bokeh background, gourmet presentation. The dish should look identical to the original but in a high-end restaurant setting.`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/imagen-3:generateContent?key=${apiKey}`,
            {
                instances: [{ prompt }],
                parameters: { sampleCount: 1 }
            },
            { headers: { 'Content-Type': 'application/json' } }
        );

        const base64Data = response.data.predictions[0].bytesBase64Encoded;
        const fileName = `enhanced_${Date.now()}.png`;
        const uploadPath = path.join(process.cwd(), "uploads", fileName);

        fs.writeFileSync(uploadPath, base64Data, 'base64');
        
        res.json({ url: `/uploads/${fileName}` });
    } catch (err) {
        console.error("AI Enhance Error:", err.message);
        res.status(500).json({ error: "Magic Touch failed. Try again later." });
    }
});

// --- 📈 AI DYNAMIC PRICING ENGINE ---
router.post('/dynamic-pricing', async (req, res) => {
    try {
        const { itemId, basePrice, currentDemand, inventoryLevel } = req.body;
        // Formula: Surge if demand > 0.8, Discount if inventory > 0.7 & demand < 0.3
        let adjustedPrice = basePrice;
        let reason = "Normal pricing";

        if (currentDemand > 0.8) {
            adjustedPrice = basePrice * 1.15;
            reason = "Surge pricing active due to high demand";
        } else if (inventoryLevel > 0.7 && currentDemand < 0.3) {
            adjustedPrice = basePrice * 0.85;
            reason = "Flash discount active to clear excess stock";
        }

        res.json({ success: true, adjustedPrice: Math.round(adjustedPrice), reason });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- 🕵️ AI MYSTERY SHOPPER (CHAT SCANNER) ---
router.get('/mystery-shopper', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        // In a real app, we'd query the DB for the last 50 chats.
        // Mocking frustration detection logic.
        const insights = [
            { type: 'warning', issue: 'Cold food complaints', frequency: 3, suggestion: 'Optimize rider dispatch timing.' },
            { type: 'positive', issue: 'Packaging praised', frequency: 12, suggestion: 'Keep up the premium presentation.' }
        ];
        res.json({ success: true, insights });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ✅ AI MENU SCANNER (Gemini Vision)
router.post("/scan-menu", authMiddleware, async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) return res.status(400).json({ error: "Image required" });

        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) return res.status(500).json({ error: "Gemini API Key missing" });

        const prompt = `
            Analyze this restaurant menu image and extract ALL food items.
            For each item, provide: "name", "price" (as number), "category", and a "description" (max 10 words).
            Return ONLY a valid JSON array of objects.
            Example: [{"name": "Cheese Burger", "price": 250, "category": "Burgers", "description": "Juicy beef patty with extra cheddar."}]
        `;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
            {
                contents: [{
                    parts: [
                        { text: prompt },
                        { inline_data: { mime_type: "image/jpeg", data: imageBase64.split(",")[1] } }
                    ]
                }]
            }
        );

        const rawText = response.data.candidates[0].content.parts[0].text;
        const jsonMatch = rawText.match(/\[[\s\S]*\]/);
        const items = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);

        res.json({ items });
    } catch (err) {
        console.error("AI Scan Error:", err);
        res.status(500).json({ error: "Failed to scan menu" });
    }
});

// ✅ AI GLOBAL INTELLIGENCE (Executive Command)
router.get("/business-intelligence", authMiddleware, async (req, res) => {
    try {
        const { target_user_id } = req.query;
        let userId = req.user.id;

        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin') || req.user.role === 'brand_owner')) {
            userId = target_user_id;
        }
        
        const [ordersRes, itemsRes] = await Promise.all([
            pool.query("SELECT * FROM orders WHERE user_id = $1 AND created_at > NOW() - INTERVAL '24 hours'", [userId]),
            pool.query("SELECT product_name, COUNT(*) as count FROM orders, jsonb_to_recordset(items) as x(product_name text) WHERE user_id = $1 GROUP BY product_name ORDER BY count DESC LIMIT 1", [userId])
        ]);

        const todayRevenue = ordersRes.rows.reduce((sum, o) => sum + parseFloat(o.total_amount), 0);
        const topDish = itemsRes.rows[0]?.product_name || "N/A";
        const surge = todayRevenue > 10000 ? 1.1 : 1.0;

        // Persist surge multiplier to the database
        await pool.query("UPDATE restaurants SET current_surge_multiplier = $1 WHERE user_id = $2", [surge, userId]);
        
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const prompt = `
            Act as an Elite Business Consultant. Based on today's revenue (₹${todayRevenue}) and top dish (${topDish}), 
            give ONE high-impact, premium business strategy for the owner. 
            Be brief, bold, and strategic. Focus on scaling.
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.1-8b-instant"
        });

        res.json({
            strategy: completion.choices[0].message.content,
            metrics: {
                today_revenue: todayRevenue,
                active_customers: ordersRes.rowCount,
                peak_hour: "7 PM - 9 PM",
                top_dish: topDish,
                surge_multiplier: todayRevenue > 10000 ? 1.1 : 1.0
            }
        });
    } catch (err) {
        console.error("Intelligence Error:", err);
        res.status(500).json({ error: "Intelligence hub offline" });
    }
});

function getLocalIpAddress() {
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];
        for (const iface of interfaces) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

// ✅ GET COMPREHENSIVE DASHBOARD STATS
router.get("/dashboard-stats", authMiddleware, async (req, res) => {
    try {
        const { target_user_id, from, to, terminal } = req.query;
        let userId = req.user.bizId || req.user.id;

        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin') || req.user.role === 'brand_owner')) {
            userId = parseInt(target_user_id);
        }

        // Fetch settings to check if we should count advances in today's sales
        const settingsRes = await pool.query("SELECT settings FROM restaurants WHERE user_id = $1", [userId]);
        const settings = settingsRes.rows[0]?.settings ? (typeof settingsRes.rows[0].settings === 'string' ? JSON.parse(settingsRes.rows[0].settings) : settingsRes.rows[0].settings) : {};
        const countAdvanceInSales = !!settings.countAdvanceInSales;

        // Build date filter for orders table
        let dateFilter = "";
        let dateParams = [userId];
        let paramIdx = 2;

        if (from) {
            dateFilter += ` AND o.created_at >= $${paramIdx}`;
            dateParams.push(from);
            paramIdx++;
        }
        if (to) {
            dateFilter += ` AND o.created_at <= ($${paramIdx}::date + interval '1 day')`;
            dateParams.push(to);
            paramIdx++;
        }

        // Build terminal filter for orders table
        let terminalFilterNoAlias = "";
        let terminalFilterWithAlias = "";

        if (terminal === 'POS_ANDROID') {
            terminalFilterNoAlias = " AND source IN ('POS_ANDROID', 'ONLINE_ORDER', 'WHATSAPP', 'QR_MENU')";
            terminalFilterWithAlias = " AND o.source IN ('POS_ANDROID', 'ONLINE_ORDER', 'WHATSAPP', 'QR_MENU')";
        } else if (terminal === 'POS_WINDOWS') {
            terminalFilterNoAlias = " AND (source IS NULL OR source IN ('POS_WINDOWS', 'POS_WINDOWS_OFFLINE', 'POS_TERMINAL', 'POS_OFFLINE', 'POS_MANUAL', 'ONLINE_ORDER', 'WHATSAPP', 'QR_MENU'))";
            terminalFilterWithAlias = " AND (o.source IS NULL OR o.source IN ('POS_WINDOWS', 'POS_WINDOWS_OFFLINE', 'POS_TERMINAL', 'POS_OFFLINE', 'POS_MANUAL', 'ONLINE_ORDER', 'WHATSAPP', 'QR_MENU'))";
        }

        // Device filter (Dell vs HP isolation / Android vs PC isolation)
        const deviceId = req.headers['x-device-id'] || req.headers['X-Device-ID'] || req.query.device_id || null;
        const devFilterNoAlias = deviceId ? ` AND device_id = '${deviceId.replace(/'/g, "''")}'` : '';
        const devFilterWithAlias = deviceId ? ` AND o.device_id = '${deviceId.replace(/'/g, "''")}'` : '';

        // Today filter (Midnight in server time)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        // Month filter (Start of current month)
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const [
            todayRes,
            totalSalesRes,
            monthRes,
            orderTypeRes,
            paymentRes,
            taxRes,
            discountRes,
            customerRes,
            dueRes,
            expenseRes,
            dailyRes,
            topItemsRes,
            weeklyRes,
            todayCreditRes,
            totalCreditRes,
            sourceSalesRes
        ] = await Promise.all([
            // a. Today's sales
            pool.query(
                `SELECT COALESCE(SUM(total_price), 0) as total, COUNT(*) as count FROM orders WHERE user_id = $1 AND created_at >= $2 AND status != 'CANCELLED'${terminalFilterNoAlias}${devFilterNoAlias}`,
                [userId, todayStart]
            ),
            // b. Total sales (filtered by date)
            pool.query(
                `SELECT COALESCE(SUM(total_price), 0) as total, COUNT(*) as count FROM orders o WHERE o.user_id = $1 AND o.status != 'CANCELLED' ${dateFilter}${terminalFilterWithAlias}${devFilterWithAlias}`,
                dateParams
            ),
            // c. This month's sales
            pool.query(
                `SELECT COALESCE(SUM(total_price), 0) as total, COUNT(*) as count FROM orders WHERE user_id = $1 AND created_at >= $2 AND status != 'CANCELLED'${terminalFilterNoAlias}${devFilterNoAlias}`,
                [userId, monthStart]
            ),
            // d. Order type breakdown
            pool.query(
                `SELECT COALESCE(order_type, source, address, 'QUICK') as order_type, COALESCE(SUM(total_price), 0) as total, COUNT(*) as count FROM orders o WHERE o.user_id = $1 AND o.status != 'CANCELLED' ${dateFilter}${terminalFilterWithAlias}${devFilterWithAlias} GROUP BY COALESCE(order_type, source, address, 'QUICK')`,
                dateParams
            ),
            // e. Payment method breakdown
            pool.query(
                `SELECT COALESCE(payment_method, 'CASH') as method, COALESCE(SUM(total_price), 0) as total, COUNT(*) as count FROM orders o WHERE o.user_id = $1 AND o.status != 'CANCELLED' ${dateFilter}${terminalFilterWithAlias}${devFilterWithAlias} GROUP BY COALESCE(payment_method, 'CASH')`,
                dateParams
            ),
            // f. Tax totals
            pool.query(
                `SELECT COALESCE(SUM(tax_cgst), 0) as cgst, COALESCE(SUM(tax_sgst), 0) as sgst FROM orders o WHERE o.user_id = $1 AND o.status != 'CANCELLED' ${dateFilter}${terminalFilterWithAlias}${devFilterWithAlias}`,
                dateParams
            ),
            // g. Discount totals
            pool.query(
                `SELECT COALESCE(SUM(discount_amount), 0) as total FROM orders o WHERE o.user_id = $1 AND o.status != 'CANCELLED' ${dateFilter}${terminalFilterWithAlias}${devFilterWithAlias}`,
                dateParams
            ),
            // h. Customer count
            pool.query(
                "SELECT COUNT(*) as total FROM customer_loyalty WHERE user_id = $1",
                [userId]
            ),
            // i. Due payments
            pool.query(
                `SELECT COALESCE(SUM(total_price), 0) as total, COUNT(*) as count FROM orders o WHERE o.user_id = $1 AND o.payment_status = 'PENDING' AND o.status != 'CANCELLED' ${dateFilter}${terminalFilterWithAlias}${devFilterWithAlias}`,
                dateParams
            ),
            // j. Expenses
            pool.query(
                from && to
                    ? `SELECT COALESCE(SUM(amount), 0) as total FROM business_expenses WHERE user_id = $1 AND expense_date >= $2 AND expense_date <= $3`
                    : `SELECT COALESCE(SUM(amount), 0) as total FROM business_expenses WHERE user_id = $1`,
                from && to ? [userId, from, to] : [userId]
            ),
            // k. Daily sales for chart
            pool.query(
                `SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date, COALESCE(SUM(total_price), 0) as total, COUNT(*) as count FROM orders WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '30 days' AND status != 'CANCELLED'${terminalFilterNoAlias}${devFilterNoAlias} GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD') ORDER BY date`,
                [userId]
            ),
            // l. Top items for pie chart
            pool.query(
                `SELECT x.product_name as name, COUNT(*) as count, COALESCE(SUM((x.price)::numeric * (x.qty)::numeric), 0) as total FROM orders o, jsonb_to_recordset(o.items) as x(product_name text, price text, qty text) WHERE o.user_id = $1 AND o.status != 'CANCELLED' ${dateFilter}${terminalFilterWithAlias}${devFilterWithAlias} GROUP BY x.product_name ORDER BY count DESC LIMIT 8`,
                dateParams
            ),
            // m. Weekly heatmap (last 4 weeks)
            pool.query(
                `SELECT EXTRACT(DOW FROM created_at) as dow, EXTRACT(WEEK FROM created_at) as week, COALESCE(SUM(total_price), 0) as total FROM orders WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '28 days' AND status != 'CANCELLED'${terminalFilterNoAlias}${devFilterNoAlias} GROUP BY dow, week ORDER BY week, dow`,
                [userId]
            ),
            // n. Today's Credit Sales
            pool.query(
                `SELECT COALESCE(SUM(
                  CASE 
                    WHEN UPPER(payment_method) IN ('CREDIT', 'DUE') THEN total_price
                    ELSE COALESCE(credit_amount, 0)
                  END
                ), 0) as total FROM orders WHERE user_id = $1 AND created_at >= $2 AND status NOT IN ('CANCELLED', 'DELETED')${terminalFilterNoAlias}${devFilterNoAlias}`,
                [userId, todayStart]
            ),
            // o. Total Credit Sales
            pool.query(
                `SELECT COALESCE(SUM(
                  CASE 
                    WHEN UPPER(payment_method) IN ('CREDIT', 'DUE') THEN total_price
                    ELSE COALESCE(credit_amount, 0)
                  END
                ), 0) as total FROM orders WHERE user_id = $1 AND status NOT IN ('CANCELLED', 'DELETED')${terminalFilterNoAlias}${devFilterNoAlias}`,
                [userId]
            ),
            // p. Sales by Source breakdown
            pool.query(
                `SELECT COALESCE(source, 'UNKNOWN') as source, COALESCE(SUM(total_price), 0) as total, COUNT(*) as count 
                 FROM orders o 
                 WHERE o.user_id = $1 AND o.status != 'CANCELLED' ${dateFilter}${terminalFilterWithAlias}${devFilterWithAlias} 
                 GROUP BY COALESCE(source, 'UNKNOWN')`,
                dateParams
            )
        ]);

        let todayPreOrderAdvances = 0;
        let monthPreOrderAdvances = 0;
        let rangePreOrderAdvances = 0;
        let dailyPreOrderAdvances = [];

        if (countAdvanceInSales) {
            const todayAdvancesRes = await pool.query(
                `SELECT COALESCE(SUM(advance_paid), 0) as total FROM pre_orders WHERE user_id = $1 AND created_at >= $2 AND status != 'CANCELLED'`,
                [userId, todayStart]
            );
            todayPreOrderAdvances = parseFloat(todayAdvancesRes.rows[0].total);

            const monthAdvancesRes = await pool.query(
                `SELECT COALESCE(SUM(advance_paid), 0) as total FROM pre_orders WHERE user_id = $1 AND created_at >= $2 AND status != 'CANCELLED'`,
                [userId, monthStart]
            );
            monthPreOrderAdvances = parseFloat(monthAdvancesRes.rows[0].total);

            let preOrderDateFilter = "";
            let preOrderParams = [userId];
            let poParamIdx = 2;
            if (from) {
                preOrderDateFilter += ` AND created_at >= $${poParamIdx}`;
                preOrderParams.push(from);
                poParamIdx++;
            }
            if (to) {
                preOrderDateFilter += ` AND created_at <= ($${poParamIdx}::date + interval '1 day')`;
                preOrderParams.push(to);
                poParamIdx++;
            }
            const rangeAdvancesRes = await pool.query(
                `SELECT COALESCE(SUM(advance_paid), 0) as total FROM pre_orders WHERE user_id = $1 AND status != 'CANCELLED' ${preOrderDateFilter}`,
                preOrderParams
            );
            rangePreOrderAdvances = parseFloat(rangeAdvancesRes.rows[0].total);

            const dailyAdvancesRes = await pool.query(
                `SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date, COALESCE(SUM(advance_paid), 0) as total FROM pre_orders WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '30 days' AND status != 'CANCELLED' GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD') ORDER BY date`,
                [userId]
            );
            dailyPreOrderAdvances = dailyAdvancesRes.rows;
        }

        const orderTypes = orderTypeRes.rows;
        const getTypeTotal = (types) => {
            return orderTypes
                .filter(r => types.includes(String(r.order_type).toUpperCase()))
                .reduce((acc, r) => ({ total: acc.total + parseFloat(r.total), count: acc.count + parseInt(r.count) }), { total: 0, count: 0 });
        };

        const onlineTypes = ['ONLINE', 'WHATSAPP', 'QR', 'ONDC', 'DUNZO', 'UBER EATS', 'UBEREATS'];
        const dineInTypes = ['DINE-IN', 'DINE_IN', 'DINEIN', 'DINE IN'];
        const quickTypes = ['QUICK', 'QUICK_BILL', 'QUICK BILL', 'TAKEAWAY', 'POS'];
        const pickupTypes = ['PICKUP', 'PICK-UP', 'PICK_UP', 'PICK UP'];

        const allTotal = parseFloat(totalSalesRes.rows[0].total);
        const onlineTotal = getTypeTotal(onlineTypes);
        const dineInTotal = getTypeTotal(dineInTypes);
        const quickTotal = getTypeTotal(quickTypes);
        const pickupTotal = getTypeTotal(pickupTypes);
        const offlineTotal = { total: allTotal - onlineTotal.total, count: parseInt(totalSalesRes.rows[0].count) - onlineTotal.count };

        // Merge daily sales chart
        let dailyMap = {};
        dailyRes.rows.forEach(r => {
            dailyMap[r.date] = { date: r.date, total: parseFloat(r.total), count: parseInt(r.count) };
        });
        if (countAdvanceInSales) {
            dailyPreOrderAdvances.forEach(adv => {
                if (dailyMap[adv.date]) {
                    dailyMap[adv.date].total += parseFloat(adv.total);
                } else {
                    dailyMap[adv.date] = { date: adv.date, total: parseFloat(adv.total), count: 0 };
                }
            });
        }
        const mergedDailySales = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

        res.json({
            todaySales: { total: parseFloat(todayRes.rows[0].total) + todayPreOrderAdvances, count: parseInt(todayRes.rows[0].count) },
            totalSales: { total: allTotal + rangePreOrderAdvances, count: parseInt(totalSalesRes.rows[0].count) },
            thisMonth: { total: parseFloat(monthRes.rows[0].total) + monthPreOrderAdvances, count: parseInt(monthRes.rows[0].count) },
            offlineSales: offlineTotal,
            onlineSales: onlineTotal,
            salesBySource: sourceSalesRes.rows.map(r => ({
                source: r.source,
                total: parseFloat(r.total),
                count: parseInt(r.count)
            })),
            digitalSales: getTypeTotal(['DIGITAL', 'QR', 'ONLINE']),
            dineIn: dineInTotal,
            quickBill: quickTotal,
            pickup: pickupTotal,
            totalTax: parseFloat(taxRes.rows[0].cgst) + parseFloat(taxRes.rows[0].sgst),
            totalDiscount: parseFloat(discountRes.rows[0].total),
            totalExpenses: parseFloat(expenseRes.rows[0].total),
            customerCount: parseInt(customerRes.rows[0].total),
            duePayments: { total: parseFloat(dueRes.rows[0].total), count: parseInt(dueRes.rows[0].count) },
            avgSalePerPerson: parseInt(totalSalesRes.rows[0].count) > 0 ? ((allTotal + rangePreOrderAdvances) / parseInt(totalSalesRes.rows[0].count)).toFixed(2) : '0.00',
            closingBalance: allTotal + rangePreOrderAdvances - parseFloat(expenseRes.rows[0].total),
            todayCreditSales: parseFloat(todayCreditRes.rows[0].total),
            totalCreditSales: parseFloat(totalCreditRes.rows[0].total),
            paymentBreakdown: paymentRes.rows.map(r => ({ method: r.method, total: parseFloat(r.total), count: parseInt(r.count) })),
            dailySales: mergedDailySales,
            topItems: topItemsRes.rows.map(r => ({ name: r.name, count: parseInt(r.count), total: parseFloat(r.total) })),
            weeklyHeatmap: weeklyRes.rows.map(r => ({ dow: parseInt(r.dow), week: parseInt(r.week), total: parseFloat(r.total) })),
            serverIp: getLocalIpAddress()
        });
    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        res.status(500).json({ error: "Failed to load dashboard stats" });
    }
});
module.exports = router;


