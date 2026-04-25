const pool = require("./db");
const Groq = require("groq-sdk");
const axios = require("axios");
const { isBusinessOpen, getDeliveryDetails } = require("./utils/businessUtils");

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

        const kotItemLines = cart.map(i => `  • ${i.qty}x ${i.product_name || i.name || 'Item'}`).join("\n");
        const staffItemLines = cart.map(i => `  • ${i.qty}x ${i.product_name || i.name || 'Item'} — ${symbol}${(i.qty * i.price).toFixed(2)}`).join("\n");
        
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
        const cleanNum = formatToInter(customerNumber);
        const session = await getSession(userId, customerNumber);
        if (session.is_paused) return;

        // --- 🔍 FETCH BIZ & USER DATA (Including Knowledge Base) ---
        const bizRes = await pool.query(
            `SELECT r.*, u.bot_knowledge 
             FROM restaurants r 
             JOIN app_users u ON r.user_id = u.id 
             WHERE r.user_id = $1`, 
            [userId]
        );
        const biz = bizRes.rows[0];
        if (!biz) return;

        // --- 🕒 CHECK BUSINESS HOURS ---
        const bizStatus = isBusinessOpen(biz.settings);
        if (!bizStatus.isOpen) {
            const closedMsg = `😴 *We are currently CLOSED*\n━━━━━━━━━━━━━━\nOur business hours are *${bizStatus.openingTime}* to *${bizStatus.closingTime}*.\n\nPlease visit us during our working hours. Thank you! 🙏`;
            await sendOfficialMessage(customerNumber, closedMsg, userId);
            return;
        }

        const symbol = biz.currency_code === 'INR' ? '₹' : '$';

        const itemsRes = await pool.query("SELECT product_name, price, description, category FROM business_items WHERE user_id = $1 AND availability = true", [userId]);
        const menu = itemsRes.rows;
        const menuContext = menu.map(i => `${i.product_name}: ${symbol}${i.price}`).join(", ");

        const cart = session.context.cart || [];
        const lower = msgText ? msgText.toLowerCase() : "";

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

            await pool.query(
                "INSERT INTO orders (user_id, customer_name, customer_number, address, items, total_price, order_reference, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
                [userId, customerName, cleanNum, 'Pickup', JSON.stringify(cart), total, orderRef, 'PENDING']
            );

            await notifyKitchenAndStaff(userId, orderRef, customerName, cleanNum, cart, subtotal, total, cgst, sgst, cgstR, sgstR, symbol, 'pickup', 'Store Pickup', null);

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

            receiptRows.push(`*Total: ${symbol}${total.toFixed(2)}*`);
            receiptRows.push(`Ref: ${orderRef}`);
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
                "INSERT INTO orders (user_id, customer_name, customer_number, address, items, total_price, order_reference, status, delivery_charge) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
                [userId, customerName || "WhatsApp Customer", cleanNum, pending.address, JSON.stringify(pending.items), pending.total, orderRef, 'PENDING', pending.deliveryCharge]
            );

            try {
                await notifyKitchenAndStaff(
                    userId, orderRef, customerName || "WhatsApp Customer", cleanNum, pending.items, pending.subtotal, pending.total, pending.cgst, pending.sgst, 2.5, 2.5, symbol, 'delivery', pending.address, null
                );
            } catch (e) { console.error("Notif fail:", e); }

            const receipt = [
                `✅ *Order Confirmed!*`,
                `Ref: ${orderRef}`,
                `───────────────`,
                `Your order is being prepared. Thank you! 🎉`
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
            
            // Final fallback
            if (!menuLink) menuLink = `https://sasloop.com/menu/${biz.id}`;

            const text = `📜 *Our Digital Menu*\n━━━━━━━━━━━━━━\n\nYou can browse our full catalog and see all the latest flavors here:\n\n🔗 ${menuLink}\n\nAnything else I can help you with?`;
            await sendOfficialMessage(customerNumber, text, userId);
            return;
        }

        if (lower === 'loyalty') {
            const loyaltyRes = await pool.query("SELECT points FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2", [userId, cleanNum]);
            const points = loyaltyRes.rows[0]?.points || 0;
            const text = `🎁 *Your Rewards*\n━━━━━━━━━━━━━━\n\nTotal Points Available: *${points} pts*\n\nYou can use these points for discounts on your future orders! 🎊`;
            await sendButtons(customerNumber, text, [
                { id: 'place_order', title: '🛍️ Place an Order' },
                { id: 'view_menu', title: '📜 View Menu' }
            ], userId);
            return;
        }

        if (lower === 'support') {
            const supportNum = biz.settings?.customerSupport || biz.phone || biz.contact_number;
            const text = `📞 *Contact Support*\n━━━━━━━━━━━━━━\n\nNeed help? You can speak with our team directly:\n\n📱 Call/WhatsApp: ${supportNum}\n\nWe are here for you! 🙏`;
            await sendOfficialMessage(customerNumber, text, userId);
            return;
        }

        if (lower === 'enquiry') {
            const text = `❓ *Dish Enquiry*\n━━━━━━━━━━━━━━\n\nSure! Please type the name of the dish or ask me anything about our ingredients and prices. I'm here to help!`;
            await sendOfficialMessage(customerNumber, text, userId);
            return;
        }

        // --- 🧠 PRO AI INTENT DETECTION ---
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const systemPrompt = `
You are the professional AI Sales Executive for "${biz.name}". 
Analyze the user message to extract ordering intent.

MENU: ${menuContext}

RULES:
1. If user specifies a quantity (e.g. "2 burgers", "rista 5"), extract it.
2. If multiple items match a keyword (e.g. "pizza" matches "Veg Pizza" and "Paneer Pizza"), mark as MULTIPLE.
3. Be persuasive and professional.

OUTPUT ONLY JSON:
{
  "intent": "GREETING" | "ORDER_ITEM" | "CHECKOUT" | "QUESTION" | "OTHER",
  "detected_item": "Exact Item Name from Menu" | "keyword",
  "quantity": number | null,
  "is_multiple": boolean,
  "matches": ["Item 1", "Item 2"],
  "response": "Enthusiastic text response"
}
`;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: msgText }],
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(completion.choices[0].message.content);

        if (result.intent === 'GREETING' || lower === 'hi' || lower === 'hello' || lower === 'menu') {
            // --- 🎁 CHECK FOR NEW CUSTOMER LOYALTY ---
            const loyaltyCheck = await pool.query("SELECT id FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2", [userId, cleanNum]);
            if (loyaltyCheck.rows.length === 0) {
                const welcomeMsg = `👋 *Welcome to ${biz.name}!*\n\nWe'd love to have you in our VIP Club. Join today and get *50 Welcome Points* instantly! 🎁\n\nYou can use these points for discounts on your future orders.`;
                await sendButtons(customerNumber, welcomeMsg, [
                    { id: 'join_loyalty', title: '🎁 Join & Get 50 pts' },
                    { id: 'place_order', title: '🛍️ Just Order' }
                ], userId);
                return;
            }

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
            // 1. Check for Multiple Matches (Variants)
            const matches = menu.filter(i => 
                i.product_name.toLowerCase().includes(result.detected_item.toLowerCase()) ||
                (result.matches && result.matches.includes(i.product_name))
            );

            if (matches.length > 1) {
                const variantButtons = matches.slice(0, 3).map(m => ({
                    id: `order_${m.product_name}`,
                    title: `${m.product_name}`
                }));
                const variantText = `We have a few types of *${result.detected_item}*. Which one would you like?`;
                await sendButtons(customerNumber, variantText, variantButtons, userId);
                return;
            }

            const item = matches[0];
            if (item) {
                const qty = result.quantity || 1;
                
                if (result.quantity) {
                    // AUTO-ADD TO CART (Quantity was provided)
                    const existing = cart.find(i => i.name === item.product_name);
                    if (existing) existing.qty += qty;
                    else cart.push({ name: item.product_name, price: item.price, qty });

                    session.context.cart = cart;
                    await updateSession(userId, cleanNum, 'IDLE', session.context);

                    const text = `✅ *Got it!* I've added ${qty}x *${item.product_name}* to your order.\n\nWould you like to add anything else or checkout?`;
                    await sendButtons(customerNumber, text, [
                        { id: 'checkout', title: '✅ Checkout' },
                        { id: 'place_order', title: '➕ Add More' }
                    ], userId);
                } else {
                    // ASK FOR QUANTITY
                    const text = `Excellent choice! The *${item.product_name}* is priced at ${symbol}${item.price}.\n\nHow many would you like me to add for you?`;
                    await sendBrandedText(customerNumber, biz.name, text, userId);
                    session.context.pending_item = { name: item.product_name, price: item.price };
                    await updateSession(userId, cleanNum, 'AWAITING_QUANTITY', session.context);
                }
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
