const pool = require("./db");
const Groq = require("groq-sdk");
const axios = require("axios");

const normalizePhone = (p) => {
    if (!p) return "";
    return p.replace(/\D/g, "");
};

const formatToInter = (p) => {
    if (!p) return "";
    const digits = p.replace(/\D/g, "");
    if (digits.length === 10) return `+91${digits}`;
    return `+${digits}`;
};

const sendOfficialMessage = async (to, content, userId) => {
    try {
        const dbRes = await pool.query("SELECT id, meta_access_token, meta_phone_id FROM app_users WHERE id = $1", [userId]);
        const { meta_access_token: token, meta_phone_id: phoneId } = dbRes.rows[0] || {};
        if (!token || !phoneId) return { success: false, error: "Missing Meta credentials" };

        const formattedTo = formatToInter(to);
        const cleanTo = formattedTo.replace(/\D/g, "");
        let payload = { messaging_product: "whatsapp", to: cleanTo };
        
        if (typeof content === 'string') {
            payload.type = "text";
            payload.text = { body: content };
        } else {
            Object.assign(payload, content);
        }
        
        const response = await axios.post(`https://graph.facebook.com/v21.0/${phoneId}/messages`, payload, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return { success: true, data: response.data };
    } catch (e) { 
        console.error(`[META-FAILURE] To: ${to} | Error:`, e.response?.data || e.message); 
        return { success: false, error: e.response?.data || e.message };
    }
};

const upsertContact = async (userId, phone, name) => {
    try {
        await pool.query(
            `INSERT INTO marketing_contacts (user_id, phone_number, name, last_order_at) 
             VALUES ($1, $2, $3, NOW()) 
             ON CONFLICT (user_id, phone_number) DO UPDATE SET name = EXCLUDED.name, last_order_at = NOW()`,
            [userId, normalizePhone(phone), name]
        );
    } catch (e) {}
};

const logChat = async (userId, customerNumber, role, text, waMessageId = null) => {
    try {
        await pool.query(
            "INSERT INTO chat_messages (user_id, customer_number, role, text, wa_message_id) VALUES ($1, $2, $3, $4, $5)",
            [userId, normalizePhone(customerNumber), role, text, waMessageId]
        );
    } catch (e) {}
};

const getRecentChats = async (userId) => {
    try {
        const res = await pool.query(
            `SELECT id, customer_number AS "customerNumber", role, text, created_at AS time, is_read
             FROM chat_messages WHERE user_id = $1 AND created_at > NOW() - INTERVAL '7 days'
             ORDER BY created_at ASC LIMIT 1000`,
            [userId]
        );
        return res.rows;
    } catch (e) { return []; }
};

const syncBusinessProfileToWhatsApp = async (userId, bizData) => {
    try {
        const dbRes = await pool.query("SELECT meta_access_token, meta_phone_id FROM app_users WHERE id = $1", [userId]);
        const { meta_access_token: token, meta_phone_id: phoneId } = dbRes.rows[0] || {};
        if (!token || !phoneId) return { success: false, error: "API Config Missing" };
        let payload = {
            messaging_product: "whatsapp",
            description: bizData.address || "",
            about: `Official bot for ${bizData.name}`,
            address: bizData.address || ""
        };
        await axios.post(`https://graph.facebook.com/v21.0/${phoneId}/whatsapp_business_profile`, payload, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
};

const notifyKitchenAndStaff = async (userId, orderRef, customerName, customerNumber, cart, subtotal, total, cgst, sgst, cr, sr, symbol, orderType, address, tableNumber, discountAmount = 0) => {
    try {
        const bizRes = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [userId]);
        const biz = bizRes.rows[0];
        if (!biz) return;

        const kotItemLines = cart.map(i => `  • ${i.qty}x ${i.name}`).join("\n");
        const staffItemLines = cart.map(i => `  • ${i.qty}x ${i.name} — ${symbol}${i.qty * i.price}`).join("\n");
        
        const kot = [
            `🍽️ *====== KITCHEN ORDER TICKET ======*`,
            `*Ref:* ${orderRef}`,
            `*Target:* ${tableNumber ? 'TABLE ' + tableNumber : (orderType.toUpperCase() === 'PICKUP' ? '🥡 PICKUP' : '🛵 DELIVERY')}`,
            `*Customer:* ${customerName}`,
            `*Items:*\n${kotItemLines}`
        ].join("\n");

        const staffMsg = [
            `🔔 *NEW ${orderType.toUpperCase()} ORDER!*`,
            `*Ref:* ${orderRef}`,
            `*Customer:* ${customerName}`,
            `───────────────`,
            staffItemLines,
            `───────────────`,
            `*Total: ${symbol}${total.toFixed(2)}*`
        ].join("\n");

        const kitchenNum = biz.kitchen_number;
        if (kitchenNum) await sendOfficialMessage(kitchenNum, kot, userId);

        const staffNums = biz.notification_numbers || [];
        for (let num of staffNums) {
            await sendOfficialMessage(num, staffMsg, userId);
        }
    } catch (e) { console.error("Notify Kitchen Error:", e); }
};
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const getSession = async (userId, customerNumber) => {
    try {
        const cleanNum = normalizePhone(customerNumber);
        const res = await pool.query(
            "SELECT * FROM conversation_sessions WHERE user_id = $1 AND customer_number = $2",
            [userId, cleanNum]
        );
        if (res.rows.length > 0) {
            const sess = res.rows[0];
            return {
                ...sess,
                context: typeof sess.context === 'string' ? JSON.parse(sess.context) : (sess.context || { cart: [] })
            };
        }
        const newSession = await pool.query(
            "INSERT INTO conversation_sessions (user_id, customer_number, state, context) VALUES ($1, $2, $3, $4) RETURNING *",
            [userId, cleanNum, 'IDLE', JSON.stringify({ cart: [] })]
        );
        return { ...newSession.rows[0], context: { cart: [] } };
    } catch (e) {
        return { state: 'IDLE', context: { cart: [] } };
    }
};

const updateSession = async (userId, customerNumber, state, context) => {
    try {
        await pool.query(
            "UPDATE conversation_sessions SET state = $1, context = $2, updated_at = NOW() WHERE user_id = $3 AND customer_number = $4",
            [state, JSON.stringify(context), userId, normalizePhone(customerNumber)]
        );
    } catch (e) { console.error("Update Session Error:", e); }
};

// ----------------------------------------------------------------------------------
// 📤 Enhanced Message Sending (Buttons/Lists)
// ----------------------------------------------------------------------------------
const sendButtons = async (to, text, buttons, userId) => {
    const formattedButtons = buttons.map((b, i) => ({
        type: "reply",
        reply: { id: b.id || `btn_${i}`, title: b.title }
    }));
    const payload = {
        messaging_product: "whatsapp",
        to: normalizePhone(to),
        type: "interactive",
        interactive: {
            type: "button",
            body: { text },
            action: { buttons: formattedButtons }
        }
    };
    return sendOfficialMessage(to, payload, userId);
};

const sendList = async (to, header, body, buttonTitle, sections, userId) => {
    const payload = {
        messaging_product: "whatsapp",
        to: normalizePhone(to),
        type: "interactive",
        interactive: {
            type: "list",
            header: { type: "text", text: header },
            body: { text: body },
            footer: { text: "Please choose an option from the list below" },
            action: {
                button: buttonTitle,
                sections: sections
            }
        }
    };
    return sendOfficialMessage(to, payload, userId);
};

const sendBrandedText = async (to, title, text, userId) => {
    const brandedText = `🤖 *${title}*\n━━━━━━━━━━━━━━\n${text}`;
    return sendOfficialMessage(to, brandedText, userId);
};

// ----------------------------------------------------------------------------------
// 🧠 CONVERSATIONAL AI ENGINE
// ----------------------------------------------------------------------------------
const processAiAutomations = async (userId, customerNumber, msgText, customerName, isLocation = false, locationData = null) => {
    try {
        const cleanNum = normalizePhone(customerNumber);
        const session = await getSession(userId, customerNumber);
        if (session.is_paused) return;

        const bizRes = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [userId]);
        const biz = bizRes.rows[0];
        if (!biz) return;
        const symbol = biz.currency_code === 'INR' ? '₹' : '$';

        const itemsRes = await pool.query("SELECT product_name, price, description, category FROM business_items WHERE user_id = $1 AND availability = true", [userId]);
        const menu = itemsRes.rows;
        const menuContext = menu.map(i => `${i.product_name}: ${symbol}${i.price}`).join(", ");

        const cart = session.context.cart || [];
        const lower = msgText ? msgText.toLowerCase() : "";

        // --- 📍 HANDLE LOCATION PIN ---
        if (isLocation && session.state === 'AWAITING_LOCATION' && locationData) {
            const { latitude: cLat, longitude: cLon } = locationData;
            let deliveryCharge = 0;
            let distance = 0;

            if (biz.latitude && biz.longitude) {
                distance = calculateDistance(biz.latitude, biz.longitude, cLat, cLon);
                const tiers = typeof biz.delivery_tiers === 'string' ? JSON.parse(biz.delivery_tiers) : (biz.delivery_tiers || []);
                const matched = tiers.find(t => distance >= t.min && distance <= t.max);
                deliveryCharge = matched ? parseFloat(matched.charge) : 0;
            }

            let subtotal = cart.reduce((acc, i) => acc + (i.qty * i.price), 0);
            
            // Tax calc
            const cgstR = parseFloat(biz.cgst_percent) || 0;
            const sgstR = parseFloat(biz.sgst_percent) || 0;
            let cgst = 0, sgst = 0;
            if (biz.gst_included) {
                const r = cgstR + sgstR;
                if (r > 0) { const a = subtotal * (r / (100 + r)); cgst = a * (cgstR / r); sgst = a * (sgstR / r); }
            } else {
                cgst = (subtotal * cgstR) / 100; sgst = (subtotal * sgstR) / 100;
            }
            const total = (biz.gst_included ? subtotal : (subtotal + cgst + sgst)) + deliveryCharge;
            const orderRef = `WA-${Math.random().toString(36).substring(7).toUpperCase()}`;

            // Finalize Order
            await pool.query(
                "INSERT INTO orders (user_id, customer_name, customer_number, address, items, total_price, order_reference, status, delivery_charge) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
                [userId, customerName, cleanNum, `Location [${cLat}, ${cLon}]`, JSON.stringify(cart), total, orderRef, 'PENDING', deliveryCharge]
            );

            // Notify Kitchen
            await notifyKitchenAndStaff(userId, orderRef, customerName, cleanNum, cart, subtotal, total, cgst, sgst, cgstR, sgstR, symbol, 'delivery', `Location [${cLat}, ${cLon}]`, null);

            // Update Loyalty
            const ptsEarnRate = (parseFloat(biz.points_per_100) || 5) / 100;
            const pointsEarned = Math.floor(subtotal * ptsEarnRate) || 0;
            
            // Use normalized phone for DB operations
            const cleanNum = formatToInter(customerNumber);

            await pool.query(
                `INSERT INTO customer_loyalty (user_id, customer_number, points, total_spent, last_visit) 
                 VALUES ($1, $2, $3, $4, NOW()) 
                 ON CONFLICT (user_id, customer_number) 
                 DO UPDATE SET 
                    points = customer_loyalty.points + EXCLUDED.points,
                    total_spent = COALESCE(customer_loyalty.total_spent, 0) + EXCLUDED.total_spent,
                    last_visit = NOW()`,
                [userId, cleanNum, pointsEarned, subtotal]
            );

            await pool.query(
                `INSERT INTO marketing_contacts (user_id, phone_number, name, total_spent, last_order_at)
                 VALUES ($1, $2, $3, $4, NOW())
                 ON CONFLICT (user_id, phone_number)
                 DO UPDATE SET 
                    name = EXCLUDED.name,
                    total_spent = COALESCE(marketing_contacts.total_spent, 0) + EXCLUDED.total_spent,
                    last_order_at = NOW()`,
                [userId, cleanNum, customerName || "WhatsApp Customer", subtotal]
            );

            const receipt = [
                `✅ *Order Confirmed!*`,
                ``,
                cart.map(i => `• ${i.qty}x ${i.name}`).join("\n"),
                `───────────────`,
                `Subtotal: ${symbol}${subtotal.toFixed(2)}`,
                `CGST (${cgstR}%): ${symbol}${cgst.toFixed(2)}`,
                `SGST (${sgstR}%): ${symbol}${sgst.toFixed(2)}`,
                `🚚 Delivery Charge: +${symbol}${deliveryCharge.toFixed(2)}`,
                `*Total: ${symbol}${total.toFixed(2)}*`,
                `_(Prices ${biz.gst_included ? 'include' : 'exclude'} GST)_`,
                `───────────────`,
                `Type: 🚚 Delivery`,
                `Ref: ${orderRef}`,
                ``,
                `🎁 *Loyalty Reward:* You earned *${earned} points*! New balance: *${loyaltyRes.rows[0].points} points*.`,
                ``,
                `Thank you, ${customerName}! We are preparing your order. 🎉`
            ].join("\n");

            await sendBrandedText(customerNumber, biz.name, receipt, userId);
            await updateSession(userId, cleanNum, 'IDLE', { cart: [] });
            return;
        }

        // --- 🔢 HANDLE QUANTITY REPLY ---
        const numMatch = lower.match(/^\d+$/);
        if (numMatch && session.state === 'AWAITING_QUANTITY' && session.context.pending_item) {
            const qty = parseInt(numMatch[0]);
            const item = session.context.pending_item;
            
            const existing = cart.find(i => i.name === item.name);
            if (existing) existing.qty += qty;
            else cart.push({ ...item, qty });

            session.context.cart = cart;
            session.context.pending_item = null;
            
            let cartText = cart.map(i => `• ${i.qty}x ${i.name}`).join("\n");
            let total = cart.reduce((acc, i) => acc + (i.qty * i.price), 0);
            
            const text = `✅ *Excellent choice!* I've added that to your order.\n\n${cartText}\n\n*Total:* ${symbol}${total}\n\nWould you like to confirm this order or add something else?`;
            await sendButtons(customerNumber, text, [
                { id: 'checkout', title: '✅ Confirm Order' },
                { id: 'place_order', title: '➕ Add More' }
            ], userId);
            
            await updateSession(userId, cleanNum, 'IDLE', session.context);
            await logChat(userId, cleanNum, 'bot', text);
            return;
        }

        // --- 🔘 HANDLE BUTTON CLICKS ---
        if (lower === 'place_order' || lower === 'place an order' || lower === 'order now') {
            const text = `🤖 *Order Details*\n\nGreat! Please specify the items you would like to order (e.g., '1x Burger' or just tell me what you want).`;
            await sendOfficialMessage(customerNumber, text, userId);
            await updateSession(userId, cleanNum, 'IDLE', session.context);
            return;
        }

        if (lower === 'checkout' || lower === 'confirm order') {
            if (cart.length === 0) {
                await sendOfficialMessage(customerNumber, "Your bag is empty! Tell me what you'd like to eat first. 😋", userId);
                return;
            }
            const text = `How would you like to receive your delicious meal today?`;
            await sendButtons(customerNumber, text, [
                { id: 'mode_pickup', title: '🥡 Pickup' },
                { id: 'mode_delivery', title: '🚚 Delivery' }
            ], userId);
            await updateSession(userId, cleanNum, 'AWAITING_MODE', session.context);
            return;
        }

        if (lower === 'mode_pickup') {
            const orderRef = `WA-${Math.random().toString(36).substring(7).toUpperCase()}`;
            const subtotal = cart.reduce((acc, i) => acc + (i.qty * i.price), 0);
            
            const cgstR = parseFloat(biz.cgst_percent) || 0;
            const sgstR = parseFloat(biz.sgst_percent) || 0;
            let cgst = 0, sgst = 0;
            if (biz.gst_included) {
                const r = cgstR + sgstR;
                if (r > 0) { const a = subtotal * (r / (100 + r)); cgst = a * (cgstR / r); sgst = a * (sgstR / r); }
            } else {
                cgst = (subtotal * cgstR) / 100; sgst = (subtotal * sgstR) / 100;
            }
            const total = (biz.gst_included ? subtotal : (subtotal + cgst + sgst));

            await pool.query(
                "INSERT INTO orders (user_id, customer_name, customer_number, address, items, total_price, order_reference, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
                [userId, customerName, cleanNum, 'Pickup', JSON.stringify(cart), total, orderRef, 'PENDING']
            );

            await notifyKitchenAndStaff(userId, orderRef, customerName, cleanNum, cart, subtotal, total, cgst, sgst, cgstR, sgstR, symbol, 'pickup', 'Store Pickup', null);

            // Update Loyalty & Contribution
            const earnRate = (parseFloat(biz.points_per_100) || 5) / 100;
            const pointsEarned = Math.floor(subtotal * earnRate) || 0;

            await pool.query(
                `INSERT INTO customer_loyalty (user_id, customer_number, points, total_spent, last_visit) 
                 VALUES ($1, $2, $3, $4, NOW()) 
                 ON CONFLICT (user_id, customer_number) 
                 DO UPDATE SET 
                    points = customer_loyalty.points + EXCLUDED.points,
                    total_spent = COALESCE(customer_loyalty.total_spent, 0) + EXCLUDED.total_spent,
                    last_visit = NOW()`,
                [userId, cleanNum, pointsEarned, subtotal]
            );

            await pool.query(
                `INSERT INTO marketing_contacts (user_id, phone_number, name, total_spent, last_order_at)
                 VALUES ($1, $2, $3, $4, NOW())
                 ON CONFLICT (user_id, phone_number)
                 DO UPDATE SET 
                    name = EXCLUDED.name,
                    total_spent = COALESCE(marketing_contacts.total_spent, 0) + EXCLUDED.total_spent,
                    last_order_at = NOW()`,
                [userId, cleanNum, customerName || "WhatsApp Customer", subtotal]
            );

            const receipt = [
                `✅ *Pickup Order Confirmed!*`,
                ``,
                cart.map(i => `• ${i.qty}x ${i.name}`).join("\n"),
                `───────────────`,
                `*Total: ${symbol}${total.toFixed(2)}*`,
                `Ref: ${orderRef}`,
                ``,
                `Please arrive in 20-30 minutes for pickup. See you soon! 🥡`
            ].join("\n");

            await sendBrandedText(customerNumber, biz.name, receipt, userId);
            await updateSession(userId, cleanNum, 'IDLE', { cart: [] });
            return;
        }

        if (lower === 'mode_delivery') {
            const text = `🚚 *Delivery selected!*\n\nPlease share your delivery address.\n\n📍 You can type it or share your *Live Location* pin.`;
            await sendOfficialMessage(customerNumber, text, userId);
            await updateSession(userId, cleanNum, 'AWAITING_LOCATION', session.context);
            return;
        }

        // --- 🧠 AI INTENT DETECTION ---
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const systemPrompt = `
You are the AI Salesman for "${biz.name}". 
Analyze the user message and extract intents.

MENU: ${menuContext}

OUTPUT ONLY JSON:
{
  "intent": "GREETING" | "ORDER_ITEM" | "CHECKOUT" | "QUESTION" | "OTHER",
  "detected_item": "Item Name" | null,
  "response": "Enthusiastic text response"
}
`;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: msgText }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(completion.choices[0].message.content);

        if (result.intent === 'GREETING' || lower === 'hi' || lower === 'hello' || lower === 'menu') {
            await sendList(customerNumber, "How can we help?", `Welcome to ${biz.name}\n\nHello ${customerName}, it is a pleasure to assist you today.\n\nHow may I help you? You can explore our menu or place an order using the options below.`, "Menu Options", [
                {
                    title: "Ordering",
                    rows: [
                        { id: "place_order", title: "🛍️ Place an Order", description: "Start your meal selection" },
                        { id: "view_menu", title: "📜 View Digital Menu", description: "Browse our full catalog" }
                    ]
                },
                {
                    title: "Help & Rewards",
                    rows: [
                        { id: "enquiry", title: "❓ Dish Enquiry", description: "Ask about ingredients/price" },
                        { id: "loyalty", title: "🎁 Loyalty & Points", description: "Check your rewards" },
                        { id: "support", title: "📞 Contact Support", description: "Speak with our team" }
                    ]
                }
            ], userId);
            return;
        }

        if (result.intent === 'ORDER_ITEM' && result.detected_item) {
            const item = menu.find(i => i.product_name.toLowerCase().includes(result.detected_item.toLowerCase()));
            if (item) {
                const text = `Excellent choice! The *${item.product_name}* is one of our favorites. It is priced at ${symbol}${item.price}.\n\nHow many would you like me to add for you?`;
                await sendBrandedText(customerNumber, biz.name, text, userId);
                session.context.pending_item = { name: item.product_name, price: item.price };
                await updateSession(userId, cleanNum, 'AWAITING_QUANTITY', session.context);
                return;
            }
        }

        // Default
        await sendBrandedText(customerNumber, biz.name, result.response || "I'm here to help! What can I get for you today?", userId);

    } catch (e) { console.error("[AI-ERROR]", e); }
};

const handleMetaWebhook = async (body) => {
    try {
        if (body.object === "whatsapp_business_account") {
            for (const entry of body.entry) {
                const changes = entry.changes[0];
                if (changes.value && changes.value.messages) {
                    const message = changes.value.messages[0];
                    const fromNumber = normalizePhone(message.from);
                    const contactName = changes.value.contacts?.[0]?.profile?.name || "Customer";
                    const metaPhoneId = changes.value.metadata.phone_number_id; 

                    const userRes = await pool.query("SELECT id FROM app_users WHERE meta_phone_id = $1 LIMIT 1", [metaPhoneId]);
                    if (userRes.rows.length === 0) return;
                    const userId = userRes.rows[0].id;

                    let textBody = "";
                    let isLocation = false;
                    let locationData = null;

                    if (message.type === "text") textBody = message.text.body;
                    else if (message.type === "interactive") {
                        if (message.interactive.type === "button_reply") textBody = message.interactive.button_reply.id;
                        else if (message.interactive.type === "list_reply") textBody = message.interactive.list_reply.id;
                    } else if (message.type === "location") {
                        isLocation = true;
                        locationData = message.location;
                    }

                    if (textBody || isLocation) {
                        await upsertContact(userId, fromNumber, contactName);
                        await logChat(userId, fromNumber, 'customer', textBody || "Sent a location pin");
                        await processAiAutomations(userId, fromNumber, textBody, contactName, isLocation, locationData);
                    }
                }
            }
        }
    } catch (e) { console.error("Webhook Error", e); }
};

module.exports = {
  handleMetaWebhook,
  sendOfficialMessage,
  getRecentChats,
  logChat,
  notifyKitchenAndStaff,
  syncBusinessProfileToWhatsApp,
  processAiAutomations
};
