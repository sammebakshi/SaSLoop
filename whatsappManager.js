const pool = require("./db");
const Groq = require("groq-sdk");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const normalizePhone = (p) => {
    if (!p) return "";
    return p.replace(/\D/g, "");
};

// Helper: Ensure +CountryCodeNumber for Meta API (Defaults to 91 if missing)
const formatToInter = (p) => {
    if (!p) return "";
    const digits = p.replace(/\D/g, "");
    if (digits.length === 10) return `+91${digits}`;
    if (!p.startsWith("+") && digits.length > 5) return `+${digits}`;
    if (p.startsWith("+")) return p;
    return `+${digits}`;
};

// ----------------------------------------------------------------------------------
// 📤 Send Message + Log to chat_messages
// ----------------------------------------------------------------------------------
const sendOfficialMessage = async (to, content, userId) => {
    try {
        const dbRes = await pool.query("SELECT id, meta_access_token, meta_phone_id FROM app_users WHERE id = $1", [userId]);
        const { meta_access_token: token, meta_phone_id: phoneId } = dbRes.rows[0] || {};
        
        if (!token || !phoneId) {
            console.error(`[META-ERROR] User ${userId} has no Meta credentials configured.`);
            return { success: false, error: "Missing Meta credentials" };
        }

        const formattedTo = formatToInter(to);
        const cleanTo = formattedTo.replace(/\D/g, ""); // Meta expects digits only for E.164
        let payload = { messaging_product: "whatsapp", to: cleanTo };
        
        if (typeof content === 'string') {
            if (!content) throw new Error("Empty message content");
            payload.type = "text";
            payload.text = { body: content };
        } else {
            Object.assign(payload, content);
        }
        
        console.log(`[META-SENDING] To: ${formattedTo} | User: ${userId}`);
        
        const response = await axios.post(`https://graph.facebook.com/v21.0/${phoneId}/messages`, payload, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        console.log(`[META-SUCCESS] Sent to ${cleanTo} | ID: ${response.data.messages?.[0]?.id}`);
        return { success: true, data: response.data };
    } catch (e) { 
        const errorData = e.response?.data || e.message;
        console.error(`[META-FAILURE] To: ${to} | Error:`, JSON.stringify(errorData, null, 2)); 
        return { success: false, error: errorData };
    }
};

const sendAndLog = async (to, text, userId, waMessageId = null) => {
    try {
        const bizRes = await pool.query("SELECT name FROM restaurants WHERE user_id = $1", [userId]);
        const bizName = bizRes.rows[0]?.name || "Assistant";
        const brandedText = `🤖 *${bizName}*\n━━━━━━━━━━━━━━\n${text}`;
        await sendOfficialMessage(to, { type: "text", text: { body: brandedText } }, userId);
        await logChat(userId, to, 'bot', text, waMessageId);
    } catch (err) {
        await sendOfficialMessage(to, text, userId);
        await logChat(userId, to, 'bot', text, waMessageId);
    }
};

const notifyKitchenAndStaff = async (userId, orderRef, customerName, customerNumber, cart, subtotal, total, cgst, sgst, cr, sr, symbol, orderType, address, tableNumber, discountAmount = 0) => {
    try {
        console.log(`[NOTIFY-START] Processing notifications for Order: ${orderRef} | User: ${userId}`);
        const bizRes = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [userId]);
        const biz = bizRes.rows[0];
        
        if (!biz) {
            console.error(`[NOTIFY-ERROR] No restaurant found for user_id ${userId}`);
            return;
        }

        const kotItemLines = cart.map(i => `  • ${i.qty}x ${i.name}`).join("\n");
        const staffItemLines = cart.map(i => `  • ${i.qty}x ${i.name} — ${symbol}${i.qty * i.price}`).join("\n");
        
        const kot = [
            `🍽️ *====== KITCHEN ORDER TICKET ======*`,
            `*Ref:* ${orderRef}`,
            `*Target:* ${tableNumber ? 'TABLE ' + tableNumber : (orderType.toUpperCase() === 'PICKUP' ? '🥡 PICKUP / TAKEAWAY' : orderType.toUpperCase())}`,
            `*Customer:* ${customerName}${customerNumber && customerNumber !== 'QR-ORDER' ? `\n*Phone:* ${customerNumber}` : ''}${orderType === 'delivery' && address ? `\n*Address:* ${address}` : ''}`,
            ``,
            `--- ITEMS ---`,
            kotItemLines,
            `────────────────`
        ].join("\n");

        const staffMsgArr = [
            `🔔 *NEW ${orderType.toUpperCase()} ORDER!*`,
            `*Ref:* ${orderRef}`,
            `*Type:* ${tableNumber ? '🪑 Table ' + tableNumber : (orderType.toLowerCase() === 'delivery' ? '🛵 Delivery' : '🥡 Pickup / Takeaway')}`,
            `*Customer:* ${customerName}${customerNumber && customerNumber !== 'QR-ORDER' ? `\n*Phone:* ${customerNumber}` : ''}${orderType === 'delivery' && address ? `\n*Address:* ${address}` : ''}`,
            ``,
            `--- ORDER DETAILS ---`,
            staffItemLines,
            `───────────────`
        ];

        if (biz.show_gst_on_receipt) {
            staffMsgArr.push(`*Breakdown:* Sub: ${symbol}${subtotal.toFixed(2)} | Tax: ${symbol}${(cgst+sgst).toFixed(2)}`);
        }
        if (discountAmount > 0) {
            staffMsgArr.push(`*Discount:* -${symbol}${discountAmount.toFixed(2)}`);
        }
        staffMsgArr.push(`*Total:* ${symbol}${total.toFixed(2)}`);
        staffMsgArr.push(`────────────────`);

        const staffMsg = staffMsgArr.join("\n");

        // 🚛 RELAY TO KITCHEN
        const kitchenNum = Array.isArray(biz.kitchen_number) ? biz.kitchen_number[0] : biz.kitchen_number;
        if (kitchenNum && kitchenNum.length > 5) {
            console.log(`[NOTIFY-KITCHEN] Relaying to Number: ${kitchenNum}`);
            const res = await sendOfficialMessage(kitchenNum, kot, userId);
            if (!res.success) console.error(`[NOTIFY-KITCHEN-FAIL] Reason:`, res.error);
        }

        // 🚛 RELAY TO STAFF
        let staffNums = [];
        if (biz.notification_numbers) {
            if (Array.isArray(biz.notification_numbers)) {
                staffNums = biz.notification_numbers;
            } else if (typeof biz.notification_numbers === 'string') {
                staffNums = biz.notification_numbers.split(/[,|\s]+/).filter(n => n.trim().length > 5);
            }

            if (staffNums.length > 0) {
                console.log(`[NOTIFY-STAFF] Relaying to ${staffNums.length} staff numbers...`);
                for (let num of staffNums) {
                    const cleanNum = (typeof num === 'string') ? num.trim() : num;
                    if (cleanNum) {
                        const res = await sendOfficialMessage(cleanNum, staffMsg, userId);
                        if (!res.success) console.error(`[NOTIFY-STAFF-FAIL] Number: ${cleanNum} | Reason:`, res.error);
                    }
                }
            }
        }
    } catch (e) { 
        console.error(`[NOTIFY-CRITICAL-FAIL] Order: ${orderRef} | Error:`, e.message); 
    }
};

const handleMetaWebhook = async (body) => {
    try {
        if (body.object === "whatsapp_business_account") {
            for (const entry of body.entry) {
                const changes = entry.changes[0];
                if (changes.value && changes.value.messages) {
                    const message = changes.value.messages[0];
                    const msgId = message.id;
                    const fromNumber = normalizePhone(message.from);
                    const contactName = changes.value.contacts?.[0]?.profile?.name || "Customer";
                    const metaPhoneId = changes.value.metadata.phone_number_id; 

                    const userRes = await pool.query("SELECT id FROM app_users WHERE meta_phone_id = $1 LIMIT 1", [metaPhoneId]);
                    if (userRes.rows.length === 0) return;
                    const userId = userRes.rows[0].id;

                    const dupCheck = await pool.query("SELECT id FROM chat_messages WHERE wa_message_id = $1", [msgId]);
                    if (dupCheck.rows.length > 0) return;

                    let textBody = "";
                    if (message.type === "text") textBody = message.text.body;
                    else if (message.type === "interactive") {
                        if (message.interactive.type === "button_reply") textBody = message.interactive.button_reply.title;
                        else if (message.interactive.type === "list_reply") textBody = message.interactive.list_reply.title;
                    }

                    if (textBody) {
                        await upsertContact(userId, fromNumber, contactName);
                        await logChat(userId, fromNumber, 'customer', textBody, msgId);
                        await processAiAutomations(userId, fromNumber, textBody, contactName);
                    }
                }
            }
        }
    } catch (e) { console.error("Webhook Error", e); }
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

// ----------------------------------------------------------------------------------
// 🛠️ STATE MANAGEMENT (Sessions)
// ----------------------------------------------------------------------------------
const getSession = async (userId, customerNumber) => {
    try {
        const cleanNum = normalizePhone(customerNumber);
        const res = await pool.query(
            "SELECT * FROM conversation_sessions WHERE user_id = $1 AND customer_number = $2",
            [userId, cleanNum]
        );
        if (res.rows.length > 0) {
            return {
                ...res.rows[0],
                context: typeof res.rows[0].context === 'string' ? JSON.parse(res.rows[0].context) : (res.rows[0].context || {})
            };
        }
        // Create new session
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
    } catch (e) {}
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
            action: {
                button: buttonTitle,
                sections: sections
            }
        }
    };
    return sendOfficialMessage(to, payload, userId);
};

// ----------------------------------------------------------------------------------
// 🛒 ORDER FINALIZATION
// ----------------------------------------------------------------------------------
const finalizeOrder = async (userId, customerNumber, customerName, cart, symbol, orderType, address, tableNumber = null) => {
    try {
        const bizRes = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [userId]);
        const biz = bizRes.rows[0];
        
        let subtotal = 0;
        cart.forEach(i => subtotal += (i.qty * i.price));
        
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

        const total = biz.gst_included ? subtotal : (subtotal + cgst + sgst);
        const orderRef = `WA-${Math.random().toString(36).substring(7).toUpperCase()}`;

        await pool.query(
            "INSERT INTO orders (user_id, customer_name, customer_number, address, items, total_price, order_reference, status, table_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            [userId, customerName, normalizePhone(customerNumber), address || orderType, JSON.stringify(cart), total, orderRef, 'PENDING', tableNumber]
        );

        // Notify Kitchen
        await notifyKitchenAndStaff(userId, orderRef, customerName, customerNumber, cart, subtotal, total, cgst, sgst, cgstR, sgstR, symbol, orderType, address, tableNumber);

        return { orderRef, total };
    } catch (e) {
        console.error("Finalize Order Fail:", e);
        return null;
    }
};

// ----------------------------------------------------------------------------------
// 🧠 CONVERSATIONAL AI ENGINE
// ----------------------------------------------------------------------------------
const processAiAutomations = async (userId, customerNumber, msgText, customerName) => {
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

        // 1. Handle Numerical Reply (Quantity)
        const numMatch = msgText.match(/^\d+$/);
        if (numMatch && session.state === 'AWAITING_QUANTITY' && session.context.pending_item) {
            const qty = parseInt(numMatch[0]);
            const item = session.context.pending_item;
            const cart = session.context.cart || [];
            
            // Update cart
            const existing = cart.find(i => i.name === item.name);
            if (existing) existing.qty += qty;
            else cart.push({ ...item, qty });

            session.context.cart = cart;
            session.context.pending_item = null;
            
            let cartText = cart.map(i => `• ${i.qty}x ${i.name}`).join("\n");
            let subtotal = cart.reduce((acc, i) => acc + (i.qty * i.price), 0);
            
            const text = `✅ Added to your bag!\n\n*Current Order:*\n${cartText}\n\n*Subtotal:* ${symbol}${subtotal}\n\nWould you like to add anything else, or should we proceed to checkout?`;
            await sendButtons(customerNumber, text, [
                { id: 'view_menu', title: 'Add More' },
                { id: 'checkout', title: 'Checkout 💳' }
            ], userId);
            
            await updateSession(userId, customerNumber, 'IDLE', session.context);
            await logChat(userId, customerNumber, 'bot', text);
            return;
        }

        // 2. Handle Direct Button Clicks
        const lower = msgText.toLowerCase();
        console.log(`[WA-DEBUG] Handling Input: ${msgText} | State: ${session.state}`);

        if (lower === 'place an order' || lower === 'order now' || lower === 'place_order') {
            const text = `🤖 *Order Details*\n\nGreat! Please specify the items you would like to order (e.g., '1x Burger' or just tell me what you want).`;
            await sendAndLog(customerNumber, text, userId);
            await updateSession(userId, customerNumber, 'IDLE', session.context);
            return;
        }

        if (lower === 'view_menu' || lower === 'explore menu 📖') {
            const text = `🍽️ *Our Menu*\n\nYou can browse our full menu here: https://sasloop.com/menu/${userId}\n\nOr just tell me what you're craving!`;
            await sendButtons(customerNumber, text, [
                { id: 'place_order', title: 'Place Order 🛍️' },
                { id: 'checkout', title: 'Checkout 💳' }
            ], userId);
            await logChat(userId, customerNumber, 'bot', text);
            return;
        }

        if (lower === 'checkout') {
            const cart = session.context.cart || [];
            if (cart.length === 0) {
                await sendAndLog(customerNumber, "Your bag is empty! Tell me what you'd like to eat first. 😋", userId);
                return;
            }
            const text = `🛒 *Checkout*\n\nGreat! How would you like your order?`;
            await sendButtons(customerNumber, text, [
                { id: 'mode_delivery', title: '🛵 Delivery' },
                { id: 'mode_pickup', title: '🥡 Pickup' }
            ], userId);
            await updateSession(userId, customerNumber, 'AWAITING_MODE', session.context);
            await logChat(userId, customerNumber, 'bot', text);
            return;
        }

        // 3. AI Intent Extraction
        console.log(`[AI-GROQ] Calling Groq for: ${msgText}...`);
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const systemPrompt = `
You are the AI Salesman for "${biz.name}". 
Analyze the user message and extract intents.

MENU: ${menuContext}

OUTPUT ONLY JSON:
{
  "intent": "GREETING" | "ORDER_ITEM" | "CHECKOUT" | "QUESTION" | "OTHER",
  "detected_item": "Item Name" | null,
  "quantity": number | null,
  "response": "Enthusiastic text response"
}

RULES:
- If it is a greeting like "Hi", "Hello", "Hey", set intent to GREETING.
- If they ask for an item, set intent to ORDER_ITEM.
- Be extremely enthusiastic and sales-driven.
- If they mention a menu item, ALWAYS confirm the price and ask for quantity.
`;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: msgText }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(completion.choices[0].message.content);
        console.log(`[AI-RESULT] Intent: ${result.intent} | Item: ${result.detected_item}`);

        if (result.intent === 'GREETING') {
            const text = `🍽️ *Welcome to ${biz.name}!*\n\nHello ${customerName}, it is a pleasure to assist you today. How can I help you? You can explore our menu or place an order using the options below.`;
            await sendButtons(customerNumber, text, [
                { id: 'view_menu', title: 'Menu Options 📖' },
                { id: 'place_order', title: 'Place an Order 🛍️' }
            ], userId);
            await logChat(userId, customerNumber, 'bot', text);
            return;
        }

        if (result.intent === 'ORDER_ITEM' && result.detected_item) {
            const item = menu.find(i => i.product_name.toLowerCase().includes(result.detected_item.toLowerCase()));
            if (item) {
                const text = `Excellent choice! The *${item.product_name}* is one of our favorites. It is priced at ${symbol}${item.price}.\n\nHow many would you like me to add for you?`;
                await sendAndLog(customerNumber, text, userId);
                session.context.pending_item = { name: item.product_name, price: item.price };
                await updateSession(userId, customerNumber, 'AWAITING_QUANTITY', session.context);
                return;
            }
        }

        // Default: Natural AI Response
        await sendAndLog(customerNumber, result.response || "I'm here to help! What can I get for you today?", userId);

    } catch (e) {
        console.error("[AI-ERROR] Critical fail in AI automation:", e);
    }
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
