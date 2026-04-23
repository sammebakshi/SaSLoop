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
            `*Target:* ${tableNumber ? 'TABLE ' + tableNumber : orderType.toUpperCase()}`,
            `*Customer:* ${customerName}${customerNumber && customerNumber !== 'QR-ORDER' ? `\n*Phone:* ${customerNumber}` : ''}${orderType === 'delivery' && address ? `\n*Address:* ${address}` : ''}`,
            ``,
            `--- ITEMS ---`,
            kotItemLines,
            `────────────────`
        ].join("\n");

        const staffMsgArr = [
            `🔔 *NEW ORDER RECEIVED!*`,
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
        if (discountAmount > 0) {
            staffMsgArr.push(`*Discount:* -${symbol}${discountAmount.toFixed(2)}`);
        }
        staffMsgArr.push(`*Total:* ${symbol}${total.toFixed(2)}`);
        staffMsgArr.push(`────────────────`);

        const staffMsg = staffMsgArr.join("\n");

        // 🚛 RELAY TO KITCHEN
        if (biz.kitchen_number) {
            console.log(`[NOTIFY-KITCHEN] Relaying to Number: ${biz.kitchen_number}`);
            const res = await sendOfficialMessage(biz.kitchen_number, kot, userId);
            if (!res.success) console.error(`[NOTIFY-KITCHEN-FAIL] Reason:`, res.error);
        }

        // 🚛 RELAY TO STAFF
        if (biz.notification_numbers && Array.isArray(biz.notification_numbers)) {
            console.log(`[NOTIFY-STAFF] Relaying to ${biz.notification_numbers.length} staff numbers...`);
            for (let num of biz.notification_numbers) {
                const res = await sendOfficialMessage(num, staffMsg, userId);
                if (!res.success) console.error(`[NOTIFY-STAFF-FAIL] Number: ${num} | Reason:`, res.error);
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

const processAiAutomations = async (userId, customerNumber, msgText, customerName) => {
    // Placeholder for simplified AI logic
    if (msgText.toLowerCase().includes("hi")) {
        await sendAndLog(customerNumber, "Hello! How can I assist you with your order today?", userId);
    }
};

module.exports = {
  handleMetaWebhook,
  sendOfficialMessage,
  getRecentChats,
  logChat,
  notifyKitchenAndStaff,
  syncBusinessProfileToWhatsApp
};
