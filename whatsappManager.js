const pool = require("./db");
const Groq = require("groq-sdk");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const normalizePhone = (p) => {
    if (!p) return "";
    return p.replace(/\D/g, ""); // Remove all non-digits, keep full length including country code
};

// ----------------------------------------------------------------------------------
// 🚀 Official Meta API Webhook Handler (Helpers Defined Below)
// ----------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------
// 📤 Send Message + Log to chat_messages
// ----------------------------------------------------------------------------------
const sendOfficialMessage = async (to, content, userId) => {
    try {
        const dbRes = await pool.query("SELECT meta_access_token, meta_phone_id FROM app_users WHERE id = $1", [userId]);
        const { meta_access_token: token, meta_phone_id: phoneId } = dbRes.rows[0];
        let payload = { messaging_product: "whatsapp", to };
        if (typeof content === 'string') {
            payload.type = "text";
            payload.text = { body: content };
        } else {
            Object.assign(payload, content);
        }
        await axios.post(`https://graph.facebook.com/v21.0/${phoneId}/messages`, payload, {
            headers: { "Authorization": `Bearer ${token}` }
        });
    } catch (e) { console.error("Meta Send Error", e.response?.data || e.message); }
};

const sendAndLog = async (to, text, userId, waMessageId = null) => {
    try {
        const bizRes = await pool.query("SELECT name FROM restaurants WHERE user_id = $1", [userId]);
        const bizName = bizRes.rows[0]?.name || "Assistant";
        const brandedText = `🤖 *${bizName}*\n━━━━━━━━━━━━━━\n${text}`;
        await sendOfficialMessage(to, { type: "text", text: { body: brandedText } }, userId);
        await logChat(userId, to, 'bot', text, waMessageId);
    } catch (err) {
        await sendOfficialMessage(to, { type: "text", text: { body: text } }, userId);
        await logChat(userId, to, 'bot', text, waMessageId);
    }
};

const sendVCard = async (to, biz, userId) => {
    try {
        const cleanPhone = biz.phone ? biz.phone.replace(/\D/g, "") : "";
        await sendOfficialMessage(to, {
            type: "contacts",
            contacts: [{
                name: { formatted_name: biz.name || 'Business', first_name: biz.name || 'Business' },
                phones: [{ phone: biz.phone, type: "WORK", wa_id: cleanPhone }],
                org: { company: biz.name || 'Business' }
            }]
        }, userId);
    } catch (e) { console.error("VCard push failed", e.message); }
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

                    // 🛡️ DUPLICATE PREVENTION (Handles Retries from Meta)
                    const dupCheck = await pool.query("SELECT id FROM chat_messages WHERE wa_message_id = $1", [msgId]);
                    if (dupCheck.rows.length > 0) {
                        console.log(`[DE-DUPE] Skipping already processed message: ${msgId}`);
                        return;
                    }

                    // Support text messages, button replies, and location messages
                    let textBody = "";
                    if (message.type === "text") {
                        textBody = message.text.body;
                    } else if (message.type === "interactive") {
                        if (message.interactive.type === "button_reply") {
                            textBody = message.interactive.button_reply.title;
                        } else if (message.interactive.type === "list_reply") {
                            textBody = message.interactive.list_reply.title;
                        }
                    } else if (message.interactive?.button_reply?.title) {
                        textBody = message.interactive.button_reply.title;
                    }
                    
                    // Capture location if sent
                    let locationData = null;
                    if (message.type === "location") {
                        locationData = {
                            latitude: message.location.latitude,
                            longitude: message.location.longitude,
                            name: message.location.name || "",
                            address: message.location.address || ""
                        };
                        textBody = locationData.address || `📍 Shared Location: ${locationData.latitude}, ${locationData.longitude}`;
                    }

                    if (textBody) {
                        await upsertContact(userId, fromNumber, contactName);
                        await logChat(userId, fromNumber, 'customer', textBody, msgId);
                        await processAiAutomations(userId, fromNumber, textBody, contactName, locationData);
                    }
                }
            }
        }
    } catch (e) { console.error("Webhook Logic Error", e); }
};

// ----------------------------------------------------------------------------------
// 🖼️ Automatic Profile & DP Sync (SaSLoop -> WhatsApp)
// ----------------------------------------------------------------------------------
const syncBusinessProfileToWhatsApp = async (userId, bizData) => {
    try {
        console.log(`[SYNC] Starting WhatsApp Profile Sync for User: ${userId}`);
        const dbRes = await pool.query("SELECT meta_access_token, meta_phone_id FROM app_users WHERE id = $1", [userId]);
        const { meta_access_token: token, meta_phone_id: phoneId } = dbRes.rows[0] || {};
        
        if (!token || !phoneId) {
            console.warn(`[SYNC] Skipped: No Meta Token/PhoneID found for user ${userId}`);
            return { success: false, error: "WhatsApp API not configured" };
        }

        let payload = {
            messaging_product: "whatsapp",
            description: bizData.address || "",
            about: `Official bot for ${bizData.name}`,
            address: bizData.address || ""
        };

        // If a logo exists, try to update the DP
        if (bizData.logo_url) {
            console.log(`[SYNC] Found logo_url: ${bizData.logo_url}. Attempting DP update...`);
            try {
                // 1. Get the App ID associated with this token
                const debugRes = await axios.get(`https://graph.facebook.com/debug_token?input_token=${token}&access_token=${token}`);
                const appId = debugRes.data?.data?.app_id;

                if (appId) {
                    const cleanPath = bizData.logo_url.replace(/^\//, "");
                    const localPath = path.join(__dirname, cleanPath);
                    console.log(`[SYNC] Looking for file at: ${localPath}`);
                    
                    if (fs.existsSync(localPath)) {
                        console.log(`[SYNC] File found! Size: ${fs.statSync(localPath).size} bytes. Starting Meta upload...`);
                        const stats = fs.statSync(localPath);
                        const fileData = fs.readFileSync(localPath);
                        const mimeType = bizData.logo_url.endsWith(".png") ? "image/png" : "image/jpeg";

                        // 2. Start Resumable Upload
                        const uploadSessionRes = await axios.post(
                            `https://graph.facebook.com/v21.0/${appId}/uploads?file_length=${stats.size}&file_type=${mimeType}`,
                            {}, { headers: { "Authorization": `Bearer ${token}` } }
                        );
                        const uploadSessionId = uploadSessionRes.data.id;

                        // 3. Upload the binary file
                        const uploadRes = await axios.post(
                            `https://graph.facebook.com/${uploadSessionId}`,
                            fileData,
                            { 
                                headers: { 
                                    "Authorization": `OAuth ${token}`,
                                    "Content-Type": "application/octet-stream"
                                } 
                            }
                        );
                        const handle = uploadRes.data.h;
                        if (handle) payload.profile_picture_handle = handle;
                    }
                }
            } catch (err) {
                console.error("WhatsApp DP sync failed (non-critical):", err.response?.data || err.message);
            }
        }

        // 4. Update the actual profile fields
        await axios.post(
            `https://graph.facebook.com/v21.0/${phoneId}/whatsapp_business_profile`,
            payload,
            { headers: { "Authorization": `Bearer ${token}` } }
        );

        console.log(`[SYNC] WhatsApp Profile updated for User ${userId}`);
        return { success: true };
    } catch (e) {
        console.error("WhatsApp Profile Sync Error:", e.response?.data || e.message);
        return { success: false, error: e.message };
    }
};

// ----------------------------------------------------------------------------------
// 💬 Chat Message Logger (for Live AI Inbox)
// ----------------------------------------------------------------------------------
const upsertContact = async (userId, phone, name) => {
    try {
        await pool.query(
            `INSERT INTO marketing_contacts (user_id, phone_number, name, last_order_at) 
             VALUES ($1, $2, $3, NOW()) 
             ON CONFLICT (user_id, phone_number) DO UPDATE SET name = EXCLUDED.name, last_order_at = NOW()`,
            [userId, normalizePhone(phone), name]
        );
    } catch (e) {
        console.error("Contact upsert error:", e.message);
    }
};

const updateVCardStatus = async (userId, phone, status) => {
    try {
        await pool.query(
            "UPDATE marketing_contacts SET vcard_sent = $1 WHERE user_id = $2 AND phone_number = $3",
            [status, userId, normalizePhone(phone)]
        );
    } catch (e) { console.error("VCard status update error:", e.message); }
};

const logChat = async (userId, customerNumber, role, text, waMessageId = null) => {
    try {
        await pool.query(
            "INSERT INTO chat_messages (user_id, customer_number, role, text, wa_message_id) VALUES ($1, $2, $3, $4, $5)",
            [userId, normalizePhone(customerNumber), role, text, waMessageId]
        );
    } catch (e) {
        console.error("Chat log error (non-critical):", e.message);
    }
};

// ----------------------------------------------------------------------------------
// 🧠 Session Management (Persistent Cart Memory + Order Flow State)
// ----------------------------------------------------------------------------------
const getSession = async (userId, customerNumber) => {
    const normPhone = normalizePhone(customerNumber);
    const res = await pool.query("SELECT * FROM conversation_sessions WHERE user_id = $1 AND customer_number = $2", [userId, normPhone]);
    if (res.rows.length > 0) {
        let ctx = res.rows[0].context;
        if (!ctx || !ctx.items) ctx = { items: [], total_price: 0 };
        return { ...res.rows[0], context: ctx };
    }
    const newSession = await pool.query(
        `INSERT INTO conversation_sessions (user_id, customer_number, state, context) 
         VALUES ($1, $2, 'IDLE', '{"items":[],"total_price":0}') RETURNING *`,
        [userId, normPhone]
    );
    const row = newSession.rows[0];
    row.context = { items: [], total_price: 0 };
    return row;
};

const updateSessionState = async (userId, customerNumber, state, context) => {
    await pool.query(
        `UPDATE conversation_sessions SET state = $1, context = $2, updated_at = NOW(), last_interaction = NOW() 
         WHERE user_id = $3 AND customer_number = $4`,
        [state, JSON.stringify(context), userId, normalizePhone(customerNumber)]
    );
};

const updateSession = async (userId, customerNumber, context) => {
    await pool.query(
        `UPDATE conversation_sessions SET context = $1, updated_at = NOW(), last_interaction = NOW() 
         WHERE user_id = $2 AND customer_number = $3`,
        [JSON.stringify(context), userId, normalizePhone(customerNumber)]
    );
};

const clearSession = async (userId, customerNumber) => {
    await pool.query("DELETE FROM conversation_sessions WHERE user_id = $1 AND customer_number = $2", [userId, normalizePhone(customerNumber)]);
};



// ----------------------------------------------------------------------------------
// 🤖 Core AI Processing with Session Memory + Order Type Flow
// ----------------------------------------------------------------------------------
const processAiAutomations = async (userId, customerNumber, msgText, customerName, locationData) => {
    try {
        const userRes = await pool.query(`SELECT r.*, u.bot_knowledge FROM restaurants r JOIN app_users u ON u.id = r.user_id WHERE r.user_id = $1`, [userId]);
        const biz = userRes.rows[0];
        const bizName = biz?.name || "Restaurant";
        const bizAddress = biz?.address || "";
        const botKnowledge = biz?.bot_knowledge || "";
        const currencyCode = biz?.currency_code || 'INR';
        const symbol = currencyCode === 'INR' ? '₹' : (currencyCode === 'USD' ? '$' : '₹');

        const msgLower = (msgText || "").toLowerCase().trim();

        // 🛡️ NEW CUSTOMER IDENTITY PUSH
        // Check if vCard has been sent to this contact before
        const contactCheck = await pool.query(
            "SELECT vcard_sent FROM marketing_contacts WHERE user_id = $1 AND phone_number = $2",
            [userId, normalizePhone(customerNumber)]
        );
        
        if (contactCheck.rows.length > 0 && contactCheck.rows[0].vcard_sent === false) {
            console.log(`[IDENTITY PUSH] First message from ${customerNumber}. Sending vCard for ${bizName}`);
            await sendVCard(customerNumber, biz, userId);
            await updateVCardStatus(userId, customerNumber, true);
        }

        const session = await getSession(userId, customerNumber);
        const sessionState = session.state || 'IDLE';
        const cart = session.context.items || [];

        // 0. INTERCEPT WEB APP REDIRECTS (QR / ONLINE)
        // Checks for multiple common variants of the pre-filled redirect message.
        const isRedirect = 
            msgLower.includes('just placed an order') || 
            msgLower.includes('just placed an online order') ||
            msgLower.includes('order request - table') ||
            msgLower.includes('confirm this order to start preparation');

        if (isRedirect) {
            await clearSession(userId, customerNumber);
            await sendAndLog(customerNumber, `✅ *Order Received!*\n\nThank you for your order. Our team has received it and is preparing it right now! 👨‍🍳🔥`, userId);
            return;
        }

        // 1. GREETINGS / RESET
        if (['hi', 'hello', 'start', 'start over', 'hey', 'reset', 'menu', 'options', 'help'].includes(msgLower)) {
            console.log(`[BOT] Greeting reached for ${customerName} (${customerNumber})`);
            await clearSession(userId, customerNumber);
            
            const bizSettings = biz?.settings || {};
            // Robust boolean check
            const isOrderingEnabled = bizSettings.homeDelivery === true || bizSettings.dining === true || bizSettings.delivery === true;
            const isBookingEnabled = bizSettings.tableBooking === true || bizSettings.appointments === true;
            
            const greetingMessage = `*Welcome to ${bizName}*\n\nHello *${customerName}*, it is a pleasure to assist you today.\n\nHow may I help you? You can explore our menu or place an order using the options below.`;
            
            const menuRows = [
                { id: "place_order", title: "🛍️ Place an Order", description: "Start your meal selection" },
                { id: "view_menu", title: "📜 View Digital Menu", description: "Browse our full catalog" },
            ];
            
            if (isBookingEnabled) {
                menuRows.push({ id: "book_table", title: "📅 Table Reservation", description: "Book your spot" });
            }
            
            menuRows.push({ id: "item_enquiry", title: "❓ Dish Enquiry", description: "Ask about ingredients/price" });
            menuRows.push({ id: "loyalist_club", title: "🎁 Loyalty & Points", description: "Check your rewards" });
            menuRows.push({ id: "contact_us", title: "📞 Contact Support", description: "Speak with our team" });

            await sendOfficialMessage(customerNumber, {
                type: "interactive",
                interactive: {
                    type: "list",
                    header: { type: "text", text: "How can we help?" },
                    body: { text: greetingMessage },
                    footer: { text: "Please choose an option from the list below" },
                    action: {
                        button: "Menu Options",
                        sections: [{ title: "Main Menu", rows: menuRows }]
                    }
                }
            }, userId);
            
            await logChat(userId, customerNumber, 'bot', greetingMessage);
            return;
        }

        // 1a. HANDLE SPECIFIC MENU BUTTONS (CONTACT / BOOKING)
        if (msgLower === 'contact us' || msgLower.includes('contact_us')) {
            const contactMsg = `📞 *Contact Us*\n\nRestaurant: *${bizName}*\nPhone: ${biz?.phone || "N/A"}\nAddress: ${bizAddress}\n\nFeel free to call us for any urgent queries!`;
            await sendAndLog(customerNumber, contactMsg, userId);
            return;
        }

        if (msgLower === 'book a table' || msgLower.includes('book_table')) {
            const bookMsg = `🍴 *Table Reservation*\n\nPlease let me know your preferred *Date*, *Time*, and *No. of Guests*. I'll check availability for you!`;
            await sendAndLog(customerNumber, bookMsg, userId);
            return;
        }

        if (msgLower === 'view menu' || msgLower.includes('view_menu') || msgLower.includes('view digital menu')) {
            const domain = process.env.NGROK_DOMAIN || 'sasloop.com';
            const protocol = domain.includes('localhost') ? 'http' : 'https';
            const menuLink = `${protocol}://${domain}/menu/${userId}/wa`;
            
            const menuMsg = `📜 *Our Digital Menu*\n\nYou can browse our full catalog and place orders directly from your browser here:\n👉 ${menuLink}\n\nSimply tap the link above to view our latest specials! 🍽️`;
            await sendAndLog(customerNumber, menuMsg, userId);
            return;
        }

        if (msgLower === 'place an order' || msgLower.includes('place_order') || msgLower.includes('place an order')) {
            await sendAndLog(customerNumber, `*Order Details*\n\nPlease specify the items you would like to order (e.g., '1x Burger').`, userId);
            return;
        }

        if (msgLower === 'item enquiry' || msgLower.includes('item_enquiry') || msgLower.includes('dish enquiry')) {
            await sendAndLog(customerNumber, `*Dish Enquiry*\n\nHow can I help? Please ask about ingredients, portion sizes, or any dietary preferences.`, userId);
            return;
        }

        if (msgLower === 'loyalty & points' || msgLower.includes('loyalist_club') || ['balance', 'points', 'rewards', 'point', 'my points'].some(k => msgLower.includes(k))) {
            const biz = (await pool.query("SELECT * FROM restaurants WHERE user_id=$1", [userId])).rows[0];
            if (biz?.loyalty_enabled === false) {
                await sendAndLog(customerNumber, `Sorry, our rewards program is currently inactive.`, userId);
                return;
            }
            const checkPoints = await pool.query("SELECT points FROM customer_loyalty WHERE user_id=$1 AND customer_number = $2", [userId, normalizePhone(customerNumber)]);
            const pts = checkPoints.rows[0]?.points || 0;
            const earnPts = biz?.points_per_100 || 5;
            const redeemRatio = biz?.points_to_amount_ratio || 10;
            const minRedeem = biz?.min_redeem_points || 300;
            const balanceMsg = `*Loyalty Rewards*\n\nYour current balance: *${pts} points*\n\n*Program Details:*\n• Earn ${earnPts} points for every ${symbol}100 spent.\n• Points can be redeemed for discounts (${redeemRatio} points = ${symbol}1).\n• Minimum ${minRedeem} points required to redeem.`;
            await sendAndLog(customerNumber, balanceMsg, userId);
            return;
        }

        // 1b. SPECIAL HANDLING: QR Table Context
        const tableMatch = msgText.match(/TABLE\s*(\d+)/i);
        
        if (tableMatch) {
            const tableId = tableMatch[1];
            session.context.table_number = tableId;
            console.log(`📍 QR Order context detected: Table ${tableId} for ${customerNumber}`);
            await updateSession(userId, customerNumber, session.context);
        }

        // 2. FETCH MENU ITEMS
        const itemsRes = await pool.query("SELECT product_name, price FROM business_items WHERE user_id = $1 AND availability = true", [userId]);
        const items = itemsRes.rows;

        if (items.length === 0) {
            await sendAndLog(customerNumber, `Sorry, our menu is currently being updated. Please try again later!`, userId);
            return;
        }

        if (session.is_paused) return;

        // =====================================================
        // 🔄 STATE MACHINE: Handle multi-step order flow
        // =====================================================

        if (sessionState === 'AWAITING_LOYALTY') {
            const wantsRedeem = msgLower.includes('yes') || msgLower.includes('redeem') || msgLower === '1';
            const skipRedeem = msgLower.includes('no') || msgLower.includes('skip') || msgLower === '2';

            if (wantsRedeem) {
                // Determine how many points to redeem based on biz rules
                const checkPoints = await pool.query("SELECT points FROM customer_loyalty WHERE user_id=$1 AND customer_number = $2", [userId, normalizePhone(customerNumber)]);
                const available = checkPoints.rows[0]?.points || 0;
                
                const biz = (await pool.query("SELECT * FROM restaurants WHERE user_id=$1", [userId])).rows[0];
                const minRedeem = biz?.min_redeem_points || 300;
                const maxRedeem = biz?.max_redeem_per_order || 300;
                const redeemRatio = biz?.points_to_amount_ratio || 10;
                
                if (biz?.loyalty_enabled !== false && available >= minRedeem) {
                    const toRedeem = Math.min(available, maxRedeem);
                    session.context.redeem_points = toRedeem; 
                    const discount = toRedeem / redeemRatio;
                    await updateSession(userId, customerNumber, session.context);
                    await sendAndLog(customerNumber, `🎁 *Awesome!* ${toRedeem} points (${symbol}${discount.toFixed(2)}) will be deducted from your total.`, userId);
                } else {
                    await sendAndLog(customerNumber, `⚠️ You don't have enough points to redeem (Min ${minRedeem}).`, userId);
                }
            }

            // Move to order type after loyalty check
            if (session.context.table_number) {
                 await finalizeConversationalOrder(userId, customerNumber, customerName, session, biz, symbol);
                 return;
            }

            await updateSessionState(userId, customerNumber, 'AWAITING_TYPE', session.context);
            await sendOfficialMessage(customerNumber, {
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { text: "How would you like to receive your meal?" },
                    action: {
                        buttons: [
                            { type: "reply", reply: { id: "type_pickup", title: "🏪 Pickup" } },
                            { type: "reply", reply: { id: "type_delivery", title: "🚚 Delivery" } }
                        ]
                    }
                }
            }, userId);
            return;
        }

        if (sessionState === 'AWAITING_TYPE') {
            const isPickup = msgLower.includes('pickup') || msgLower.includes('pick up') || msgLower === '1';
            const isDelivery = msgLower.includes('delivery') || msgLower.includes('deliver') || msgLower === '2';

            if (isPickup) {
                const subtotal = cart.reduce((sum, ci) => sum + (ci.qty * ci.price), 0);
                const cgstRate = parseFloat(biz?.cgst_percent) || 0;
                const sgstRate = parseFloat(biz?.sgst_percent) || 0;
                const isGstIncluded = !!biz?.gst_included;
                const totalTaxRate = cgstRate + sgstRate;
                
                let totalPrice = subtotal;
                if (!isGstIncluded) {
                    totalPrice = subtotal + (subtotal * totalTaxRate / 100);
                }

                const cartLines = cart.map(ci => `• ${ci.qty}x ${ci.name}`);
                const discount = (session.context.redeem_points || 0) / 10;
                const finalGrandDisplay = Math.max(0, totalPrice - discount);

                await sendAndLog(customerNumber, `🏪 *Order Summary (Pickup)*\n\n${cartLines.join("\n")}\n\n*Total:* ${symbol}${finalGrandDisplay.toFixed(2)}${discount > 0 ? ` (after ${symbol}${discount} loyalty discount)` : ''}\n\nFinalizing your pickup order...`, userId);
                await finalizeConversationalOrder(userId, customerNumber, customerName, session, biz, symbol);
                return;
            }

            if (isDelivery) {
                const ctx = { ...session.context, order_type: 'delivery' };
                await updateSessionState(userId, customerNumber, 'AWAITING_LOCATION', ctx);
                await sendAndLog(customerNumber,
                    `🚚 *Delivery selected!*\n\nPlease share your delivery address.\n\n📍 You can type it or share your *Live Location* pin.`,
                    userId);
                return;
            }

            // Retry with buttons
            await sendOfficialMessage(customerNumber, {
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { text: "Please choose your order type:" },
                    action: {
                        buttons: [
                            { type: "reply", reply: { id: "type_pickup", title: "🏪 Pickup" } },
                            { type: "reply", reply: { id: "type_delivery", title: "🚚 Delivery" } }
                        ]
                    }
                }
            }, userId);
            return;
        }

        if (sessionState === 'AWAITING_LOCATION') {
            let address = msgText;
            if (locationData) {
                address = locationData.address || locationData.name || `📍 Location [${locationData.latitude}, ${locationData.longitude}]`;
                const ctx = { ...session.context, delivery_address: address, coordinates: locationData };
                await updateSessionState(userId, customerNumber, 'IDLE', ctx);
            } else {
                if (msgLower.length < 5) {
                    await sendAndLog(customerNumber, `Please share your full delivery address.`, userId);
                    return;
                }
                const ctx = { ...session.context, delivery_address: address };
                await updateSessionState(userId, customerNumber, 'IDLE', ctx);
            }
            
            const subtotal = cart.reduce((sum, ci) => sum + (ci.qty * ci.price), 0);
            const cgstRate = parseFloat(biz?.cgst_percent) || 0;
            const sgstRate = parseFloat(biz?.sgst_percent) || 0;
            const isGstIncluded = !!biz?.gst_included;
            const totalTaxRate = cgstRate + sgstRate;
            
            let totalPrice = subtotal;
            if (!isGstIncluded) {
                totalPrice = subtotal + (subtotal * totalTaxRate / 100);
            }

            const cartLines = cart.map(ci => `• ${ci.qty}x ${ci.name}`);
            const discount = (session.context.redeem_points || 0) / 10;
            const finalGrandDisplay = Math.max(0, totalPrice - discount);

            await sendAndLog(customerNumber, `🚚 *Order Summary (Delivery)*\n\n${cartLines.join("\n")}\n\n*Address:* ${address}\n*Total:* ${symbol}${finalGrandDisplay.toFixed(2)}${discount > 0 ? ` (after ${symbol}${discount} loyalty discount)` : ''}\n\nFinalizing your delivery...`, userId);
            await finalizeConversationalOrder(userId, customerNumber, customerName, session, biz, symbol);
            return;
        }

        // 4. CHECK IF USER IS ASKING ABOUT TOTAL / BILL
        const totalKeywords = ['total', 'how much', 'bill', 'price', 'amount', 'cost', 'kitna', 'kitne', 'sum', 'checkout'];
        const isAskingTotal = totalKeywords.some(kw => msgLower.includes(kw));
        
        if (isAskingTotal && cart.length > 0) {
            let subtotal = 0;
            const cartLines = cart.map(ci => {
                const lineTotal = ci.qty * ci.price;
                subtotal += lineTotal;
                return `• ${ci.qty}x ${ci.name} — ${symbol}${lineTotal}`;
            });

            const cgstRate = parseFloat(biz?.cgst_percent) || 0;
            const sgstRate = parseFloat(biz?.sgst_percent) || 0;
            const isGstIncluded = !!biz?.gst_included;
            const totalTaxRate = cgstRate + sgstRate;
            
            let totalPrice = subtotal;
            let taxInfo = "";
            if (!isGstIncluded && totalTaxRate > 0) {
                totalPrice = subtotal + (subtotal * totalTaxRate / 100);
                taxInfo = `\n_(Amount includes ${totalTaxRate}% GST)_`;
            } else if (isGstIncluded && totalTaxRate > 0) {
                taxInfo = `\n_(Prices include ${totalTaxRate}% GST)_`;
            }

            const summary = `🧾 *Order Summary:*\n${cartLines.join("\n")}\n\n*Grand Total: ${symbol}${totalPrice.toFixed(2)}*${taxInfo}`;
            
            await sendOfficialMessage(customerNumber, {
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { text: summary + "\n\nWould you like to proceed to checkout?" },
                    action: {
                        buttons: [
                            { type: "reply", reply: { id: "confirm_yes", title: "💳 Checkout Now" } },
                            { type: "reply", reply: { id: "add_more", title: "➕ Add More Items" } }
                        ]
                    }
                }
            }, userId);
            await logChat(userId, customerNumber, 'bot', summary);
            return;
        }

        // 5. CHECK FOR CONFIRMATION
        if (['yes', 'checkout', 'confirm', 'done', 'place order', 'place it', 'checkout now', 'yes, confirm'].includes(msgLower) && cart.length > 0) {
            
            const subtotal = cart.reduce((sum, ci) => sum + (ci.qty * ci.price), 0);
            const cgstRate = parseFloat(biz?.cgst_percent) || 0;
            const sgstRate = parseFloat(biz?.sgst_percent) || 0;
            const isGstIncluded = !!biz?.gst_included;
            const totalTaxRate = cgstRate + sgstRate;
            
            let totalPricePreview = subtotal;
            if (!isGstIncluded) {
                totalPricePreview = subtotal + (subtotal * totalTaxRate / 100);
            }

            // 5a. Loyalty Check before Order Type
            const checkPoints = await pool.query("SELECT points FROM customer_loyalty WHERE user_id=$1 AND customer_number = $2", [userId, normalizePhone(customerNumber)]);
            const availablePoints = checkPoints.rows[0]?.points || 0;
            const minRedeem = biz?.min_redeem_points || 300;

            if (biz?.loyalty_enabled !== false && availablePoints >= minRedeem) {
                await updateSessionState(userId, customerNumber, 'AWAITING_LOYALTY', session.context);
                await sendOfficialMessage(customerNumber, {
                    type: "interactive",
                    interactive: {
                        type: "button",
                        body: { text: `🎁 *Loyalty Reward Available!*\n\nYou have *${availablePoints} points*.\n\nWould you like to redeem 300 points for a *₹30 discount* on this order?` },
                        action: {
                            buttons: [
                                { type: "reply", reply: { id: "redeem_yes", title: "✅ Yes, Redeem" } },
                                { type: "reply", reply: { id: "redeem_no", title: "❌ No, Skip" } }
                            ]
                        }
                    }
                }, userId);
                return;
            }

            // If it's a table order (QR scan), finalize immediately
            if (session.context.table_number) {
                await finalizeConversationalOrder(userId, customerNumber, customerName, session, biz, symbol);
                return;
            }

            // Otherwise, ask for type
            await updateSessionState(userId, customerNumber, 'AWAITING_TYPE', session.context);
            
            await sendOfficialMessage(customerNumber, {
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { text: "How would you like to receive your delicious meal today?" },
                    action: {
                        buttons: [
                            { type: "reply", reply: { id: "type_pickup", title: "🏪 Pickup" } },
                            { type: "reply", reply: { id: "type_delivery", title: "🚚 Delivery" } }
                        ]
                    }
                }
            }, userId);
            return;
        }

        // 6. CANCEL
        if (['cancel', 'clear', 'start fresh', 'new order'].includes(msgLower)) {
            await clearSession(userId, customerNumber);
            await sendAndLog(customerNumber, `🗑️ Cart cleared! What would you like to order?`, userId);
            return;
        }

        // 7. KEYWORD MATCHING
        let foundItems = [];
        items.forEach(it => {
            const itemNameLower = it.product_name.toLowerCase();
            if (msgLower.includes(itemNameLower)) {
                const escapedName = it.product_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`(\\d+)\\s*(?:x\\s*)?${escapedName}`, "i");
                const regexAfter = new RegExp(`${escapedName}\\s*(\\d+)`, "i");
                const matchBefore = msgText.match(regex);
                const matchAfter = msgText.match(regexAfter);
                
                let qty = 1;
                if (matchBefore) qty = parseInt(matchBefore[1]);
                else if (matchAfter) qty = parseInt(matchAfter[1]);
                
                foundItems.push({ name: it.product_name, qty, price: parseFloat(it.price) });
            }
        });

        if (foundItems.length > 0) {
            let updatedCart = [...cart];
            foundItems.forEach(newItem => {
                const existingIdx = updatedCart.findIndex(c => c.name.toLowerCase() === newItem.name.toLowerCase());
                if (existingIdx >= 0) {
                    updatedCart[existingIdx].qty += newItem.qty;
                } else {
                    updatedCart.push(newItem);
                }
            });

            let totalPrice = updatedCart.reduce((sum, ci) => sum + (ci.qty * ci.price), 0);
            await updateSession(userId, customerNumber, { items: updatedCart, total_price: totalPrice });

            const cartLines = updatedCart.map(ci => `• ${ci.qty}x ${ci.name.toUpperCase()}`);
            await sendAndLog(customerNumber, 
                `📝 *Your Order:*\n${cartLines.join("\n")}\n\n*Total:* ${symbol}${totalPrice}\n\nShall I confirm this order?`, userId);
            return;
        }

        // 8. AI FALLBACK (Enhanced with Bot Knowledge)
        const catalogStr = items.map(i => `${i.product_name}:${symbol}${i.price}`).join(", ");
        const cartStr = cart.length > 0 
            ? `Current cart: ${cart.map(c => `${c.qty}x ${c.name}`).join(", ")}.`
            : "Cart is empty.";

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        
        try {
            const chat = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: `You are the professional digital concierge for ${bizName}, located at ${bizAddress}. 
                    Your goal is to provide a seamless, high-end experience for customers.
                    
                    Menu: [${catalogStr}].
                    Knowledge Base: [${botKnowledge}].
                    ${cartStr}
                    
                    Tone Rules:
                    - Be professional, polite, and efficient.
                    - Use sophisticated language but keep it clear for WhatsApp.
                    - Do NOT use excessive emojis. One relevant emoji per message is fine.
                    - Address the customer with courtesy.
                    
                    Operational Rules:
                    1. Use the knowledge base to answer questions about delivery fees, hours, or policies.
                    2. If adding items, use JSON format: {"reply": "...", "orders": [{"name": "item", "qty": 1}]}.
                    3. If a customer provides feedback/rating, use JSON: {"reply": "...", "feedback": {"rating": 5, "comment": "..."}}. Rating must be 1-5.
                    4. If just answering, set orders to [] and feedback to null.` },
                    { role: "user", content: msgText }
                ],
                model: "llama-3.1-8b-instant",
                response_format: { type: "json_object" }
            });
            const res = JSON.parse(chat.choices[0].message.content);
            
            if (res.orders && res.orders.length > 0) {
                let updatedCart = [...cart];
                res.orders.forEach(o => {
                    const db = items.find(i => i.product_name.toLowerCase().includes(o.name.toLowerCase()));
                    if (db) {
                        const existingIdx = updatedCart.findIndex(c => c.name.toLowerCase() === db.product_name.toLowerCase());
                        if (existingIdx >= 0) updatedCart[existingIdx].qty += o.qty;
                        else updatedCart.push({ name: db.product_name, qty: o.qty, price: parseFloat(db.price) });
                    }
                });
                let totalPrice = updatedCart.reduce((sum, ci) => sum + (ci.qty * ci.price), 0);
                await updateSession(userId, customerNumber, { items: updatedCart, total_price: totalPrice });
                const cartLines = updatedCart.map(ci => `• ${ci.qty}x ${ci.name.toUpperCase()}`);
                await sendAndLog(customerNumber, `📝 *Updated Order:*\n${cartLines.join("\n")}\n\n*Total:* ${symbol}${totalPrice}\n\nConfirm?`, userId);
                return;
            }
            
            if (res.feedback) {
                await pool.query(
                    "INSERT INTO customer_feedback (user_id, customer_number, rating, comment) VALUES ($1, $2, $3, $4)",
                    [userId, normalizePhone(customerNumber), res.feedback.rating || 5, res.feedback.comment || ""]
                );
                await sendAndLog(customerNumber, res.reply || "Thank you for your feedback! We truly value your input. ❤️", userId);
                return;
            }

            await sendAndLog(customerNumber, res.reply || "I'm sorry, I'm not sure about that. Can I help you with your order?", userId);
        } catch (e) {
            await sendAndLog(customerNumber, "I'm here! What would you like to order?", userId);
        }
    } catch (err) {
        console.error("AI FAIL:", err);
    }
};

// ----------------------------------------------------------------------------------
// ✅ Finalize Conversational Order (Helper to bridge session contexts)
const finalizeConversationalOrder = async (userId, customerNumber, customerName, session, biz, symbol) => {
    const cart = session.context.items || [];
    const tableId = session.context.table_number;
    const orderType = tableId ? 'table' : (session.context.order_type || 'pickup');
    const address = session.context.delivery_address || (tableId ? `Table ${tableId}` : null);
    const redeem = session.context.redeem_points || 0;
    
    await finalizeOrder(userId, customerNumber, customerName, cart, symbol, orderType, address, tableId, redeem);
};

// ----------------------------------------------------------------------------------
// ✅ Finalize Order (Save to DB + Notify Kitchen & Staff)
// ----------------------------------------------------------------------------------
const finalizeOrder = async (userId, customerNumber, customerName, cart, symbol, orderType, address, tableNumber = null, pointsToRedeem = 0) => {
    try {
        const bizRes = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [userId]);
        const biz = bizRes.rows[0];
        
        let subtotal = cart.reduce((sum, ci) => sum + (ci.qty * ci.price), 0);
        
        // GST Calculation Logic
        const cgstRate = parseFloat(biz?.cgst_percent) || 0;
        const sgstRate = parseFloat(biz?.sgst_percent) || 0;
        const isGstIncluded = !!biz?.gst_included;
        const showGst = !!biz?.show_gst_on_receipt;

        let cgstAmount = 0;
        let sgstAmount = 0;
        let finalGrandTotal = subtotal;

        if (cgstRate > 0 || sgstRate > 0) {
            if (isGstIncluded) {
                const totalRate = cgstRate + sgstRate;
                const basePrice = subtotal / (1 + totalRate / 100);
                cgstAmount = basePrice * (cgstRate / 100);
                sgstAmount = basePrice * (sgstRate / 100);
            } else {
                cgstAmount = subtotal * (cgstRate / 100);
                sgstAmount = subtotal * (sgstRate / 100);
                finalGrandTotal = subtotal + cgstAmount + sgstAmount;
            }
        }

        // Deduct points from total price based on ratio
        let discountAmount = 0;
        const ptsRatio = parseFloat(biz.points_to_amount_ratio) || 10.00;
        const ptsEnabled = biz.loyalty_enabled !== false;

        if (ptsEnabled && pointsToRedeem > 0) {
            discountAmount = pointsToRedeem / ptsRatio;
            finalGrandTotal = Math.max(0, finalGrandTotal - discountAmount);
        }

        const cartLines = cart.map(ci => `• ${ci.qty}x ${ci.name}`);
        const orderRef = "WA-" + Math.random().toString(36).substring(7).toUpperCase();
        
        // Loyalty Calc (Dynamic points per 100 spent)
        const ptsEarnRate = (parseFloat(biz.points_per_100) || 5) / 100;
        const earned = ptsEnabled ? Math.floor(finalGrandTotal * ptsEarnRate) : 0;

        // 1. Save core order
        await pool.query(
            `INSERT INTO orders (user_id, customer_name, customer_number, address, items, total_price, order_reference, status, table_number) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [userId, customerName, normalizePhone(customerNumber), 
             orderType === 'delivery' ? (address || 'Delivery') : (tableNumber ? `Table ${tableNumber}` : 'Pickup'),
             JSON.stringify(cart), finalGrandTotal, orderRef, 'PENDING', tableNumber]
        );

        // 2. Marketing / Loyalty
        await upsertContact(userId, customerNumber, customerName);

        const loyaltyCheck = await pool.query(
            `INSERT INTO customer_loyalty (user_id, customer_number, name, total_spent, points, last_visit)
             VALUES ($1, $2, $3, $4, $5, NOW())
             ON CONFLICT (user_id, customer_number) 
             DO UPDATE SET 
                name = EXCLUDED.name,
                total_spent = customer_loyalty.total_spent + EXCLUDED.total_spent,
                points = (customer_loyalty.points + EXCLUDED.points) - $6,
                last_visit = NOW()
             RETURNING points`,
            [userId, normalizePhone(customerNumber), customerName || 'Customer', finalGrandTotal, earned, pointsToRedeem]
        );
        const finalPoints = loyaltyCheck.rows[0]?.points || earned;

        await clearSession(userId, customerNumber);
        const typeLabel = tableNumber ? `🪑 Table ${tableNumber}` : (orderType === 'delivery' ? '🚚 Delivery' : '🏪 Pickup');
        
        // Build receipt message
        let receiptParts = [
            `✅ *Order Confirmed!*`,
            ``,
            ...cartLines,
            `────────────────`,
            `Subtotal: ${symbol}${subtotal.toFixed(2)}`
        ];

        if (showGst && (cgstAmount > 0 || sgstAmount > 0)) {
            if (cgstAmount > 0) receiptParts.push(`CGST (${cgstRate}%): ${symbol}${cgstAmount.toFixed(2)}`);
            if (sgstAmount > 0) receiptParts.push(`SGST (${sgstRate}%): ${symbol}${sgstAmount.toFixed(2)}`);
        }

        if (discountAmount > 0) {
            receiptParts.push(`🎁 Loyalty Discount: -${symbol}${discountAmount.toFixed(2)}`);
        }

        receiptParts.push(`*Total: ${symbol}${finalGrandTotal.toFixed(2)}*`);
        if (isGstIncluded && showGst) receiptParts.push(`_(Prices include GST)_`);
        
        receiptParts.push(
            `────────────────`,
            `*Type:* ${typeLabel}`,
            `*Ref:* ${orderRef}`,
            ``
        );

        if (ptsEnabled && earned > 0) {
            receiptParts.push(`🎁 *Loyalty Reward:* You earned *${earned} points*! New balance: *${finalPoints} points*.`, ``);
        }

        receiptParts.push(`Thank you, ${customerName}! We are preparing your order. 🎉`);

        const confirmMsg = receiptParts.join("\n");
        await sendAndLog(customerNumber, confirmMsg, userId);
        
        // Notify Staff
        await notifyKitchenAndStaff(userId, orderRef, customerName, customerNumber, cart, subtotal, finalGrandTotal, cgstAmount, sgstAmount, cgstRate, sgstRate, symbol, orderType, address, tableNumber, discountAmount);

    } catch (e) { 
        console.error("Order Finalization Error:", e);
    }
};

const notifyKitchenAndStaff = async (userId, orderRef, customerName, customerNumber, cart, subtotal, total, cgst, sgst, cr, sr, symbol, orderType, address, tableNumber, pointsToRedeem = 0) => {
    try {
        const bizRes = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [userId]);
        const biz = bizRes.rows[0];
        const kotItemLines = cart.map(i => `  • ${i.qty}x ${i.name}`).join("\n");
        const staffItemLines = cart.map(i => `  • ${i.qty}x ${i.name} — ${symbol}${i.qty * i.price}`).join("\n");
        
        const kot = [
            `🍽️ *====== KITCHEN ORDER TICKET ======*`,
            `*Ref:* ${orderRef}`,
            `*Target:* ${tableNumber ? 'TABLE ' + tableNumber : orderType.toUpperCase()}`,
            `*Customer:* ${customerName}${customerNumber && customerNumber !== 'QR-ORDER' ? `\n*Phone:* ${customerNumber}` : ''}${orderType === 'delivery' && address ? `\n*Address:* ${address}` : ''}`,
            ``,
            `--- ITEMS ---`,
            kotItemLines,
            `────────────────`
        ].join("\n");

        const staffMsgArr = [
            `🔔 *NEW ORDER!*`,
            `*Ref:* ${orderRef}`,
            `*Type:* ${tableNumber ? 'Table ' + tableNumber : (orderType === 'delivery' ? 'Delivery' : 'Pickup')}`,
            `*Customer:* ${customerName}${customerNumber && customerNumber !== 'QR-ORDER' ? `\n*Phone:* ${customerNumber}` : ''}${orderType === 'delivery' && address ? `\n*Address:* ${address}` : ''}`,
            ``,
            `--- ORDER DETAILS ---`,
            staffItemLines,
            `───────────────`
        ];

        if (biz.show_gst_on_receipt) {
            staffMsgArr.push(`*Breakdown:* Sub: ${symbol}${subtotal.toFixed(2)} | Tax: ${symbol}${(cgst+sgst).toFixed(2)}`);
        }
        if (pointsToRedeem > 0) {
            staffMsgArr.push(`*Loyalty Discount:* -${symbol}${pointsToRedeem.toFixed(2)}`);
        }
        staffMsgArr.push(`*Total:* ${symbol}${total.toFixed(2)}`);
        staffMsgArr.push(`────────────────`);

        const staffMsg = staffMsgArr.join("\n");

        if (biz.kitchen_number) await sendOfficialMessage(biz.kitchen_number.replace(/\D/g, ""), kot, userId);
        if (biz.notification_numbers) {
            for (let num of biz.notification_numbers) {
                await sendOfficialMessage(num.replace(/\D/g, ""), staffMsg, userId);
            }
        }
    } catch (e) { console.error("Staff Notify Error:", e); }
};

// ----------------------------------------------------------------------------------
// 📊 Get Recent Chat Messages (for Live AI Inbox)
// ----------------------------------------------------------------------------------
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
// 💰 Wallet / Broadcast Credit Management
// ----------------------------------------------------------------------------------
const getWalletCredits = async (userId) => {
    try {
        const res = await pool.query("SELECT broadcast_credits FROM app_users WHERE id = $1", [userId]);
        return res.rows[0]?.broadcast_credits || 0;
    } catch (e) {
        console.error("Wallet read error:", e.message);
        return 0;
    }
};

const deductWalletCredits = async (userId, cost) => {
    try {
        const current = await getWalletCredits(userId);
        if (current < cost) {
            return { success: false, error: `Insufficient credits. You have ${current} but need ${cost}.` };
        }
        const res = await pool.query(
            "UPDATE app_users SET broadcast_credits = broadcast_credits - $1 WHERE id = $2 RETURNING broadcast_credits",
            [cost, userId]
        );
        return { success: true, newBalance: res.rows[0].broadcast_credits };
    } catch (e) {
        console.error("Wallet deduct error:", e.message);
        return { success: false, error: e.message };
    }
};

module.exports = {
  initializeSession: async (id) => ({ status: 'CONNECTED' }),
  getSessionStatus: async (userId) => ({}),
  handleMetaWebhook,
  sendOfficialMessage,
  getRecentChats,
  logChat,
  getWalletCredits,
  deductWalletCredits,
  notifyKitchenAndStaff,
  syncBusinessProfileToWhatsApp
};
