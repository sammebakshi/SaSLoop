const pool = require("./db");
const Groq = require("groq-sdk");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { isBusinessOpen, getDeliveryDetails } = require("./utils/businessUtils");

const normalizePhone = (p) => {
    if (!p) return "";
    let digits = p.replace(/\D/g, "");
    // If it starts with 91 but has 12 digits, keep it. 
    // If it has 10 digits, it's a local number, we leave it for formatToInter to handle.
    return digits;
};

const formatToInter = (p) => {
    if (!p) return "";
    const digits = p.replace(/\D/g, "");
    if (digits.length === 10) return `91${digits}`;
    return digits;
};

const sendOfficialMessage = async (to, content, userId) => {
    try {
        const dbRes = await pool.query("SELECT id, meta_access_token, meta_phone_id FROM app_users WHERE id = $1", [userId]);
        const { meta_access_token: token, meta_phone_id: phoneId } = dbRes.rows[0] || {};
        if (!token || !phoneId) return { success: false, error: "Missing Meta credentials" };

        const cleanTo = formatToInter(to);
        let payload = { messaging_product: "whatsapp", recipient_type: "individual", to: cleanTo };
        
        if (typeof content === 'string') {
            payload.type = "text";
            payload.text = { body: content };
        } else if (content.templateName) {
            // New Template Support
            payload.type = "template";
            payload.template = {
                name: content.templateName,
                language: { code: content.lang || "en" },
                components: [
                    {
                        type: "body",
                        parameters: (content.params || []).map(p => ({ type: "text", text: String(p) }))
                    }
                ]
            };
        } else if (content.imageUrl && content.button) {
            // Interactive message with Image header and CTA button
            payload.type = "interactive";
            payload.interactive = {
                type: "button",
                header: { type: "image", image: { link: content.imageUrl } },
                body: { text: content.message || "Message from SaSLoop" },
                action: {
                    buttons: [
                        { type: "reply", reply: { id: "cta_btn", title: content.button.text || "Click Here" } }
                    ]
                }
            };
        } else if (content.imageUrl) {
            payload.type = "image";
            payload.image = { link: content.imageUrl, caption: content.message || "" };
        } else if (content.button) {
            payload.type = "interactive";
            payload.interactive = {
                type: "button",
                body: { text: content.message || "Message from SaSLoop" },
                action: {
                    buttons: [
                        { type: "reply", reply: { id: "cta_btn", title: content.button.text || "Click Here" } }
                    ]
                }
            };
        } else {
            Object.assign(payload, content);
        }
        
        const response = await axios.post(`https://graph.facebook.com/v21.0/${phoneId}/messages`, payload, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        // --- 📝 LOG OUTGOING BOT MESSAGE ---
        if (!content.skipLog) {
            let logText = "";
            if (typeof content === 'string') logText = content;
            else if (content.templateName) logText = `[Template: ${content.templateName}]`;
            else if (content.text) logText = content.text.body;
            else if (content.interactive) {
                const i = content.interactive;
                logText = `[Bot Action] ${i.body ? i.body.text : (i.header ? i.header.text : 'Interactive message')}`;
            }

            if (logText) {
                await pool.query(
                    "INSERT INTO chat_messages (user_id, customer_number, role, text) VALUES ($1, $2, $3, $4)",
                    [userId, normalizePhone(to), 'bot', logText]
                );
            }
        }

        return { success: true, data: response.data };
    } catch (e) { 
        console.error(`[META-FAILURE] To: ${to} | Error:`, e.response?.data || e.message); 
        return { success: false, error: e.response?.data || e.message };
    }
};
const deductInventory = async (userId, cart) => {
    try {
        const bizRes = await pool.query("SELECT name, notification_numbers FROM restaurants WHERE user_id = $1", [userId]);
        const biz = bizRes.rows[0];
        const staffNums = biz?.notification_numbers || [];

        for (const item of cart) {
            const itemName = item.name || item.product_name;
            const res = await pool.query(
                `UPDATE business_items 
                 SET stock_count = GREATEST(stock_count - $1, 0),
                     availability = CASE WHEN GREATEST(stock_count - $1, 0) = 0 THEN false ELSE availability END
                 WHERE user_id = $2 AND product_name = $3 AND stock_count IS NOT NULL
                 RETURNING stock_count`,
                [item.qty || 1, userId, itemName]
            );

            if (res.rows.length > 0) {
                const newStock = res.rows[0].stock_count;
                if (newStock < 5 && staffNums.length > 0) {
                    const alertMsg = `⚠️ *LOW STOCK ALERT!* \n━━━━━━━━━━━━━━\n📦 *Item:* ${itemName}\n📉 *Remaining:* ${newStock} units\n🏢 *Business:* ${biz.name}\n\nPlease restock this item soon!`;
                    for (const num of staffNums) {
                        await sendOfficialMessage(num, { text: { body: alertMsg }, skipLog: true }, userId);
                    }
                }
            }
        }
    } catch (e) {
        console.error("Failed to deduct inventory:", e);
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

        const kotItemLines = cart.map(i => `  • ${i.qty || i.quantity || 1}x ${i.product_name || i.name || 'Item'}`).join("\n");
        const staffItemLines = cart.map(i => `  • ${i.qty || i.quantity || 1}x ${i.product_name || i.name || 'Item'} — ${symbol}${( (i.qty || i.quantity || 1) * (i.price || 0) ).toFixed(2)}`).join("\n");
        
        const kot = [
            `🍽️ *====== KITCHEN ORDER TICKET ======*`,
            `*Ref:* ${orderRef}`,
            `*Target:* ${tableNumber ? 'TABLE ' + tableNumber : (orderType.toUpperCase() === 'PICKUP' ? '🥡 PICKUP' : '🛵 DELIVERY')}`,
            `*Customer:* ${customerName}`,
            `*Items:*\n${kotItemLines}`
        ].join("\n");

        // Honor GST visibility setting for staff alerts too if needed, but usually staff need full details.
        // However, we'll keep it simple for staff.
        const staffMsg = [
            `🔔 *NEW ${orderType.toUpperCase()} ORDER!*`,
            `*Ref:* ${orderRef}`,
            `*Customer:* ${customerName} (${customerNumber})`,
            `*Target:* ${tableNumber ? 'TABLE ' + tableNumber : (orderType.toUpperCase() === 'PICKUP' ? '🥡 PICKUP' : '🛵 DELIVERY')}`,
            `*Address:* ${address || 'N/A'}`,
            `───────────────`,
            staffItemLines,
            `───────────────`,
            `*Subtotal:* ${symbol}${subtotal.toFixed(2)}`,
            `*Total: ${symbol}${total.toFixed(2)}*`
        ].join("\n");

        const kitchenNum = biz.kitchen_number;
        if (kitchenNum) await sendOfficialMessage(kitchenNum, { text: { body: kot }, skipLog: true }, userId);
 
        const staffNums = biz.notification_numbers || [];
        for (let num of staffNums) {
            await sendOfficialMessage(num, { text: { body: staffMsg }, skipLog: true }, userId);
        }

        // 📦 Deduct stock on successful notification
        await deductInventory(userId, cart);
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
        const lower = msgText.trim().toLowerCase();
        const cleanNum = normalizePhone(customerNumber);
        
        // --- 🔍 FETCH BIZ DATA FIRST (For Hours Check) ---
        const bizRes = await pool.query(
            `SELECT r.*, u.bot_knowledge 
             FROM restaurants r 
             JOIN app_users u ON r.user_id = u.id 
             WHERE r.user_id = $1`, 
            [userId]
        );
        const biz = bizRes.rows[0];
        if (!biz) return;

        // --- 🛡️ CHECK IF BLOCKED ---
        const contactRes = await pool.query("SELECT is_blocked FROM marketing_contacts WHERE user_id = $1 AND phone_number = $2", [userId, cleanNum]);
        if (contactRes.rows[0]?.is_blocked) {
            console.log(`🚫 IGNORING BLOCKED CUSTOMER: ${cleanNum}`);
            return;
        }

        // --- 🕒 CHECK BUSINESS HOURS (Mandatory for all messages) ---
        const bizStatus = isBusinessOpen(biz.settings);
        if (!bizStatus.isOpen) {
            const closedMsg = `😴 *We are currently CLOSED*\n━━━━━━━━━━━━━━\nOur business hours are *${bizStatus.openingTime}* to *${bizStatus.closingTime}*.\n\nPlease visit us during our working hours. Thank you! 🙏`;
            await sendOfficialMessage(customerNumber, closedMsg, userId);
            return;
        }

        // --- 🏠 HARDCODED GREETING (Save AI Tokens & Promote VIP) ---
        const greetings = ['hi', 'hello', 'hey', 'hi there', 'greetings', 'namaste', 'asalam', 'adaab'];
        if (greetings.includes(lower)) {
            const bizName = biz.name || "our restaurant";
            
            // Check if customer exists in loyalty
            const customerRes = await pool.query("SELECT * FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2", [userId, cleanNum]);
            const existing = customerRes.rows[0];

            if (existing) {
                // EXISTING CUSTOMER: Show "Welcome Back" + List
                const welcomeText = `🏠 *Welcome back to ${bizName}!*\n\nHello ${existing.name || 'friend'}, how may I assist you today? 🌟\n\nYou can explore our menu or place an order using the options below. 👇`;
                
                const sections = [
                    {
                        title: "🛒 Ordering Options",
                        rows: [
                            { id: "place_order", title: "🛍️ Place an Order", description: "Quick selection of your favorites 🍔 🥤" },
                            { id: "view_menu", title: "📜 View Digital Menu", description: "Browse our full catalog & deals 🍕 🍰" }
                        ]
                    },
                    {
                        title: "💎 Help & Rewards",
                        rows: [
                            { id: "enquiry", title: "❓ Dish Enquiry", description: "Ask about ingredients or prices 🍲" },
                            { id: "loyalty_check", title: "🎁 Loyalty & Points", description: "Check your rewards balance 💎" },
                            { id: "support", title: "📞 Contact Support", description: "Speak with our friendly team 👷" }
                        ]
                    }
                ];

                await sendList(customerNumber, "How can we help? ✨", welcomeText, "✨ Open Main Menu ✨", sections, userId);
                await logChat(userId, cleanNum, 'bot', welcomeText);
            } else {
                // NEW CUSTOMER: Show VIP Offer + Buttons
                const welcomeText = `👋 *Hello! Welcome to ${bizName}* 🍽️\n\nI am your AI assistant. I can help you view our menu, place an order, or answer questions about our food.\n\n🎁 *SPECIAL OFFER:* Join our *VIP Club* today and get *50 Points* instantly! 🎊\n\n*What would you like to do today?*`;
                
                await sendButtons(customerNumber, welcomeText, [
                    { id: 'join_loyalty', title: '🎁 Join VIP (+50 Pts)' },
                    { id: 'view_menu', title: '📜 View Menu' },
                    { id: 'place_order', title: '🛍️ Place Order' }
                ], userId);
                await logChat(userId, cleanNum, 'bot', welcomeText);
            }
            return;
        }

        const session = await getSession(userId, cleanNum);
        
        const botCommands = ['place_order', 'place an order', 'order now', 'view_menu', 'enquiry', 'loyalty', 'loyalty_check', 'support', 'get_otp', 'get otp'];
        if (session.is_paused) {
            if (botCommands.includes(lower)) {
                await pool.query("UPDATE conversation_sessions SET is_paused = false WHERE user_id = $1 AND customer_number = $2", [userId, cleanNum]);
                session.is_paused = false;
            } else {
                return;
            }
        }

        if (lower === 'get_otp' || lower === 'get otp') {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
            await pool.query("DELETE FROM loyalty_otps WHERE user_id = $1 AND customer_number = $2", [userId, cleanNum]);
            await pool.query("INSERT INTO loyalty_otps (user_id, customer_number, otp_code, expires_at) VALUES ($1, $2, $3, $4)", [userId, cleanNum, otp, expiresAt]);
            await sendOfficialMessage(customerNumber, `🔐 *Your Verification Code*\n\nYour OTP for SaSLoop is: *${otp}*\n\nPlease enter this code on the menu screen.`, userId);
            return;
        }

        const symbol = biz.currency_code === 'INR' ? '₹' : '$';

        const itemsRes = await pool.query("SELECT product_name, price, description, category FROM business_items WHERE user_id = $1 AND availability = true", [userId]);
        const menu = itemsRes.rows;
        const menuContext = menu.map(i => `• ${i.product_name} [${i.category}]: ${symbol}${i.price} (${i.description || 'Specialty of the house'})`).join("\n");

        const cart = session.context.cart || [];

        // --- 📍 HANDLE LOCATION PIN ---
        if (isLocation && session.state === 'AWAITING_LOCATION' && locationData) {
            const { latitude: cLat, longitude: cLon } = locationData;
            
            const delivery = await getDeliveryDetails(biz, cLat, cLon);
            if (!delivery.serviceable) {
                const unserviceableMsg = `📍 *Outside Service Area*\n━━━━━━━━━━━━━━\nSorry! Your location is ${delivery.distance.toFixed(1)}km away, which is outside our ${delivery.radius}km delivery radius.\n\nWould you like to switch to *Pickup* instead?`;
                await sendButtons(customerNumber, unserviceableMsg, [
                    { id: 'mode_pickup', title: '🥡 Switch to Pickup' },
                    { id: 'checkout', title: '❌ Cancel' }
                ], userId);
                return;
            }

            const deliveryCharge = delivery.charge;
            const distance = delivery.distance;

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
            
            // Calculate bill but DO NOT finalize yet (Wait for confirmation)
            const customerAddress = `Location [${cLat}, ${cLon}]`;
            const pendingBill = [
                `📋 *ORDER SUMMARY*`,
                ``,
                cart.map(i => `• ${i.qty}x ${i.name}`).join("\n"),
                `───────────────`,
                `Subtotal: ${symbol}${subtotal.toFixed(2)}`
            ];

            if (biz.show_gst_on_receipt) {
                pendingBill.push(`CGST (${cgstR}%): ${symbol}${cgst.toFixed(2)}`);
                pendingBill.push(`SGST (${sgstR}%): ${symbol}${sgst.toFixed(2)}`);
            }

            pendingBill.push(`🚚 Delivery Charge: +${symbol}${deliveryCharge.toFixed(2)}`);
            pendingBill.push(`*Total Payable: ${symbol}${total.toFixed(2)}*`);
            pendingBill.push(`───────────────`);
            pendingBill.push(`📍 Address: ${customerAddress}`);
            pendingBill.push(``);
            pendingBill.push(`Would you like to confirm this order?`);

            const billText = pendingBill.join("\n");
            
            // Store pending details in session
            await updateSession(userId, cleanNum, 'AWAITING_ORDER_CONFIRMATION', {
                ...session.context,
                pendingOrder: {
                    items: cart,
                    subtotal,
                    total,
                    cgst,
                    sgst,
                    deliveryCharge,
                    address: customerAddress,
                    type: 'DELIVERY'
                }
            });

            await sendButtons(customerNumber, billText, [
                { id: 'confirm_delivery_order', title: '✅ Confirm Order' },
                { id: 'place_order', title: '❌ Cancel' }
            ], userId);
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
        if (lower === 'cancel' || lower === 'clear cart' || lower.includes('cancel')) {
            await updateSession(userId, cleanNum, 'IDLE', { cart: [] });
            await sendOfficialMessage(customerNumber, "🗑️ *Cart Cleared!*\n\nYour session has been reset and your bag is empty. How can I help you today?", userId);
            return;
        }

        if (lower.startsWith('order_')) {
            const itemName = msgText.substring(6); // Extract name after 'order_'
            const item = menu.find(i => i.product_name === itemName);
            if (item) {
                const text = `Perfect! I've selected the *${item.product_name}* for you.\n\nHow many would you like me to add?`;
                await sendBrandedText(customerNumber, biz.name, text, userId);
                session.context.pending_item = { name: item.product_name, price: item.price };
                await updateSession(userId, cleanNum, 'AWAITING_QUANTITY', session.context);
                return;
            }
        }

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
            
            const fo = biz.fulfillment_options || { pickup: true, delivery: true };
            const buttons = [];
            if (fo.pickup) buttons.push({ id: 'mode_pickup', title: '🥡 Pickup' });
            if (fo.delivery) buttons.push({ id: 'mode_delivery', title: '🚚 Delivery' });
            
            if (buttons.length === 0) {
                await sendOfficialMessage(customerNumber, "Sorry, we are currently not accepting new orders online. Please contact us for more info.", userId);
                return;
            }

            const text = `How would you like to receive your delicious meal today?`;
            await sendButtons(customerNumber, text, buttons, userId);
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

            const initialStatus = 'AWAITING_PAYMENT'; // Assuming online for now or checking payment method if added to AI later

            await pool.query(
                "INSERT INTO orders (user_id, customer_name, customer_number, address, items, total_price, order_reference, status, payment_method) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
                [userId, customerName, cleanNum, 'Pickup', JSON.stringify(cart), total, orderRef, initialStatus, 'UPI']
            );

            await deductInventory(userId, cart);

            // Skip immediate KOT for online payment orders
            // if (isCOD) { ... }

            // 🏆 Update CRM (With Safety Guard)
            try {
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
            } catch (lErr) { console.error("CRM Background Fail:", lErr); }

            const receiptRows = [
                `✅ *Pickup Order Confirmed!*`,
                ``,
                cart.map(i => `• ${i.qty}x ${i.name}`).join("\n"),
                `───────────────`,
                `Subtotal: ${symbol}${subtotal.toFixed(2)}`
            ];

            if (biz.show_gst_on_receipt) {
                receiptRows.push(`CGST (${cgstR}%): ${symbol}${cgst.toFixed(2)}`);
                receiptRows.push(`SGST (${sgstR}%): ${symbol}${sgst.toFixed(2)}`);
                receiptRows.push(`_(Prices ${biz.gst_included ? 'include' : 'exclude'} GST)_`);
            }

            const baseUrl = process.env.BACKEND_URL || 'https://sasloop.in';
            const paymentLink = `${baseUrl}/api/public/payment-redirect/${orderRef}`;

            receiptRows.push(`*Total: ${symbol}${total.toFixed(2)}*`);
            receiptRows.push(`Ref: ${orderRef}`);
            receiptRows.push(``);
            receiptRows.push(`💳 *Pay Online:* ${paymentLink}`);
            receiptRows.push(``);
            receiptRows.push(`Please arrive in 20-30 minutes for pickup. See you soon! 🥡`);

            const receipt = receiptRows.join("\n");

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

        if (lower === 'confirm_delivery_order') {
            const pending = session.context.pendingOrder;
            if (!pending) return;

            const orderRef = `W${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
            
            await pool.query(
                "INSERT INTO orders (user_id, customer_name, customer_number, address, items, total_price, order_reference, status, delivery_charge, payment_method) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
                [userId, customerName || "WhatsApp Customer", cleanNum, pending.address, JSON.stringify(pending.items), pending.total, orderRef, 'AWAITING_PAYMENT', pending.deliveryCharge, 'UPI']
            );

            await deductInventory(userId, pending.items);

            // Skip immediate KOT for online payment orders
            // try { ... }

            const frontendBaseUrl = process.env.FRONTEND_URL || 'https://sasloop.in';
            const backendBaseUrl = process.env.BACKEND_URL || 'https://sasloop.in';
            const trackingLink = `${frontendBaseUrl}/track/${orderRef}`;
            const paymentLink = `${backendBaseUrl}/api/public/payment-redirect/${orderRef}`;

            const receipt = [
                `✅ *Order Confirmed!*`,
                `Ref: ${orderRef}`,
                `───────────────`,
                `💳 *Pay Now:* ${paymentLink}`,
                `📍 *Live Tracking:* ${trackingLink}`,
                `───────────────`,
                `Your order is being sent to the kitchen after you click pay. Thank you! 🎉`
            ].join("\n");

            await sendOfficialMessage(customerNumber, receipt, userId);
            await updateSession(userId, cleanNum, 'IDLE', { cart: [] });
            return;
        }

        if (lower === 'join_loyalty') {
            try {
                await pool.query(
                    `INSERT INTO customer_loyalty (user_id, customer_number, name, points) 
                     VALUES ($1, $2, $3, 50) 
                     ON CONFLICT (user_id, customer_number) DO NOTHING`,
                    [userId, cleanNum, customerName || "Customer"]
                );
                const successMsg = `🎉 *Congratulations!* You've joined our VIP Club.\n\n*50 Points* have been added to your account. 🎊\n\nHow can I help you today?`;
                await sendButtons(customerNumber, successMsg, [
                    { id: 'place_order', title: '🛍️ Place an Order' },
                    { id: 'view_menu', title: '📜 View Menu' }
                ], userId);
            } catch (e) {
                await sendOfficialMessage(customerNumber, "Welcome to the club! How can I help you today?", userId);
            }
            return;
        }

        // --- 📋 HANDLE LIST REPLIES ---
        if (lower === 'view_menu') {
            let menuLink = biz.settings?.menuLink || biz.social_website;
            
            // Fallback to Knowledge Base search if still empty
            if (!menuLink && biz.bot_knowledge) {
                const linkMatch = biz.bot_knowledge.match(/https?:\/\/[^\s]+/);
                if (linkMatch) menuLink = linkMatch[0];
            }
            
            const baseUrl = process.env.FRONTEND_URL || 'https://comply-lagged-concave.ngrok-free.dev';
            if (!menuLink) menuLink = `${baseUrl}/menu/${biz.id}`;

            const text = `📜 *Our Digital Menu*\n━━━━━━━━━━━━━━\n\nYou can browse our full catalog and see all the latest flavors here:\n\n🔗 ${menuLink}\n\nAnything else I can help you with?`;
            await sendOfficialMessage(customerNumber, text, userId);
            return;
        }

        if (lower === 'loyalty' || lower === 'loyalty_check') {
            const loyaltyRes = await pool.query("SELECT points FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2", [userId, cleanNum]);
            const points = loyaltyRes.rows[0]?.points || 0;
            const text = `🎁 *Your Rewards*\n━━━━━━━━━━━━━━\n\nTotal Points Available: *${points} pts*\n\nYou can use these points for discounts on your future orders! 🎊`;
            await sendButtons(customerNumber, text, [
                { id: 'place_order', title: '🛍️ Place an Order' },
                { id: 'view_menu', title: '📜 View Menu' }
            ], userId);
            return;
        }

        if (lower === 'support' || lower === 'talk to human' || lower === 'human' || lower === 'agent') {
            const supportNum = biz.settings?.customerSupport || biz.phone || biz.contact_number;
            const text = `📞 *Connecting to Support...*\n━━━━━━━━━━━━━━\n\nI have paused my automated responses. A member of our team will assist you shortly.\n\nFor immediate help, you can also Call/WhatsApp: ${supportNum}\n\n🙏`;
            await sendOfficialMessage(customerNumber, text, userId);
            
            await updateSession(userId, cleanNum, 'PAUSED', { ...session.context, is_paused: true });
            await pool.query("UPDATE conversation_sessions SET is_paused = true WHERE user_id = $1 AND customer_number = $2", [userId, cleanNum]);
            
            // Notify staff
            const staffNums = biz.notification_numbers || [];
            for (let num of staffNums) {
                await sendOfficialMessage(num, `🚨 *Support Needed!*\nCustomer ${customerName || customerNumber} has requested human assistance. Please check the dashboard.`, userId);
            }
            return;
        }

        if (lower === 'enquiry') {
            const text = `❓ *Dish Enquiry*\n━━━━━━━━━━━━━━\n\nSure! Please type the name of the dish or ask me anything about our ingredients and prices. I'm here to help!`;
            await sendOfficialMessage(customerNumber, text, userId);
            return;
        }

        // --- ⚡ FAST-TRACK MATCHING (Bypass AI for simple keywords) ---
        const simpleLower = lower.trim();
        
        // Skip keyword search if it's a simple greeting or too short
        const isGreeting = greetings.includes(simpleLower);
        const isTooShort = simpleLower.length < 3;

        const directMatches = (isGreeting || isTooShort) ? [] : menu.filter(i => 
            i.product_name.toLowerCase() === simpleLower || 
            (i.category && i.category.toLowerCase() === simpleLower) || 
            (i.sub_category && i.sub_category.toLowerCase() === simpleLower) ||
            (simpleLower.length >= 3 && i.product_name.toLowerCase().includes(simpleLower))
        );

        if (directMatches.length > 0) {
            console.log(`⚡ Fast-Track Match Found for: ${simpleLower}`);
            
            // If there's only truly one item, proceed. 
            // If there are multiple (variants or category match), show the list.
            if (directMatches.length === 1) {
                const item = directMatches[0];
                const text = `Excellent choice! The *${item.product_name}* is priced at ${symbol}${item.price}.\n\nHow many would you like me to add for you?`;
                await sendBrandedText(customerNumber, biz.name, text, userId);
                session.context.pending_item = { name: item.product_name, price: item.price };
                await updateSession(userId, cleanNum, 'AWAITING_QUANTITY', session.context);
            } else {
                // Multi-variant Text List (Bypasses 10-item limit)
                const matches = directMatches;
                let responseText = `🤔 *Which ${simpleLower} would you like?*\n━━━━━━━━━━━━━━\n\n`;
                matches.forEach(m => {
                    responseText += `• *${m.product_name}* - ${symbol}${m.price}\n`;
                });
                await sendBrandedText(customerNumber, biz.name, responseText, userId);
            }
            return;
        }

        // --- ⚡ FAST ENQUIRY (Handles availability and price directly) ---
        if (lower.includes('available') || lower.includes('price') || lower.includes('cost') || lower.includes('have')) {
            const query = lower.replace(/is|available|price|of|cost|what|do|you|have/g, '').trim();
            if (query.length > 2) {
                const match = menu.find(i => i.product_name.toLowerCase().includes(query) || query.includes(i.product_name.toLowerCase()));
                if (match) {
                    const status = match.availability ? "✅ *Available*" : "❌ *Currently Out of Stock*";
                    const reply = `🤖 *Dish Enquiry*\n━━━━━━━━━━━━━━\n📦 *Item:* ${match.product_name}\n💰 *Price:* ${symbol}${match.price}\n✨ *Status:* ${status}\n\nWould you like to add this to your order?`;
                    await sendButtons(customerNumber, reply, [
                        { id: `order_${match.product_name}`, title: `🛒 Order ${match.product_name}` },
                        { id: 'place_order', title: '🛍️ Browse More' }
                    ], userId);
                    return;
                }
            }
        }

        // --- 🧠 ADVANCED AI SALESMAN ENGINE ---
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const cartSummary = cart.length > 0 ? cart.map(i => `${i.qty}x ${i.name}`).join(", ") : "Empty";
        
        const systemPrompt = `
You are the "Master Sales Executive" for ${biz.name}. Your goal is to provide a premium, helpful, and sales-driven experience.
You are talking to ${customerName}.

CONTEXT:
- Current Cart: ${cartSummary}
- Business Knowledge: ${biz.bot_knowledge || 'No specific extra info.'}
- Menu Items:
${menuContext}

YOUR PERSONALITY:
- Enthusiastic, professional, and slightly witty.
- You are a REALISTIC salesman. If someone orders a main course, suggest a drink or a popular side.
- Use emojis effectively but professionally.
- IMPORTANT: Shahe Tehzeeb only serves Mutton, Chicken, and Veg items. We NEVER sell Beef or any other meat. If asked, politely inform the customer about our specialization in Mutton, Chicken, and Veg.

YOUR MISSION:
1. Extract ALL items and quantities mentioned by the user. 
   - If the user says "Rista 50", they likely mean 50x Rista.
   - If they say "1 chicken burger", extract { "name": "Chicken Burger", "quantity": 1 }.
2. Match items AGAINST the menu list provided. If an item is NOT in the menu, do NOT include it in the "items" array.
3. If an item matches multiple menu items, pick the closest match.
4. If the user is just greeting, welcome them warmly and suggest a best-seller.
5. If they want to checkout, encourage them but maybe mention a "must-try" dessert first.
6. If the user wants to book a table, ask for date, time, and guest count. If they provide it, mark intent as RESERVATION and fill the reservation object.
7. DO NOT get confused by point-related keywords. Only handle loyalty if the intent is explicitly CHECK_POINTS.

RULES for JSON Output:
- "intent": "ORDER_ITEM" (if they list items), "GREETING", "CHECKOUT", "ENQUIRY", "RESERVATION", "FEEDBACK", or "UNKNOWN".
- "items": Array of { "name": "Exact Name from Menu", "quantity": number }. Only include items found in the menu.
- "reservation": { "date": "YYYY-MM-DD", "time": "HH:MM", "guests": number } (ONLY IF intent is RESERVATION and user provided details)
- "feedback": { "rating": number, "comment": string } (ONLY IF intent is FEEDBACK. If user didn't give a number but the text is positive like 'Good food', assume rating 5. If negative, assume 1 or 2.)
- "human_reply": A conversational, sales-driven response. If you added items, confirm them enthusiastically.
- "upsell_suggestion": A short, tempting suggestion for one additional item they haven't ordered yet.

RETURN ONLY JSON:
{
  "intent": "ORDER_ITEM" | "GREETING" | "CHECKOUT" | "ENQUIRY" | "RESERVATION" | "FEEDBACK" | "UNKNOWN",
  "items": [{ "name": string, "quantity": number }],
  "reservation": { "date": string, "time": string, "guests": number },
  "feedback": { "rating": number, "comment": string },
  "human_reply": string,
  "upsell_suggestion": string
}
`;

        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: msgText }
                ],
                model: "llama-3.3-70b-versatile",
                response_format: { type: "json_object" }
            });

            const result = JSON.parse(completion.choices[0].message.content);
            console.log("🤖 AI Salesman Result:", result);

            if (result.intent === 'GREETING' || lower === 'hi' || lower === 'hello' || lower === 'menu') {
                // --- 🎁 CHECK FOR NEW CUSTOMER LOYALTY ---
                const loyaltyCheck = await pool.query("SELECT id FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2", [userId, cleanNum]);
                if (loyaltyCheck.rows.length === 0) {
                    const welcomeMsg = `👋 *Welcome to ${biz.name}!* ✨\n\n${result.human_reply || "Hello! It is a pleasure to meet you. 😊"}\n\n🎁 *VIP Welcome Gift:* Join our club today and get *50 Points* instantly! 🎈🎊`;
                    await sendButtons(customerNumber, welcomeMsg, [
                        { id: 'join_loyalty', title: '🎁 Claim 50 Points' },
                        { id: 'place_order', title: '🛍️ Browse Menu' }
                    ], userId);
                    return;
                }

                // Standard Professional List Menu
                await sendList(customerNumber, "How can we help? ✨", `🏠 *Welcome back to ${biz.name}!* \n\nHello ${customerName}, how may I assist you today? 🌟 \n\nYou can explore our menu or place an order using the options below. 👇`, "✨ Open Main Menu ✨", [
                    {
                        title: "🛒 Ordering Options",
                        rows: [
                            { id: "place_order", title: "🛍️ Place an Order", description: "Quick selection of your favorites 🍔🥤" },
                            { id: "view_menu", title: "📜 View Digital Menu", description: "Browse our full catalog & deals 🍕🍰" }
                        ]
                    },
                    {
                        title: "💎 Help & Rewards",
                        rows: [
                            { id: "enquiry", title: "❓ Dish Enquiry", description: "Ask about ingredients or prices 🍲" },
                            { id: "loyalty", title: "🎁 Loyalty & Points", description: "Check your rewards balance 💎" },
                            { id: "support", title: "📞 Contact Support", description: "Speak with our friendly team 👩‍💻" }
                        ]
                    }
                ], userId);
                return;
            }

               if (result.intent === 'FEEDBACK') {
                if (result.feedback && result.feedback.rating) {
                    await pool.query(
                        "INSERT INTO customer_feedback (user_id, customer_number, rating, comment) VALUES ($1, $2, $3, $4)",
                        [userId, cleanNum, result.feedback.rating, result.feedback.comment || result.human_reply || ""]
                    );
                    const reviewLink = biz.settings?.googleReviewLink;
                    let msg = `Thank you for your rating of ${result.feedback.rating} out of 5! 🌟 We truly appreciate your feedback.`;
                    
                    if ((result.feedback.rating >= 4 || !result.feedback.rating) && reviewLink) {
                        msg += `\n\n🌟 *Could you help us grow?* \nSince you enjoyed it, we would love a quick review on Google! It takes 10 seconds:\n👉 ${reviewLink}`;
                    } else if (result.feedback.rating > 0 && result.feedback.rating < 4) {
                        msg += `\n\n🙏 *We hear you.* We'll share your comments with our kitchen team to improve. Thank you for being honest!`;
                    }
                    await sendOfficialMessage(customerNumber, msg, userId);
                } else {
                    await sendOfficialMessage(customerNumber, result.human_reply || "Thank you for your feedback!", userId);
                }
                return;
            }

            if (result.intent === 'RESERVATION') {
                if (result.reservation && result.reservation.date && result.reservation.time && result.reservation.guests) {
                    await pool.query(
                        "INSERT INTO reservations (user_id, customer_name, customer_number, guests, reservation_date, reservation_time) VALUES ($1, $2, $3, $4, $5, $6)", 
                        [userId, customerName || "Customer", cleanNum, result.reservation.guests, result.reservation.date, result.reservation.time]
                    );
                    const msg = `✅ *Table Reserved!*\n━━━━━━━━━━━━━━\n\nWe have booked a table for *${result.reservation.guests} guests* on *${result.reservation.date}* at *${result.reservation.time}*.\n\nWe look forward to hosting you!`;
                    await sendOfficialMessage(customerNumber, msg, userId);
                } else {
                    await sendOfficialMessage(customerNumber, result.human_reply || "I'd love to help book a table. For what date, time, and how many guests?", userId);
                }
                return;
            }

            if (result.intent === 'ORDER_ITEM' && result.items && result.items.length > 0) {
                let addedSummary = [];
                let newCart = [...cart];

                for (const aiItem of result.items) {
                    // Fuzzy Match: Exact -> Includes -> Partial
                    const item = menu.find(i => 
                        i.product_name.toLowerCase() === aiItem.name.toLowerCase() ||
                        i.product_name.toLowerCase().includes(aiItem.name.toLowerCase()) ||
                        aiItem.name.toLowerCase().includes(i.product_name.toLowerCase())
                    );
                    
                    if (item) {
                        const qty = aiItem.quantity || 1;
                        const existing = newCart.find(c => c.name === item.product_name);
                        if (existing) {
                            existing.qty += qty;
                        } else {
                            newCart.push({ name: item.product_name, qty, price: item.price });
                        }
                        addedSummary.push(`${qty}x *${item.product_name}*`);
                    }
                }

                if (addedSummary.length > 0) {
                    session.context.cart = newCart;
                    await updateSession(userId, cleanNum, 'IDLE', session.context);

                    const cartTotal = newCart.reduce((sum, item) => sum + (item.qty * item.price), 0);
                    let responseText = `${result.human_reply}\n\n✅ *Added to Bag:*\n${addedSummary.join('\n')}\n\n💰 *Bag Total: ${symbol}${cartTotal.toFixed(2)}*`;
                    
                    if (result.upsell_suggestion) {
                        responseText += `\n\n✨ *Chef's Recommendation:* \n${result.upsell_suggestion}`;
                    }

                    await sendButtons(customerNumber, responseText, [
                        { id: 'checkout', title: '🛒 Checkout Now' },
                        { id: 'place_order', title: '➕ Add More' }
                    ], userId);
                    return;
                }
            }

            // Fallback for ENQUIRY or GREETING (with non-empty cart) or UNKNOWN
            const finalReply = result.human_reply || "I'm here to help! What can I get for you today?";
            await sendOfficialMessage(customerNumber, finalReply, userId);

        } catch (aiErr) {
            console.error("[AI-ERROR]", aiErr);
            await sendOfficialMessage(customerNumber, "I'm having a bit of trouble processing that, but I'm here! What would you like to order?", userId);
        }

    } catch (e) { console.error("[AI-ERROR]", e); }
};

const transcribeAudio = async (mediaId, userId) => {
    try {
        const tokenRes = await pool.query("SELECT meta_access_token FROM app_users WHERE id = $1", [userId]);
        const token = tokenRes.rows[0]?.meta_access_token;
        if (!token) return null;

        const mediaInfo = await axios.get(`https://graph.facebook.com/v21.0/${mediaId}`, { headers: { Authorization: `Bearer ${token}` } });
        const mediaUrl = mediaInfo.data.url;

        const mediaData = await axios.get(mediaUrl, { headers: { Authorization: `Bearer ${token}` }, responseType: 'stream' });
        
        const uploadDir = path.join(__dirname, "uploads");
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        
        const tmpPath = path.join(uploadDir, `tmp_audio_${Date.now()}.ogg`);
        const writer = fs.createWriteStream(tmpPath);
        mediaData.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(tmpPath),
            model: "whisper-large-v3"
        });

        fs.unlinkSync(tmpPath);
        return transcription.text;
    } catch (e) {
        console.error("[WHISPER ERROR]:", e.response?.data || e.message);
        return null;
    }
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
                    } else if (message.type === "audio") {
                        const mediaId = message.audio.id;
                        const transcript = await transcribeAudio(mediaId, userId);
                        if (transcript) textBody = transcript;
                        else textBody = "[Audio message received but transcription failed]";
                    }
                    
                    let adContext = "";
                    if (message.referral) {
                        const ref = message.referral;
                        adContext = `\n[System Note: Customer clicked an ad to get here! Ad Headline: "${ref.headline || ''}", Ad Body: "${ref.body || ''}". Acknowledge their interest subtly.]`;
                    }

                    if (textBody || isLocation) {
                        if (adContext && textBody) textBody += adContext;
                        await upsertContact(userId, fromNumber, contactName);
                        await logChat(userId, fromNumber, 'customer', textBody || "Sent a location pin");
                        await processAiAutomations(userId, fromNumber, textBody, contactName, isLocation, locationData);
                    }
                }
            }
        }
    } catch (e) { console.error("Webhook Error", e); }
};

const startCartRecoveryCron = () => {
    console.log("⏰ Abandoned Cart Recovery Cron Started");
    setInterval(async () => {
        try {
            const res = await pool.query(`
                SELECT id, user_id, customer_number, context 
                FROM conversation_sessions 
                WHERE is_paused = false 
                AND updated_at < NOW() - INTERVAL '30 minutes'
                AND updated_at > NOW() - INTERVAL '24 hours'
            `);
            
            for (const session of res.rows) {
                const context = typeof session.context === 'string' ? JSON.parse(session.context) : session.context;
                if (context && context.cart && context.cart.length > 0 && !context.recovery_sent) {
                    const bizRes = await pool.query("SELECT name FROM restaurants WHERE user_id = $1", [session.user_id]);
                    const bizName = bizRes.rows[0]?.name || "our restaurant";

                    const text = `🛒 *Left something behind?*\n━━━━━━━━━━━━━━\n\nHey there! We noticed you left some delicious items in your bag at ${bizName}.\n\nWould you like to complete your order before your cart expires?`;
                    
                    await sendButtons(session.customer_number, text, [
                        { id: 'checkout', title: '🛒 Checkout Now' },
                        { id: 'place_order', title: '➕ Add More' },
                        { id: 'cancel', title: '🗑️ Clear Cart' }
                    ], session.user_id);
                    
                    context.recovery_sent = true;
                    await pool.query("UPDATE conversation_sessions SET context = $1, updated_at = NOW() WHERE id = $2", [JSON.stringify(context), session.id]);
                }
            }
        } catch (e) {
            console.error("Cart Recovery Cron Error:", e);
        }
    }, 5 * 60 * 1000); // Check every 5 mins
};

const getWalletCredits = async (userId) => {
    const res = await pool.query("SELECT broadcast_credits FROM app_users WHERE id = $1", [userId]);
    return res.rows[0]?.broadcast_credits || 0;
};

const deductWalletCredits = async (userId, amount) => {
    const credits = await getWalletCredits(userId);
    if (credits < amount) return { success: false, error: "Insufficient broadcast credits. Please recharge." };
    
    await pool.query("UPDATE app_users SET broadcast_credits = broadcast_credits - $1 WHERE id = $2", [amount, userId]);
    return { success: true, newBalance: credits - amount };
};

const startAutoFollowupCron = () => {
    console.log("⏰ AUTO FOLLOW-UP ENGINE STARTED");
    setInterval(async () => {
        try {
            // 1. Send Due Messages
            const due = await pool.query(
                "SELECT * FROM scheduled_messages WHERE status = 'PENDING' AND scheduled_for <= NOW() LIMIT 10"
            );

            for (const row of due.rows) {
                const sent = await sendOfficialMessage(row.customer_number, row.message, row.user_id);
                if (sent.success) {
                    await pool.query("UPDATE scheduled_messages SET status = 'SENT' WHERE id = $1", [row.id]);
                } else {
                    await pool.query("UPDATE scheduled_messages SET status = 'FAILED' WHERE id = $1", [row.id]);
                }
            }

            // 2. Win-Back logic
            const stagnant = await pool.query(`
                SELECT mc.user_id, mc.phone_number, mc.name, r.name as biz_name
                FROM marketing_contacts mc
                JOIN restaurants r ON mc.user_id = r.user_id
                LEFT JOIN scheduled_messages sm ON mc.phone_number = sm.customer_number AND sm.message LIKE '%miss you%'
                WHERE mc.last_order_at < NOW() - interval '7 days'
                AND sm.id IS NULL
                LIMIT 5
            `);

            for (const c of stagnant.rows) {
                const msg = `Hi ${c.name || 'there'}! We miss you at *${c.biz_name}* 🍕. It's been a week since your last order. Here is a 10% discount code: *RELAX10* for your next meal!`;
                await pool.query(
                    "INSERT INTO scheduled_messages (user_id, customer_number, message, scheduled_for) VALUES ($1, $2, $3, NOW())",
                    [c.user_id, c.phone_number, msg]
                );
            }
        } catch (e) {
            console.error("Auto Follow-up Engine Error:", e);
        }
    }, 60000);
};

const startBackupCron = () => {
    const cron = require("node-cron");
    const { exec } = require("child_process");
    
    // Schedule backup for 3:00 AM every day
    cron.schedule('0 3 * * *', () => {
        console.log("⏰ [CRON] Starting Scheduled Database Backup (3:00 AM)");
        const scriptPath = path.join(__dirname, "scripts", "auto_backup.js");
        
        exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ [CRON] Backup Script Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`⚠️ [CRON] Backup Script Stderr: ${stderr}`);
            }
            console.log(`✅ [CRON] Backup Script Output: ${stdout}`);
        });
    });
    console.log("⏰ Database Backup Cron Scheduled (Daily 3:00 AM)");
};

module.exports = {
  handleMetaWebhook,
  sendOfficialMessage,
  getRecentChats,
  logChat,
  notifyKitchenAndStaff,
  syncBusinessProfileToWhatsApp,
  processAiAutomations,
  startCartRecoveryCron,
  startAutoFollowupCron,
  startBackupCron,
  getWalletCredits,
  deductWalletCredits
};
