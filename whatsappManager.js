const pool = require("./db");
const Groq = require("groq-sdk");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { isBusinessOpen, getDeliveryDetails } = require("./utils/businessUtils");
const { triggerWebhook } = require("./utils/webhookUtils");


const normalizePhone = (p) => {
    if (!p) return "";
    let digits = p.replace(/\D/g, "");
    // If it's a 10-digit number, prepend 91 (India) as the default region
    if (digits.length === 10) digits = "91" + digits;
    return `+${digits}`;
};

const formatToInter = (p) => {
    return normalizePhone(p);
};

const sendOfficialMessage = async (to, content, userId) => {
    try {
        let dbRes = await pool.query(
            `SELECT id, meta_access_token, meta_phone_id 
             FROM app_users 
             WHERE (id = $1 OR id = (SELECT parent_user_id FROM app_users WHERE id = $1)) 
               AND meta_access_token IS NOT NULL 
               AND meta_phone_id IS NOT NULL 
               AND LENGTH(meta_access_token) > 20 
               AND meta_phone_id != '123'
             ORDER BY CASE WHEN id = $1 THEN 0 ELSE 1 END
             LIMIT 1`,
            [userId]
        );
        if (dbRes.rows.length === 0) {
            dbRes = await pool.query("SELECT id, meta_access_token, meta_phone_id FROM app_users WHERE meta_access_token IS NOT NULL AND meta_phone_id IS NOT NULL AND LENGTH(meta_access_token) > 20 AND meta_phone_id != '123' ORDER BY id ASC LIMIT 1");
        }
        let { meta_access_token: token, meta_phone_id: phoneId } = dbRes.rows[0] || {};
        if (token) token = token.trim();
        if (phoneId) phoneId = phoneId.trim();

        // Fall back to system ENV if DB token is missing, too short, or dummy
        if (!token || !phoneId || token.length < 20 || phoneId === '123') {
            token = process.env.META_ACCESS_TOKEN ? process.env.META_ACCESS_TOKEN.trim() : null;
            phoneId = process.env.META_PHONE_ID ? process.env.META_PHONE_ID.trim() : null;
        }

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
                language: { code: content.lang || "en" }
            };
            if (content.params && content.params.length > 0) {
                payload.template.components = [
                    {
                        type: "body",
                        parameters: content.params.map(p => ({ type: "text", text: String(p) }))
                    }
                ];
            }
        } else if (content.imageUrl && content.button) {
            // Interactive message with Image header and CTA button
            payload.type = "interactive";
            payload.interactive = {
                type: "button",
                header: { type: "image", image: { link: content.imageUrl } },
                body: { text: content.message || "Message from SaSLoop ERP | AI" },
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
                body: { text: content.message || "Message from SaSLoop ERP | AI" },
                action: {
                    buttons: [
                        { type: "reply", reply: { id: "cta_btn", title: content.button.text || "Click Here" } }
                    ]
                }
            };
        } else {
            Object.assign(payload, content);
        }
        
        let response;
        try {
            response = await axios.post(`https://graph.facebook.com/v21.0/${phoneId}/messages`, payload, {
                headers: { "Authorization": `Bearer ${token}` }
            });
        } catch (apiErr) {
            const errData = apiErr.response?.data;
            console.error(`⚠️ Meta API attempt 1 failed (phoneId: ${phoneId}):`, errData || apiErr.message);
            const envToken = process.env.META_ACCESS_TOKEN ? process.env.META_ACCESS_TOKEN.trim() : null;
            const envPhoneId = process.env.META_PHONE_ID ? process.env.META_PHONE_ID.trim() : null;

            if (envToken && envPhoneId && (token !== envToken || phoneId !== envPhoneId)) {
                console.log(`🔄 Retrying Meta send with System ENV credentials (${envPhoneId})...`);
                try {
                    response = await axios.post(`https://graph.facebook.com/v21.0/${envPhoneId}/messages`, payload, {
                        headers: { "Authorization": `Bearer ${envToken}` }
                    });
                    console.log("✅ Retry with System ENV credentials succeeded!");
                } catch (retryErr) {
                    console.error("❌ Retry with System ENV credentials failed:", retryErr.response?.data || retryErr.message);
                    return { success: false, error: retryErr.response?.data || retryErr.message };
                }
            } else {
                return { success: false, error: errData || apiErr.message };
            }
        }

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

const sendPdfDocument = async (to, pdfBuffer, filename, userId, caption = "") => {
    try {
        const dbRes = await pool.query("SELECT id, meta_access_token, meta_phone_id FROM app_users WHERE id = $1", [userId]);
        let { meta_access_token: token, meta_phone_id: phoneId } = dbRes.rows[0] || {};
        if (token) token = token.trim();
        if (phoneId) phoneId = phoneId.trim();
        if (!token || !phoneId) return { success: false, error: "Missing Meta credentials" };

        const FormData = require("form-data");
        const formData = new FormData();
        formData.append("file", pdfBuffer, { filename: filename || "Invoice.pdf", contentType: "application/pdf" });
        formData.append("messaging_product", "whatsapp");
        formData.append("type", "application/pdf");

        const uploadRes = await axios.post(`https://graph.facebook.com/v21.0/${phoneId}/media`, formData, {
            headers: { ...formData.getHeaders(), Authorization: `Bearer ${token}` },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        const mediaId = uploadRes.data?.id;
        if (!mediaId) return { success: false, error: "Media upload failed" };

        const cleanTo = formatToInter(to);
        const payload = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: cleanTo,
            type: "document",
            document: {
                id: mediaId,
                filename: filename || "Invoice.pdf",
                caption: caption || ""
            }
        };

        const response = await axios.post(`https://graph.facebook.com/v21.0/${phoneId}/messages`, payload, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        await logChat(userId, cleanTo, 'bot', `[PDF Document: ${filename || 'Invoice.pdf'}]`);
        return { success: true, data: response.data };
    } catch (e) {
        console.error(`[PDF-SEND-FAILURE] To: ${to} | Error:`, e.response?.data || e.message);
        return { success: false, error: e.response?.data || e.message };
    }
};
const { deductInventoryForOrder } = require("./utils/inventoryDeduction");

const deductInventory = async (userId, cart, orderRef = 'WHATSAPP-ORDER') => {
    try {
        await deductInventoryForOrder(userId, cart, 'WHATSAPP', orderRef);
    } catch (e) {
        console.error("Failed to deduct inventory for WhatsApp order:", e);
    }
};

const upsertContact = async (userId, phone, name) => {
    try {
        const cleanNum = normalizePhone(phone);
        await pool.query(
            `INSERT INTO marketing_contacts (user_id, phone_number, name, last_order_at) 
             VALUES ($1, $2, $3, NOW()) 
             ON CONFLICT (user_id, phone_number) DO UPDATE SET name = EXCLUDED.name, last_order_at = NOW()`,
            [userId, cleanNum, name]
        );
        await pool.query(
            `INSERT INTO customers (user_id, name, number) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (user_id, number) DO UPDATE SET name = EXCLUDED.name`,
            [userId, name || 'Customer', cleanNum]
        );
    } catch (e) {
        console.error("Error upserting customer contact:", e);
    }
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
             ORDER BY created_at DESC LIMIT 2000`,
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
        const bizRes = await pool.query("SELECT * FROM restaurants WHERE user_id = $1 OR id = $1", [userId]);
        const biz = bizRes.rows[0];
        if (!biz) return;

        const safeCart = Array.isArray(cart) ? cart : (typeof cart === 'string' ? JSON.parse(cart) : []);
        const kotItemLines = safeCart.map(i => `  • ${i.qty || i.quantity || 1}x ${i.product_name || i.name || 'Item'}`).join("\n");
        const staffItemLines = safeCart.map(i => `  • ${i.qty || i.quantity || 1}x ${i.product_name || i.name || 'Item'} — ${symbol}${((i.qty || i.quantity || 1) * (i.price || 0)).toFixed(2)}`).join("\n");
        
        const kot = [
            `🍽️ *====== KITCHEN ORDER TICKET (KOT) ======*`,
            `*Ref:* ${orderRef}`,
            `*Target:* ${tableNumber ? 'TABLE ' + tableNumber : (orderType.toUpperCase() === 'PICKUP' ? '🥡 PICKUP' : '🛵 DELIVERY')}`,
            `*Customer:* ${customerName}`,
            `*Phone:* ${customerNumber}`,
            `*Items:*\n${kotItemLines}`
        ].join("\n");

        const staffMsg = [
            `🔔 *NEW ${orderType.toUpperCase()} ORDER RECEIVED!*`,
            `*Ref:* ${orderRef}`,
            `*Customer:* ${customerName} (${customerNumber})`,
            `*Target:* ${tableNumber ? 'TABLE ' + tableNumber : (orderType.toUpperCase() === 'PICKUP' ? '🥡 PICKUP' : '🛵 DELIVERY')}`,
            `*Address:* ${address || 'N/A'}`,
            `───────────────`,
            staffItemLines,
            `───────────────`,
            `*Total: ${symbol}${(total || 0).toFixed(2)}*`,
            `*Status:* ⏳ PENDING POS CONFIRMATION`
        ].join("\n");

        // 1. Send KOT to Kitchen Number
        const kitchenNum = biz.kitchen_number || biz.phone || biz.contact_number;
        if (kitchenNum) {
            await sendOfficialMessage(kitchenNum, { text: { body: kot }, skipLog: true }, userId);
        }

        // 2. Send Order Alert to Staff Numbers
        let staffNums = (biz.notification_numbers && biz.notification_numbers.length > 0)
            ? biz.notification_numbers
            : [biz.phone, biz.contact_number].filter(Boolean);

        // Remove duplicates
        staffNums = [...new Set(staffNums)];

        for (let num of staffNums) {
            await sendOfficialMessage(num, { text: { body: staffMsg }, skipLog: true }, userId);
        }

        // 📦 Deduct stock on successful notification
        await deductInventory(userId, safeCart);
    } catch (e) { console.error("Notify Kitchen & Staff Error:", e); }
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

const getItemOptions = async (itemId, userId) => {
    try {
        let targetItemName = null;
        const itemInfoRes = await pool.query(
            "SELECT id, item_name FROM outlet_menu_items WHERE id = $1 LIMIT 1",
            [itemId]
        );
        if (itemInfoRes.rows.length > 0) {
            targetItemName = itemInfoRes.rows[0].item_name;
        }

        const candidateIdsRes = await pool.query(
            `SELECT omi.id, omi.menu_id 
             FROM outlet_menu_items omi
             JOIN outlet_menus om ON omi.menu_id = om.id
             WHERE (om.outlet_id = $1 OR om.user_id = $1)
               AND (omi.id = $2 OR LOWER(omi.item_name) = LOWER($3))
             ORDER BY om.is_digital_default DESC, om.is_digital DESC, om.is_pos_default DESC`,
            [userId, itemId, targetItemName || '']
        );
        const candidateIds = candidateIdsRes.rows.map(r => r.id);

        if (candidateIds.length > 0) {
            // 1. Check item_type = '1' direct sub-items under base item in outlet_menu_items (e.g. HALF / FULL)
            for (const cand of candidateIdsRes.rows) {
                const subItemsRes = await pool.query(
                    `SELECT id, item_name as name, base_price as price
                     FROM outlet_menu_items
                     WHERE menu_id = $1
                       AND item_type = '1'
                       AND id > $2
                       AND id < COALESCE(
                         (SELECT MIN(id) FROM outlet_menu_items WHERE item_type = '0' AND menu_id = $1 AND id > $2),
                         99999999
                       )
                     ORDER BY id ASC`,
                    [cand.menu_id, cand.id]
                );
                if (subItemsRes.rows.length > 0) {
                    return {
                        groupId: cand.id,
                        groupName: "Size/Portion",
                        minSelectable: 1,
                        maxSelectable: 1,
                        options: subItemsRes.rows.map(o => ({
                            id: o.id,
                            name: o.name,
                            price: parseFloat(o.price) || 0
                        }))
                    };
                }
            }

            // 2. Check item_option_groups & options_list fallback
            const ogRes = await pool.query(
                `SELECT og.id, og.name, og.min_selectable, og.max_selectable
                 FROM option_groups og
                 JOIN item_option_groups iog ON og.id = iog.group_id
                 WHERE iog.item_id = ANY($1) AND og.is_active = true 
                 ORDER BY og.sorting_order ASC, og.id ASC`,
                [candidateIds]
            );

            if (ogRes.rows.length > 0) {
                const og = ogRes.rows[0];
                const groupIds = ogRes.rows.map(r => r.id);

                const optionsRes = await pool.query(
                    `SELECT DISTINCT ON (ol.id) 
                        ol.id, ol.group_id, ol.name, ol.price_override, 
                        omi.base_price as matched_price,
                        omi.id as menu_item_id
                     FROM options_list ol 
                     LEFT JOIN outlet_menu_items omi ON (omi.menu_id IN (
                        SELECT id FROM outlet_menus WHERE (outlet_id = $1 OR user_id = $1)
                     )) AND (
                        omi.item_name ILIKE ol.name 
                        OR omi.item_name ILIKE '%' || ol.name
                        OR ol.name ILIKE '%' || omi.item_name
                     ) AND omi.is_active = true
                     LEFT JOIN outlet_menus om ON omi.menu_id = om.id
                     WHERE ol.group_id = ANY($2) AND ol.is_active = true 
                     ORDER BY ol.id ASC, om.is_digital_default DESC NULLS LAST, om.is_digital DESC NULLS LAST, omi.id ASC`,
                    [userId, groupIds]
                );

                if (optionsRes.rows.length > 0) {
                    const parsedOptions = optionsRes.rows.map(ol => {
                        const overridePrice = parseFloat(ol.price_override) || 0;
                        const matchedPrice = parseFloat(ol.matched_price) || 0;
                        const price = overridePrice > 0 ? overridePrice : matchedPrice;
                        return {
                            id: ol.menu_item_id || ol.id,
                            name: ol.name,
                            price: price
                        };
                    });

                    return {
                        groupId: og.id,
                        groupName: og.name,
                        minSelectable: og.min_selectable,
                        maxSelectable: og.max_selectable,
                        options: parsedOptions
                    };
                }
            }
        }

        return null;
    } catch (e) {
        console.error("Error fetching item options:", e);
        return null;
    }
};

const sendTypingIndicator = async (to, messageId, userId) => {
    try {
        const dbRes = await pool.query("SELECT id, meta_access_token, meta_phone_id FROM app_users WHERE id = $1", [userId]);
        let { meta_access_token: token, meta_phone_id: phoneId } = dbRes.rows[0] || {};
        if (token) token = token.trim();
        if (phoneId) phoneId = phoneId.trim();

        if (!token || !phoneId) return { success: false, error: "Missing Meta credentials" };

        const cleanTo = formatToInter(to);
        const payload = {
            messaging_product: "whatsapp",
            status: "read",
            message_id: messageId,
            typing_indicator: {
                type: "text"
            }
        };

        const response = await axios.post(`https://graph.facebook.com/v21.0/${phoneId}/messages`, payload, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        return { success: true, data: response.data };
    } catch (e) {
        console.error(`[META-TYPING-FAILURE] To: ${to} | Error:`, e.response?.data || e.message);
        return { success: false, error: e.response?.data || e.message };
    }
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
            const context = typeof sess.context === 'string' ? JSON.parse(sess.context) : (sess.context || { cart: [] });
            
            // Auto-timeout after 30 minutes of inactivity
            const lastActive = new Date(sess.updated_at || sess.last_interaction).getTime();
            const now = Date.now();
            if (now - lastActive > 30 * 60 * 1000) {
                console.log(`🕒 [TIMEOUT] Resetting session state to IDLE and clearing pending context variables for ${cleanNum}`);
                sess.state = 'IDLE';
                delete context.pending_selection;
                delete context.pending_option_selection;
                delete context.pending_item;
                delete context.pending_ambiguous;
                delete context.pendingOrder;
                
                await pool.query(
                    "UPDATE conversation_sessions SET state = 'IDLE', context = $1, updated_at = NOW() WHERE id = $2",
                    [JSON.stringify(context), sess.id]
                );
            }
            
            return {
                ...sess,
                context
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

// Smart helper: uses buttons for ≤3 options, List for 4+ options (WhatsApp button limit = 3)
// Smart helper: uses buttons for ≤3 short options, List for long options or 4+ options (WhatsApp button limit = 3, max title length = 20)
const sendOptionsPicker = async (to, bodyText, options, userId, symbol, mainItemName = "") => {
    // Clean option names if they repeat the main item name prefix (e.g. "CHICKEN KANTI BONELESS 12 Pcs" -> "12 Pcs")
    const cleanedOptions = options.map(opt => {
        let cleanName = opt.name;
        if (mainItemName && cleanName.toLowerCase().startsWith(mainItemName.toLowerCase())) {
            cleanName = cleanName.substring(mainItemName.length).trim();
        }
        if (!cleanName) cleanName = opt.name;
        return {
            ...opt,
            cleanName
        };
    });

    const buttonTitles = cleanedOptions.map(opt => `${opt.cleanName} (${symbol}${opt.price})`);
    const isSuitableForButtons = cleanedOptions.length <= 3 &&
        buttonTitles.every(t => t.length <= 20) &&
        new Set(buttonTitles).size === buttonTitles.length;

    if (isSuitableForButtons) {
        const buttons = cleanedOptions.map(opt => ({
            id: `opt_${opt.id}`,
            title: `${opt.cleanName} (${symbol}${opt.price})`
        }));
        return sendButtons(to, bodyText, buttons, userId);
    } else {
        // Fallback to WhatsApp List message (supports titles up to 24 chars, prices in description)
        const rows = cleanedOptions.map(opt => ({
            id: `opt_${opt.id}`,
            title: opt.cleanName.substring(0, 24),
            description: `${symbol}${opt.price}`
        }));
        const sections = [];
        for (let i = 0; i < rows.length; i += 10) {
            sections.push({
                title: sections.length === 0 ? "📋 Available Options" : "More Options",
                rows: rows.slice(i, i + 10)
            });
        }
        return sendList(to, "Select Option", bodyText, "✨ View All Options ✨", sections.slice(0, 10), userId);
    }
};

const buildGroupRows = async (groupNames, groups, userId, symbol) => {
    return Promise.all(groupNames.map(async name => {
        const items = groups[name];
        let optCount = items.length;
        let minPrice = Math.min(...items.map(i => i.price));

        if (items.length === 1) {
            const optData = await getItemOptions(items[0].id, userId);
            if (optData && optData.options && optData.options.length > 0) {
                optCount = optData.options.length;
                const optMinPrice = Math.min(...optData.options.map(o => o.price));
                if (optMinPrice > 0 && !isNaN(optMinPrice)) {
                    minPrice = optMinPrice;
                }
            }
        }

        if (isNaN(minPrice) || minPrice === Infinity) minPrice = 0;

        return {
            id: `group_${name}`,
            title: name.substring(0, 24),
            description: `${optCount} option${optCount > 1 ? 's' : ''} — from ${symbol}${minPrice}`
        };
    }));
};

// ----------------------------------------------------------------------------------
// 🧠 CONVERSATIONAL AI ENGINE
// ----------------------------------------------------------------------------------
const processAiAutomations = async (userId, customerNumber, msgText, customerName, isLocation = false, locationData = null) => {
    try {
        let lower = msgText.trim().toLowerCase();
        const cleanNum = normalizePhone(customerNumber);
        
        // --- 🔍 FETCH BIZ DATA FIRST (For Hours & Branding Check) ---
        const bizRes = await pool.query(
            `SELECT r.*, u.bot_knowledge, u.business_name AS user_biz_name, u.brand_name AS user_brand_name, u.name AS user_name 
             FROM app_users u 
             LEFT JOIN restaurants r ON (r.user_id = u.id OR r.user_id = u.parent_user_id) 
             WHERE u.id = $1 OR u.id = (SELECT parent_user_id FROM app_users WHERE id = $1)
             ORDER BY r.id DESC LIMIT 1`, 
            [userId]
        );
        const biz = bizRes.rows[0];
        if (!biz) return;
        const bizName = (biz?.name && biz.name.trim()) || (biz?.user_brand_name && biz.user_brand_name.trim()) || (biz?.user_biz_name && biz.user_biz_name.trim()) || (biz?.user_name && biz.user_name.trim()) || "our restaurant";

        const session = await getSession(userId, cleanNum);

        // --- 📍 HANDLE WHATSAPP NATIVE GPS LOCATION MESSAGE ---
        if (isLocation && locationData && locationData.latitude && locationData.longitude) {
            const deliveryInfo = await getDeliveryDetails(biz, locationData.latitude, locationData.longitude);
            const distKm = deliveryInfo ? deliveryInfo.distance : null;
            const isCovered = deliveryInfo ? deliveryInfo.serviceable : true;

            session.context.delivery_lat = locationData.latitude;
            session.context.delivery_lng = locationData.longitude;
            session.context.delivery_distance_km = distKm;

            if (!isCovered) {
                session.context.pendingOrder = null;
                await updateSession(userId, cleanNum, session.state, session.context);

                const maxDist = deliveryInfo?.maxRadius || biz.delivery_radius_km || 15;
                let unservMsg = `📍 *LOCATION OUTSIDE DELIVERY ZONE*\n━━━━━━━━━━━━━━\n`;
                if (distKm !== null) unservMsg += `📏 *Driving Distance:* ${distKm} KM\n`;
                unservMsg += `🚫 Sorry! Your address is outside our delivery radius of *${maxDist} KM*.\n\n`;
                unservMsg += `We cannot deliver to this address. Would you like to switch your order to *Pickup* (Takeaway) or cancel your order?`;

                await sendButtons(customerNumber, unservMsg, [
                    { id: 'mode_pickup', title: '🥡 Switch to Pickup' },
                    { id: 'cancel_order', title: '❌ Cancel Order' }
                ], userId);
                return;
            }

            // If customer is in ordering flow (AWAITING_LOCATION or has cart items), proceed directly to Order Summary!
            if (session.state === 'AWAITING_LOCATION' || (session.context.cart && session.context.cart.length > 0)) {
                session.state = 'AWAITING_LOCATION';
                await updateSession(userId, cleanNum, 'AWAITING_LOCATION', session.context);
                // Fall through to AWAITING_LOCATION handler below
            } else {
                await updateSession(userId, cleanNum, session.state, session.context);

                let locReply = `📍 *LOCATION RECEIVED & SAVED!*\n━━━━━━━━━━━━━━\n`;
                if (distKm !== null) {
                    locReply += `📏 *Driving Distance:* ${distKm} KM\n`;
                    locReply += `🚚 *Delivery Status:* ✅ Covered (Within Service Zone)\n\n`;
                }
                locReply += `Your delivery coordinates have been saved. Tap below to continue your order! 🍔 🥤`;
                
                await sendButtons(customerNumber, locReply, [
                    { id: 'place_order', title: '🛍️ Place an Order' },
                    { id: 'view_menu', title: '📜 View Digital Menu' }
                ], userId);
                return;
            }
        }

        // --- ⭐ HANDLE 5-STAR RATING & GOOGLE REVIEW BOOSTER ---
        if (lower.startsWith('rating_') || (lower.includes('star') && !lower.includes('start'))) {
            let stars = 5;
            if (lower.includes('1') || lower.includes('one')) stars = 1;
            else if (lower.includes('2') || lower.includes('two')) stars = 2;
            else if (lower.includes('3') || lower.includes('three')) stars = 3;
            else if (lower.includes('4') || lower.includes('four')) stars = 4;
            else if (lower.includes('5') || lower.includes('five')) stars = 5;

            if (stars >= 4) {
                const googleLink = biz.google_review_link || `https://maps.google.com/?q=${encodeURIComponent(biz.name || 'Our Restaurant')}`;
                const happyMsg = `🌟 *THANK YOU FOR THE ${stars}-STAR RATING!* 🌟\n━━━━━━━━━━━━━━\nWe are delighted you enjoyed your meal! 🙏\n\nIf you have 10 seconds, please share your love on Google Maps:\n👉 ${googleLink}\n\nYour review helps us serve you better! ✨`;
                await sendOfficialMessage(customerNumber, happyMsg, userId);
            } else {
                const apologyMsg = `🙏 *THANK YOU FOR YOUR FEEDBACK*\n━━━━━━━━━━━━━━\nWe are sorry your experience fell short of 5 stars (${stars}/5).\n\nWe have forwarded your feedback directly to our restaurant manager to make things right for your next visit!`;
                await sendOfficialMessage(customerNumber, apologyMsg, userId);
            }
            return;
        }

        // --- 🔐 HANDLE AUTHENTICATION TOKEN (Verify using WhatsApp) ---
        if (lower.includes('verify my number') || lower.includes('sa-') || lower.includes('red-')) {
            const tokenMatch = msgText.match(/SA-[A-F0-9]{6}/i);
            const redemptionMatch = msgText.match(/RED-[A-Z0-9]{6}/i);

            if (tokenMatch) {
                const token = tokenMatch[0].toUpperCase();
                const authRes = await pool.query(
                    "UPDATE pending_auths SET is_verified = TRUE, phone = $1 WHERE token = $2 RETURNING *",
                    [cleanNum, token]
                );

                if (authRes.rows.length > 0) {
                    const welcomeMsg = `✅ *Verification Successful!*\n\nReturn to your browser - you are now securely logged in to *${biz.name}*. 🌟\n\nYou can now view your orders and earn rewards!`;
                    await sendOfficialMessage(customerNumber, welcomeMsg, userId);
                    return;
                }
            }

            if (redemptionMatch) {
                const token = redemptionMatch[0].toUpperCase();
                const redRes = await pool.query(
                    "UPDATE pending_redemptions SET is_verified = TRUE, phone = $1 WHERE token = $2 RETURNING *",
                    [cleanNum, token]
                );

                if (redRes.rows.length > 0) {
                    const confirmMsg = `✅ *Redemption Verified!*\n\nYour points redemption for *${biz.name}* has been authorized. 🎁\n\nReturn to your browser to complete your order. Your discount will be applied automatically!`;
                    await sendOfficialMessage(customerNumber, confirmMsg, userId);
                    return;
                }
            }
        }

        const symbol = biz.currency_code === 'INR' ? '₹' : '$';
        let allItems = [];
        const menuRes = await pool.query(
            `SELECT id FROM outlet_menus 
             WHERE (outlet_id = $1 OR user_id = $1) 
               AND (is_digital_default = true OR is_digital = true) 
             ORDER BY is_digital_default DESC, is_digital DESC, id DESC LIMIT 1`,
            [userId]
        );
        let menuId = menuRes.rows[0]?.id;
        if (!menuId) {
            const posMenuRes = await pool.query(
                `SELECT id FROM outlet_menus 
                 WHERE (outlet_id = $1 OR user_id = $1) AND is_pos_default = true 
                 ORDER BY id DESC LIMIT 1`,
                [userId]
            );
            menuId = posMenuRes.rows[0]?.id;
        }

        if (menuId) {
            const itemsRes = await pool.query(
                `SELECT omi.id, 
                        omi.item_name AS product_name, 
                        omi.base_price AS price, 
                        omi.is_active AS availability, 
                        omi.stock_qty AS stock_count,
                        COALESCE(c.name, 'General') as category
                 FROM outlet_menu_items omi
                 LEFT JOIN categories c ON omi.category_id = c.id
                 WHERE omi.menu_id = $1 AND omi.item_type = '0' AND omi.is_active = true
                   AND (c.id IS NULL OR c.is_active = true)
                   AND omi.item_name NOT IN (SELECT name FROM options_list)
                 ORDER BY omi.id ASC`,
                [menuId]
            );
            allItems = itemsRes.rows.map(item => ({
                id: item.id,
                product_name: item.product_name,
                price: parseFloat(item.price),
                availability: item.availability,
                stock_count: item.stock_count !== null ? parseFloat(item.stock_count) : null,
                category: item.category
            }));
        } else {
            const itemsResFallback = await pool.query(
                `SELECT id, product_name, price, availability, stock_count 
                 FROM business_items 
                 WHERE user_id = $1 AND availability = true
                   AND product_name NOT IN (SELECT name FROM options_list)
                 ORDER BY id ASC`,
                [userId]
            );
            allItems = itemsResFallback.rows.map(item => ({
                id: item.id,
                product_name: item.product_name,
                price: parseFloat(item.price),
                availability: item.availability,
                stock_count: item.stock_count !== null ? parseFloat(item.stock_count) : null,
                category: 'General'
            }));
        }

        // --- 🧠 SMART MENU FILTERING (Fuzzy & Robust) ---
        const searchWords = lower.split(/[\s,]+/).filter(w => w.length > 2 && isNaN(w));
        let menu = allItems.filter(item => {
            const pName = item.product_name.toLowerCase();
            return searchWords.some(word => 
                pName.includes(word) || 
                word.includes(pName) ||
                // Check for 75% character match for fuzzy support
                (word.length > 4 && pName.split('').filter(c => word.includes(c)).length / word.length > 0.75)
            );
        });
        
        // If no items match, or it's a greeting, show top 25 items
        if (menu.length === 0) menu = allItems.slice(0, 25);
        
        const menuContext = menu.map(i => `${i.product_name}: ${symbol}${i.price}`).join(", ");

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

        // --- 🛑 WHATSAPP CUSTOMER ORDER CANCELLATION COMMAND ---
        if (lower === 'cancel' || lower === 'cancel order' || lower.startsWith('cancel_order_') || lower === 'cancel_order') {
            const tenDigits = cleanNum.slice(-10);
            const activeOrderRes = await pool.query(
                `SELECT * FROM orders 
                 WHERE user_id = $1 
                   AND RIGHT(regexp_replace(customer_number, '\\D', '', 'g'), 10) = $2
                   AND status IN ('PENDING', 'AWAITING_PAYMENT')
                 ORDER BY created_at DESC LIMIT 1`,
                [userId, tenDigits]
            );

            if (activeOrderRes.rows.length > 0) {
                const ordToCancel = activeOrderRes.rows[0];
                await pool.query(
                    "UPDATE orders SET status = 'CANCELLED', rejection_reason = 'Cancelled by customer via WhatsApp' WHERE id = $1",
                    [ordToCancel.id]
                );

                await sendOfficialMessage(customerNumber, `❌ *Order Cancelled:* Your order *${ordToCancel.order_reference || ordToCancel.id}* has been cancelled successfully.`, userId);

                // Notify Staff and Kitchen via WhatsApp
                try {
                    const bizRow = biz;
                    let staffList = [];
                    const rawStaff = bizRow?.notification_numbers;
                    if (Array.isArray(rawStaff)) staffList = rawStaff;
                    else if (typeof rawStaff === 'string') {
                        try { const p = JSON.parse(rawStaff); staffList = Array.isArray(p) ? p : [rawStaff]; } catch(e) { staffList = [rawStaff]; }
                    }
                    if (bizRow?.phone) staffList.push(bizRow.phone);
                    if (bizRow?.contact_number) staffList.push(bizRow.contact_number);
                    const kitchenNum = bizRow?.kitchen_number || bizRow?.kitchen_phone;

                    const notifyTargets = new Set();
                    if (kitchenNum) { const c = String(kitchenNum).replace(/[^0-9+]/g, ''); if (c.length >= 10) notifyTargets.add(c); }
                    staffList.forEach(n => { if (n && typeof n === 'string') { const c = n.replace(/[^0-9+]/g, ''); if (c.length >= 10) notifyTargets.add(c); } });

                    const cancelAlert = `🛑 *CUSTOMER CANCELLED ORDER VIA WHATSAPP!*\n━━━━━━━━━━━━━━\nOrder Ref: *${ordToCancel.order_reference || ordToCancel.id}*\nCustomer: ${ordToCancel.customer_name || 'Customer'} (${ordToCancel.customer_number || ''})\nTotal Amount: ₹${parseFloat(ordToCancel.total_price || 0).toFixed(2)}\nReason: Cancelled by customer via WhatsApp\n\nPlease STOP preparation immediately! 🚫`;

                    for (let targetNum of notifyTargets) {
                        await sendOfficialMessage(targetNum, cancelAlert, userId);
                    }
                } catch (sErr) { console.error("WhatsApp cancel alert error:", sErr); }

                session.state = 'IDLE';
                await updateSession(userId, cleanNum, 'IDLE', { cart: [] });
                return;
            } else {
                session.state = 'IDLE';
                await updateSession(userId, cleanNum, 'IDLE', { cart: [] });
                await sendOfficialMessage(customerNumber, `❌ *Order Cancelled & Cart Cleared*\n━━━━━━━━━━━━━━\nYour cart has been cleared. You can start a new order anytime by sending *Hi* or *Menu*.`, userId);
                return;
            }
        }

        // --- 💳 HANDLE CUSTOMER PAYMENT COMPLETED CLAIM IN WHATSAPP ---
        if (
            lower.includes('completed payment') || 
            lower.includes('payment done') || 
            lower === 'i have completed payment' || 
            lower === 'paid' || 
            lower.includes('paid online') ||
            lower.startsWith('payment_completed_')
        ) {
            const tenDigits = cleanNum.slice(-10);
            const activeOrderRes = await pool.query(
                `SELECT * FROM orders 
                 WHERE user_id = $1 
                   AND RIGHT(regexp_replace(customer_number, '\\D', '', 'g'), 10) = $2
                   AND status NOT IN ('CANCELLED', 'REJECTED')
                 ORDER BY created_at DESC LIMIT 1`,
                [userId, tenDigits]
            );

            if (activeOrderRes.rows.length > 0) {
                const ordToUpdate = activeOrderRes.rows[0];
                await pool.query(
                    "UPDATE orders SET payment_status = 'CUSTOMER_CONFIRMED' WHERE id = $1",
                    [ordToUpdate.id]
                );

                await sendOfficialMessage(customerNumber, `💳 *Payment Claim Received!* \n\nThank you! We have marked your order *${ordToUpdate.order_reference || ordToUpdate.id}* as *Payment Verification Pending*. The restaurant team will verify your payment and start preparation! 🍽️`, userId);
                return;
            } else {
                await sendOfficialMessage(customerNumber, `ℹ️ We couldn't find a recent active order for your phone number. If you placed an order, please provide your Order Reference ID.`, userId);
                return;
            }
        }

        // --- 🏠 HARDCODED GREETING (Save AI Tokens & Promote VIP) ---
        const greetings = ['hi', 'hello', 'hey', 'hi there', 'greetings', 'namaste', 'asalam', 'adaab', 'menu', 'start', 'reset', 'bot'];
        
        // --- 💳 WALLET & REWARDS BALANCE CHECK COMMAND ---
        if (
            lower === 'loyalty_check' || 
            lower === 'loyalty' || 
            lower === 'balance' || 
            lower === 'my balance' || 
            lower === 'wallet' || 
            lower === 'my wallet' || 
            lower === 'points' || 
            lower === 'my points' || 
            lower === 'rewards'
        ) {
            const tenDigits = cleanNum.slice(-10);
            const loyRes = await pool.query(
                `SELECT balance, points, total_spent, name FROM customer_loyalty 
                 WHERE (user_id = $1 OR user_id = 2 OR user_id IS NOT NULL) 
                 AND RIGHT(regexp_replace(customer_number, '\\D', '', 'g'), 10) = $2
                 ORDER BY id DESC LIMIT 1`,
                [userId, tenDigits]
            );

            const loy = loyRes.rows[0] || { balance: 0, points: 0, total_spent: 0 };
            const numBal = parseFloat(loy.balance || 0);
            const balStr = numBal < 0 ? `Credit Due: ${symbol}${Math.abs(numBal).toFixed(2)}` : `Wallet Balance: ${symbol}${numBal.toFixed(2)}`;
            const ptsVal = parseInt(loy.points || 0);
            const spentVal = parseFloat(loy.total_spent || 0).toFixed(2);

            const profileMsg = `💳 *YOUR WALLET & REWARDS ACCOUNT*\n━━━━━━━━━━━━━━━━\n` +
                `👤 *Customer:* ${loy.name || customerName || 'Valued Guest'}\n` +
                `📱 *Phone:* ${cleanNum}\n` +
                `💰 *${balStr}*\n` +
                `💎 *Reward Points:* ${ptsVal} Points\n` +
                `🛍️ *Total Spent:* ${symbol}${spentVal}\n` +
                `━━━━━━━━━━━━━━━━\n` +
                `You can use your wallet balance and reward points on online & WhatsApp orders! 🎉`;

            await sendButtons(customerNumber, profileMsg, [
                { id: 'place_order', title: '🛍️ Order Now' },
                { id: 'view_menu', title: "📜 View Digital Menu" }
            ], userId);
            return;
        }

        if (greetings.includes(lower)) {
            // Always unpause AI when user sends explicit greeting/reset command
            try {
                await pool.query("UPDATE conversation_sessions SET is_paused = false WHERE user_id = $1 AND customer_number = $2", [userId, cleanNum]);
            } catch (pErr) {}

            // Check if customer exists in loyalty
            const tenDigits = cleanNum.slice(-10);
            const customerRes = await pool.query(
                `SELECT * FROM customer_loyalty 
                 WHERE (user_id = $1 OR user_id = 2 OR user_id IS NOT NULL) 
                 AND RIGHT(regexp_replace(customer_number, '\\D', '', 'g'), 10) = $2
                 ORDER BY id DESC LIMIT 1`,
                [userId, tenDigits]
            );
            const existing = customerRes.rows[0];
            const rawBalance = parseFloat(existing?.balance || 0);
            const userPoints = parseInt(existing?.points || 0);

            if (existing) {
                // EXISTING CUSTOMER: Show "Welcome Back" + Balance + List
                let balanceLine = rawBalance < 0 
                    ? `💰 *Credit Due:* ${symbol}${Math.abs(rawBalance).toFixed(2)}` 
                    : `💰 *Wallet Balance:* ${symbol}${rawBalance.toFixed(2)}`;
                if (userPoints > 0) balanceLine += ` | 💎 *Rewards:* ${userPoints} pts`;

                const welcomeText = `🏠 *Welcome back to ${bizName}!*\n\nHello ${existing.name || customerName || 'friend'}! 👋\n${balanceLine}\n\nHow may I assist you today? You can explore our menu, place an order, check your wallet, or book a table below. 👇`;
                
                const sections = [
                    {
                        title: "🛒 Ordering & Booking",
                        rows: [
                            { id: "place_order", title: "🛍️ Place an Order", description: "Quick selection of your favorites 🍔 🥤" },
                            { id: "view_menu", title: "📜 View Digital Menu", description: "Browse our full catalog & deals 🍕 🍰" },
                            { id: "table_reservation", title: "🍽️ Table Reservation", description: "Reserve a table & select seating area 🪑" }
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

                const listRes = await sendList(customerNumber, "How can we help? ✨", welcomeText, "✨ Open Main Menu ✨", sections, userId);
                if (!listRes || !listRes.success) {
                    console.warn("⚠️ sendList failed, attempting text fallback greeting:", listRes?.error);
                    const plainWelcome = `${welcomeText}\n\n1️⃣ Reply *1* or *order* to Place an Order\n2️⃣ Reply *2* or *menu* to View Digital Menu\n3️⃣ Reply *3* or *table* for Table Reservation\n4️⃣ Reply *4* or *support* for Staff Support`;
                    await sendOfficialMessage(customerNumber, plainWelcome, userId);
                }
            } else {
                // NEW CUSTOMER: Show VIP Offer + Full Menu List
                const joiningPoints = parseInt(biz.loyalty_joining_points) || 0;
                let pointsPromo = "";
                if (joiningPoints > 0) {
                    pointsPromo = ` and get *${joiningPoints} Free Points* instantly`;
                }
                const welcomeText = `👋 *Hello! Welcome to ${bizName}* 🍽️\n\nI am your AI assistant. I can help you view our menu, place an order, book a table, or answer questions.\n\n🎁 Join our *VIP Club* today${pointsPromo} to start tracking your purchases and earn loyalty rewards! 🎊\n\n*What would you like to do today?*`;
                
                const sections = [
                    {
                        title: "🛒 Dining & Orders",
                        rows: [
                            { id: "place_order", title: "🛍️ Place an Order", description: "Quick selection of your favorites 🍔 🥤" },
                            { id: "view_menu", title: "📜 View Digital Menu", description: "Browse our full catalog & deals 🍕 🍰" },
                            { id: "table_reservation", title: "🍽️ Table Reservation", description: "Reserve a table & select seating area 🪑" }
                        ]
                    },
                    {
                        title: "💎 VIP & Support",
                        rows: [
                            { id: "join_loyalty", title: joiningPoints > 0 ? `🎁 Claim ${joiningPoints} Pts` : '🎁 Join VIP Club', description: "Earn points & member deals 🌟" },
                            { id: "support", title: "📞 Contact Support", description: "Speak with our friendly team 👷" }
                        ]
                    }
                ];

                const listRes = await sendList(customerNumber, `${bizName} ✨`, welcomeText, "✨ Open Main Menu ✨", sections, userId);
                if (!listRes || !listRes.success) {
                    console.warn("⚠️ sendList failed, attempting text fallback greeting:", listRes?.error);
                    const plainWelcome = `${welcomeText}\n\n1️⃣ Reply *1* or *order* to Place an Order\n2️⃣ Reply *2* or *menu* to View Digital Menu\n3️⃣ Reply *3* or *table* for Table Reservation\n4️⃣ Reply *4* or *support* for Staff Support`;
                    await sendOfficialMessage(customerNumber, plainWelcome, userId);
                }
            }
            return;
        }

        // --- 🧩 HANDLE PENDING DISAMBIGUATION SELECTION ---
        if (session.context.pending_selection) {
            const pending = session.context.pending_selection;
            
            // 🔥 Handle Flavor Group Selection
            if (pending.is_group && lower.startsWith('group_')) {
                const groupName = msgText.substring(6); // Remove 'group_'
                const variants = pending.groups[groupName];
                if (variants) {
                    // If group has only 1 item, skip the intermediate list and go directly to options/cart
                    if (variants.length === 1) {
                        const item = variants[0];
                        const optData = await getItemOptions(item.id, userId);
                        if (optData) {
                            const body = `✨ *${item.product_name}* Selected!\n━━━━━━━━━━━━━━\nPlease choose your preferred option:`;
                            await sendOptionsPicker(customerNumber, body, optData.options, userId, symbol, item.product_name);
                            
                            session.context.pending_option_selection = {
                                mainItem: { id: item.id, name: item.product_name },
                                options: optData.options,
                                qty: pending.qty || 1
                            };
                            delete session.context.pending_selection;
                            await updateSession(userId, cleanNum, 'AWAITING_OPTION_SELECTION', session.context);
                        } else {
                            const text = `✨ *${item.product_name}* — ${symbol}${item.price}\n\nHow many would you like?`;
                            await sendBrandedText(customerNumber, biz.name, text, userId);
                            session.context.pending_item = { id: item.id, name: item.product_name, price: item.price };
                            delete session.context.pending_selection;
                            await updateSession(userId, cleanNum, 'AWAITING_QUANTITY', session.context);
                        }
                        return;
                    }

                    // Multiple variants — show the full list
                    const allRows = variants.map(v => ({
                        id: v.product_name,
                        title: v.product_name.substring(0, 24),
                        description: `${symbol}${v.price}`
                    }));
                    const sections = [];
                    for (let i = 0; i < allRows.length; i += 10) {
                        sections.push({
                            title: sections.length === 0 ? "Available Sizes" : "More Sizes",
                            rows: allRows.slice(i, i + 10)
                        });
                    }
                    const body = `✨ *${groupName}* Selected!\n━━━━━━━━━━━━━━\nWhich size or portion would you like? 👇`;
                    await sendList(customerNumber, "Select Size", body, "✨ View Sizes ✨", sections.slice(0, 10), userId);
                    
                    // Update state: No longer a group, now just waiting for the final variant
                    session.context.pending_selection = { keyword: pending.keyword, qty: pending.qty };
                    await updateSession(userId, cleanNum, 'IDLE', session.context);
                    return;
                }
            }

            const selection = menu.find(i => i.product_name.toLowerCase() === lower);
            if (selection) {
                const qty = pending.qty || 1;
                
                // Check if item has option groups
                const optData = await getItemOptions(selection.id, userId);
                if (optData) {
                    const body = `😋 *Choose size/option for ${selection.product_name}:*\n━━━━━━━━━━━━━━\nPlease select one of the sizes below:`;
                    await sendOptionsPicker(customerNumber, body, optData.options, userId, symbol, selection.product_name);
                    
                    session.context.pending_option_selection = {
                        mainItem: { id: selection.id, name: selection.product_name },
                        options: optData.options,
                        qty: qty
                    };
                    delete session.context.pending_selection;
                    await updateSession(userId, cleanNum, 'AWAITING_OPTION_SELECTION', session.context);
                    return;
                }

                const cart = session.context.cart || [];
                const existing = cart.find(c => c.name === selection.product_name);
                if (existing) existing.qty += qty;
                else cart.push({ id: selection.id, name: selection.product_name, qty, price: selection.price });
                
                session.context.cart = cart;
                delete session.context.pending_selection;
                
                // --- 🔄 CHECK FOR MORE AMBIGUOUS ITEMS ---
                if (session.context.pending_ambiguous && session.context.pending_ambiguous.length > 0) {
                    const nextAmb = session.context.pending_ambiguous.shift();
                    
                    if (nextAmb.is_option_selection) {
                        const item = nextAmb.item;
                        const optData = nextAmb.optData;
                        const nextQty = nextAmb.qty || 1;
                        
                        let body = `✅ *Added: ${qty}x ${selection.product_name}*\n\n`;
                        body += `😋 *Choose size/option for ${item.product_name}:*\n━━━━━━━━━━━━━━\nPlease select one of the sizes below:`;
                        
                        await sendOptionsPicker(customerNumber, body, optData.options, userId, symbol, item.product_name);
                        
                        session.context.pending_option_selection = {
                            mainItem: { id: item.id, name: item.product_name },
                            options: optData.options,
                            qty: nextQty
                        };
                        await updateSession(userId, cleanNum, 'AWAITING_OPTION_SELECTION', session.context);
                        return;
                    } else {
                        session.context.pending_selection = { keyword: nextAmb.keyword, qty: nextAmb.qty };
                        await updateSession(userId, cleanNum, 'IDLE', session.context);

                        const rows = nextAmb.matches.slice(0, 10).map(m => ({
                            id: m.product_name,
                            title: m.product_name.substring(0, 24),
                            description: `${symbol}${m.price}`
                        }));

                        const body = `✅ *Added: ${qty}x ${selection.product_name}*\n\n🤔 *And which "${nextAmb.keyword}" did you mean?*`;
                        await sendList(customerNumber, "Select Next", body, "✨ View Options ✨", [{ title: "Available Options", rows }], userId);
                        return;
                    }
                }

                await updateSession(userId, cleanNum, 'IDLE', session.context);
                
                const cartSummaryLines = cart.map(item => `• ${item.qty}x *${item.name}*`).join('\n');
                const cartTotal = cart.reduce((sum, item) => sum + (item.qty * item.price), 0);
                
                const msg = `✅ *Added to Bag!*\n\n${cartSummaryLines}\n\n💰 *Total Bag: ${symbol}${cartTotal.toFixed(2)}*`;
                await sendButtons(customerNumber, msg, [
                    { id: 'checkout', title: '🛒 Checkout Now' },
                    { id: 'place_order', title: '➕ Add More' }
                ], userId);
                return;
            }
            // If they didn't pick an option, clear it and proceed to normal AI (maybe they changed their mind)
            delete session.context.pending_selection;
            await updateSession(userId, cleanNum, 'IDLE', session.context);
        }
        
        const botCommands = ['place_order', 'place an order', 'order now', 'view_menu', 'table_reservation', 'table reservation', 'book table', 'reserve table', 'reservation', 'enquiry', 'loyalty', 'loyalty_check', 'support'];
        if (session.is_paused) {
            if (botCommands.includes(lower)) {
                await pool.query("UPDATE conversation_sessions SET is_paused = false WHERE user_id = $1 AND customer_number = $2", [userId, cleanNum]);
                session.is_paused = false;
            } else {
                return;
            }
        }

        const cart = session.context.cart || [];
        
        // --- 🧮 GLOBAL ORDER CALCULATIONS ---
        const subtotal = cart.reduce((acc, i) => acc + (i.qty * i.price), 0);
        const cgstR = parseFloat(biz.cgst_percent) || 0;
        const sgstR = parseFloat(biz.sgst_percent) || 0;
        let cgst = 0, sgst = 0;
        if (biz.gst_included) {
            const r = cgstR + sgstR;
            if (r > 0) { 
                const a = subtotal * (r / (100 + r)); 
                cgst = a * (cgstR / r); 
                sgst = a * (sgstR / r); 
            }
        } else {
            cgst = (subtotal * cgstR) / 100; 
            sgst = (subtotal * sgstR) / 100;
        }
        const orderRef = `W${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        // --- ⚙️ HANDLE OPTION SELECTION ---
        if (session.state === 'AWAITING_OPTION_SELECTION' && session.context.pending_option_selection) {
            const pending = session.context.pending_option_selection;
            let selectedOpt = null;
            
            if (lower.startsWith('opt_')) {
                const optId = parseInt(lower.substring(4));
                selectedOpt = pending.options.find(o => o.id === optId);
            } else {
                selectedOpt = pending.options.find(o => o.name.toLowerCase() === lower || lower.includes(o.name.toLowerCase()));
            }
            
            if (selectedOpt) {
                const cart = session.context.cart || [];
                const itemName = `${pending.mainItem.name} (${selectedOpt.name})`;
                const qty = pending.qty || 1;
                
                const existing = cart.find(c => c.name === itemName);
                if (existing) existing.qty += qty;
                else cart.push({ name: itemName, qty, price: selectedOpt.price, id: selectedOpt.id });
                
                session.context.cart = cart;
                delete session.context.pending_option_selection;
                
                // --- Check for next pending ambiguous or option selection ---
                if (session.context.pending_ambiguous && session.context.pending_ambiguous.length > 0) {
                    const nextAmb = session.context.pending_ambiguous.shift();
                    
                    if (nextAmb.is_option_selection) {
                        const item = nextAmb.item;
                        const optData = nextAmb.optData;
                        const nextQty = nextAmb.qty || 1;
                        
                        let body = `✅ *Added: ${qty}x ${itemName}*\n\n`;
                        body += `😋 *Choose size/option for ${item.product_name}:*\n━━━━━━━━━━━━━━\nPlease select one of the sizes below:`;
                        
                        await sendOptionsPicker(customerNumber, body, optData.options, userId, symbol, item.product_name);
                        
                        session.context.pending_option_selection = {
                            mainItem: { id: item.id, name: item.product_name },
                            options: optData.options,
                            qty: nextQty
                        };
                        await updateSession(userId, cleanNum, 'AWAITING_OPTION_SELECTION', session.context);
                        return;
                    } else {
                        session.context.pending_selection = { keyword: nextAmb.keyword, qty: nextAmb.qty };
                        await updateSession(userId, cleanNum, 'IDLE', session.context);

                        const rows = nextAmb.matches.slice(0, 10).map(m => ({
                            id: m.product_name,
                            title: m.product_name.substring(0, 24),
                            description: `${symbol}${m.price}`
                        }));

                        let body = `✅ *Added: ${qty}x ${itemName}*\n\n`;
                        body += `🤔 *Which "${nextAmb.keyword}" did you mean?*\n━━━━━━━━━━━━━━\nPlease select the exact item from the list below. 👇`;
                        
                        await sendList(customerNumber, "Select Next", body, "✨ View Options ✨", [{ title: "Available Options", rows }], userId);
                        return;
                    }
                }
                
                await updateSession(userId, cleanNum, 'IDLE', session.context);
                
                const cartSummaryLines = cart.map(item => `• ${item.qty}x *${item.name}*`).join('\n');
                const cartTotal = cart.reduce((sum, item) => sum + (item.qty * item.price), 0);
                
                const msg = `✅ *Added to Bag!*\n\n${cartSummaryLines}\n\n💰 *Total Bag: ${symbol}${cartTotal.toFixed(2)}*`;
                await sendButtons(customerNumber, msg, [
                    { id: 'checkout', title: '🛒 Checkout Now' },
                    { id: 'place_order', title: '➕ Add More' }
                ], userId);
                return;
            } else {
                if (lower === 'cancel' || lower.includes('cancel')) {
                    delete session.context.pending_option_selection;
                    await updateSession(userId, cleanNum, 'IDLE', session.context);
                    await sendOfficialMessage(customerNumber, "❌ Selection cancelled. What would you like to do?", userId);
                    return;
                }
                
                // Check if user is shifting intent (sending a command, greeting, or mentioning other menu items)
                const isGreeting = greetings.includes(lower);
                const isCommand = botCommands.includes(lower) || ['checkout', 'redeem_pts_wa', 'mode_pickup', 'mode_delivery', 'join_loyalty'].includes(lower);
                
                const searchWords = lower.split(/[\s,]+/).filter(w => w.length > 2 && isNaN(w));
                const matchedOtherItems = allItems.filter(item => {
                    if (item.product_name.toLowerCase() === pending.mainItem.name.toLowerCase()) return false;
                    const pName = item.product_name.toLowerCase();
                    return searchWords.some(word => pName.includes(word) || word.includes(pName));
                });
                
                if (isGreeting || isCommand || matchedOtherItems.length > 0) {
                    console.log(`🔄 [INTENT SHIFT] Clearing pending option selection for ${pending.mainItem.name} and falling through.`);
                    delete session.context.pending_option_selection;
                    session.state = 'IDLE';
                    await updateSession(userId, cleanNum, 'IDLE', session.context);
                    // Let it fall through to normal AI/flow processing
                } else {
                    const body = `⚠️ *Invalid selection.* Please choose one of the options for *${pending.mainItem.name}*:`;
                    await sendOptionsPicker(customerNumber, body, pending.options, userId, symbol, pending.mainItem.name);
                    return;
                }
            }
        }

        // --- 📅 HANDLE AWAITING RESERVATION DETAILS ---
        if (session.state === 'AWAITING_RESERVATION_DETAILS' && session.context.pending_reservation) {
            const isGreeting = greetings.includes(lower);
            const isCommand = botCommands.includes(lower) || ['checkout', 'mode_pickup', 'mode_delivery'].includes(lower);

            if (isGreeting || isCommand) {
                delete session.context.pending_reservation;
                session.state = 'IDLE';
                await updateSession(userId, cleanNum, 'IDLE', session.context);
            } else {
                const detailsText = msgText.trim();
                const pendingRes = session.context.pending_reservation;

                const guestMatch = detailsText.match(/(\d+)\s*(guest|person|people|pax|p)/i) || detailsText.match(/(\d+)/);
                const guestsCount = guestMatch ? parseInt(guestMatch[1]) : 2;

                let defaultSeating = pendingRes.seatingArea;
                if (!defaultSeating) {
                    try {
                        const seatRes = await pool.query(
                            `SELECT department_name FROM table_departments 
                             WHERE (user_id = $1 OR outlet_id = $1 OR user_id = 2 OR outlet_id = 2) AND is_active = true 
                             ORDER BY department_name ASC LIMIT 1`,
                            [userId]
                        );
                        if (seatRes.rows.length > 0 && seatRes.rows[0].department_name) {
                            defaultSeating = seatRes.rows[0].department_name;
                        }
                    } catch (e) {}
                }
                const seatingPref = defaultSeating || 'Dining';
                const todayStr = new Date().toISOString().split('T')[0];
                const randomRef = `RES-${Math.floor(100000 + Math.random() * 900000)}`;

                await pool.query(
                    `INSERT INTO table_reservations 
                     (user_id, outlet_id, reservation_ref, customer_name, customer_phone, guests_count, reservation_date, reservation_time, seating_preference, special_notes, status, created_at)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'PENDING', NOW())`,
                    [userId, biz.id || userId, randomRef, customerName || "WhatsApp Guest", cleanNum, guestsCount, todayStr, detailsText, seatingPref, 'Booked via WhatsApp Bot']
                );

                delete session.context.pending_reservation;
                session.state = 'IDLE';
                await updateSession(userId, cleanNum, 'IDLE', session.context);

                // Notify Customer
                const custMsg = `🍽️ *TABLE RESERVATION RECEIVED!*\n━━━━━━━━━━━━━━━━\n` +
                    `*Booking Ref:* ${randomRef}\n` +
                    `*Restaurant:* ${biz.name || "Our Restaurant"}\n` +
                    `*Name:* ${customerName || "Guest"}\n` +
                    `*Guests:* ${guestsCount} Guests\n` +
                    `*Seating Area:* ${seatingPref}\n` +
                    `*Details:* ${detailsText}\n` +
                    `━━━━━━━━━━━━━━━━\n` +
                    `*Status:* ⏳ *PENDING CONFIRMATION*\n` +
                    `Our manager will confirm your table shortly. Thank you! 🙏`;

                await sendOfficialMessage(customerNumber, custMsg, userId);

                // Notify Staff
                try {
                    let staffNums = (biz.notification_numbers && biz.notification_numbers.length > 0)
                        ? biz.notification_numbers
                        : [biz.phone, biz.contact_number].filter(Boolean);
                    staffNums = [...new Set(staffNums)];

                    const staffBookingMsg = `📅 *NEW TABLE RESERVATION RECEIVED! (Pending)*\n━━━━━━━━━━━━━━━━\n` +
                        `*Booking Ref:* ${randomRef}\n` +
                        `*Customer Name:* ${customerName || 'WhatsApp Guest'}\n` +
                        `*Phone:* ${cleanNum}\n` +
                        `*Guests:* ${guestsCount} Guests\n` +
                        `*Seating Area:* ${seatingPref}\n` +
                        `*Details:* ${detailsText}\n` +
                        `*Source:* WhatsApp Bot\n` +
                        `━━━━━━━━━━━━━━━━\n` +
                        `*Action Required:* Open POS > Bookings to Accept or Reject! 🚀`;

                    for (let num of staffNums) {
                        await sendOfficialMessage(num, staffBookingMsg, userId);
                    }
                } catch (sErr) {
                    console.error("Staff reservation notification error:", sErr);
                }
                return;
            }
        }

        // --- 📍 HANDLE LOCATION (GPS PIN OR TYPED TEXT ADDRESS) ---
        if (session.state === 'AWAITING_LOCATION') {
            let customerAddress = "";
            let deliveryCharge = parseFloat(biz.delivery_charge) || 0;
            let distance = null;

            if (isLocation && locationData) {
                const { latitude: cLat, longitude: cLon } = locationData;
                const delivery = await getDeliveryDetails(biz, cLat, cLon);
                if (!delivery.serviceable) {
                    const maxDist = delivery.maxRadius || delivery.radius || biz.delivery_radius_km || 15;
                    const unserviceableMsg = `📍 *LOCATION OUTSIDE DELIVERY ZONE*\n━━━━━━━━━━━━━━\nSorry! Your location is *${delivery.distance.toFixed(1)} KM* away, which is outside our delivery radius of *${maxDist} KM*.\n\nWe cannot deliver to this address. Would you like to switch your order to *Pickup* (Takeaway) or cancel your order?`;
                    await sendButtons(customerNumber, unserviceableMsg, [
                        { id: 'mode_pickup', title: '🥡 Switch to Pickup' },
                        { id: 'cancel_order', title: '❌ Cancel Order' }
                    ], userId);
                    return;
                }
                deliveryCharge = delivery.charge;
                distance = delivery.distance;
                const googleMapsUrl = `https://maps.google.com/?q=${cLat.toFixed(6)},${cLon.toFixed(6)}`;
                customerAddress = `GPS Pin: ${googleMapsUrl}`;
            } else if (!isLocation && msgText.trim()) {
                const isGreeting = greetings.includes(lower);
                const isCommand = botCommands.includes(lower) || ['checkout', 'redeem_pts_wa', 'mode_pickup', 'mode_delivery', 'join_loyalty', 'cancel_order', 'cancel'].includes(lower);
                const searchWords = lower.split(/[\s,]+/).filter(w => w.length > 2 && isNaN(w));
                const matchedItems = allItems.filter(item => {
                    const pName = item.product_name.toLowerCase();
                    return searchWords.some(word => pName.includes(word) || word.includes(pName));
                });

                if (isGreeting || isCommand || matchedItems.length > 0) {
                    console.log(`🔄 [INTENT SHIFT] Resetting AWAITING_LOCATION to IDLE.`);
                    session.state = 'IDLE';
                    await updateSession(userId, cleanNum, 'IDLE', session.context);
                } else {
                    customerAddress = msgText.trim();
                    // 📍 Option B: Pure Typed Text Address -> Send to Manager / POS for Fee Verification
                    const orderRef = `DEL-${Math.floor(100000 + Math.random() * 900000)}`;
                    const discountAmount = session.context.redeemedPoints ? (session.context.redeemedPoints * (parseFloat(biz.points_to_amount_ratio) || 0.1)) : 0;
                    const initialTotal = Math.max(0, (biz.gst_included ? subtotal : (subtotal + cgst + sgst)) - discountAmount);

                    const insRes = await pool.query(
                        `INSERT INTO orders (
                            user_id, restaurant_id, customer_name, customer_number, address, items, 
                            total_price, order_reference, status, delivery_charge, payment_method, 
                            redeemed_points, discount_amount, source, order_type
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING_DELIVERY_CHARGE', 0, 'COD', $9, $10, 'WHATSAPP', 'DELIVERY') RETURNING *`,
                        [userId, biz.id || null, customerName || "WhatsApp Customer", cleanNum, customerAddress, JSON.stringify(cart), initialTotal, orderRef, session.context.redeemedPoints || 0, discountAmount]
                    );

                    const createdOrder = insRes.rows[0];

                    // Trigger Webhooks & Staff Notifications for POS & Order App
                    triggerWebhook(biz, 'order.created', createdOrder);
                    triggerWebhook(biz, 'order.new', createdOrder);
                    try {
                        await notifyKitchenAndStaff(
                            userId, orderRef, createdOrder.customer_name, createdOrder.customer_number, cart,
                            initialTotal, initialTotal, 0, 0, 0, 0, symbol,
                            'WHATSAPP', customerAddress, '0'
                        );
                    } catch (kotErr) { console.error("KOT notification error for typed address:", kotErr); }

                    try {
                        const staffAlert = `⚠️ *NEW TYPED ADDRESS ORDER RECEIVED! (Pending Fee Verification)*\n━━━━━━━━━━━━━━━━\nRef: *${orderRef}*\nCustomer: ${customerName || 'Customer'} (${cleanNum})\nAddress: ${customerAddress}\nItems Total: ${symbol}${subtotal.toFixed(2)}\n\n👉 *Action Required:* Open POS > Digital Orders to verify area serviceability & set delivery charge! 🚀`;
                        let staffNums = (biz.notification_numbers && biz.notification_numbers.length > 0) ? biz.notification_numbers : [biz.phone, biz.contact_number].filter(Boolean);
                        staffNums = [...new Set(staffNums)];
                        for (let num of staffNums) {
                            await sendOfficialMessage(num, staffAlert, userId);
                        }
                    } catch (sErr) { console.error("Staff notification error for typed address:", sErr); }

                    // Send Customer Confirmation Message
                    const custMsg = `📍 *ADDRESS RECEIVED & SENT TO MANAGER!*\n━━━━━━━━━━━━━━\n*Address:* ${customerAddress}\n\n⏳ Your order (*${orderRef}*) has been sent to our outlet manager to verify area serviceability and set the delivery charge.\n\nWe will send your updated bill with a confirmation button shortly! 🙏`;
                    await sendOfficialMessage(customerNumber, custMsg, userId);

                    await updateSession(userId, cleanNum, 'IDLE', { cart: [] });
                    return;
                }
            }

            if (customerAddress) {
                const discountAmount = session.context.redeemedPoints ? (session.context.redeemedPoints * (parseFloat(biz.points_to_amount_ratio) || 0.1)) : 0;
                const total = Math.max(0, (biz.gst_included ? subtotal : (subtotal + cgst + sgst)) + deliveryCharge - discountAmount);

                const pendingBill = [
                    `📋 *ORDER SUMMARY*`,
                    ``,
                    cart.map(i => `• ${i.qty}x ${i.name}`).join("\n"),
                    `───────────────`,
                    `Subtotal: ${symbol}${subtotal.toFixed(2)}`
                ];

                if (discountAmount > 0) {
                    pendingBill.push(`🎁 Discount: -${symbol}${discountAmount.toFixed(0)}`);
                }

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
                    { id: 'cancel_order', title: '❌ Cancel Order' }
                ], userId);
                return;
            }
        }

        // --- 🔢 HANDLE QUANTITY REPLY ---
        if (session.state === 'AWAITING_QUANTITY' && session.context.pending_item) {
            const numMatch = lower.match(/^\d+$/);
            if (numMatch) {
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
                return;
            } else {
                // If they typed something else, reset the quantity state
                console.log(`🔄 [INTENT SHIFT] Resetting AWAITING_QUANTITY to IDLE.`);
                session.state = 'IDLE';
                session.context.pending_item = null;
                await updateSession(userId, cleanNum, 'IDLE', session.context);
            }
        }

        // --- 🔘 HANDLE BUTTON CLICKS & PAYMENT CONFIRMATIONS ---
        if (lower.startsWith('payment_completed_') || lower === 'i have paid' || lower === 'i paid' || lower === 'i have completed payment' || lower === 'payment completed' || lower === 'payment done') {
            let ordRef = lower.startsWith('payment_completed_') ? lower.replace('payment_completed_', '').trim() : null;
            let ordRes;
            if (ordRef) {
                ordRes = await pool.query("SELECT * FROM orders WHERE (order_reference = $1 OR bill_no = $1 OR id::text = $1) AND user_id = $2", [ordRef, userId]);
            } else {
                ordRes = await pool.query("SELECT * FROM orders WHERE customer_number = $1 AND user_id = $2 AND status IN ('AWAITING_PAYMENT', 'PENDING', 'PENDING_DELIVERY_CHARGE', 'PLACED') ORDER BY id DESC LIMIT 1", [cleanNum, userId]);
            }
            if (ordRes && ordRes.rows.length > 0) {
                const ord = ordRes.rows[0];
                await pool.query("UPDATE orders SET payment_status = 'CUSTOMER_CONFIRMED' WHERE id = $1", [ord.id]);

                // Send Customer Confirmation Message
                await sendOfficialMessage(
                    customerNumber,
                    `💰 *PAYMENT CONFIRMATION RECEIVED!*\n━━━━━━━━━━━━━━━━\nOrder Ref: *${ord.order_reference || '#' + ord.id}*\n\nThank you! We have notified our staff to verify your payment and start preparing your order immediately. 🚀`,
                    userId
                );

                // Trigger Webhook & Notify Manager/Staff
                triggerWebhook(biz, 'order.updated', { ...ord, payment_status: 'CUSTOMER_CONFIRMED' });
                try {
                    const staffMsg = `💰 *CUSTOMER REPORTED PAYMENT!*\n━━━━━━━━━━━━━━━━\nRef: *${ord.order_reference || '#' + ord.id}*\nCustomer: ${ord.customer_name || 'Customer'} (${ord.customer_number})\nTotal: ${symbol}${parseFloat(ord.total_price).toFixed(2)}\n\n👉 *Please verify payment in bank app and update order status in POS!* 🚀`;
                    let staffNums = (biz.notification_numbers && biz.notification_numbers.length > 0) ? biz.notification_numbers : [biz.phone, biz.contact_number].filter(Boolean);
                    staffNums = [...new Set(staffNums)];
                    for (let num of staffNums) {
                        await sendOfficialMessage(num, staffMsg, userId);
                    }
                } catch (sErr) { console.error("Staff notification error for payment completion:", sErr); }
            } else {
                await sendOfficialMessage(customerNumber, "Thank you! We have logged your payment status and our staff will verify it shortly. 🙏", userId);
            }
            await updateSession(userId, cleanNum, 'IDLE', session.context);
            return;
        }

        if (lower.startsWith('confirm_charge_')) {
            const ordId = lower.replace('confirm_charge_', '').trim();
            const ordRes = await pool.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [ordId, userId]);
            if (ordRes.rows.length > 0) {
                const ord = ordRes.rows[0];
                const allowedMode = biz.settings?.whatsapp_payment_modes || 'BOTH';
                if (allowedMode === 'COD') {
                    lower = `pay_charge_cod_${ordId}`;
                } else if (allowedMode === 'UPI') {
                    lower = `pay_charge_upi_${ordId}`;
                } else {
                    const payButtons = [
                        { id: `pay_charge_upi_${ordId}`, title: '💳 Prepaid UPI' },
                        { id: `pay_charge_cod_${ordId}`, title: '💵 Cash on Delivery' }
                    ];
                    await sendButtons(customerNumber, `💳 *Select Payment Method for Order ${ord.order_reference || '#' + ordId}:*`, payButtons, userId);
                    return;
                }
            }
        }

        if (lower.startsWith('pay_charge_cod_')) {
            const ordId = lower.replace('pay_charge_cod_', '').trim();
            const ordRes = await pool.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [ordId, userId]);
            if (ordRes.rows.length > 0) {
                const ord = ordRes.rows[0];
                await pool.query("UPDATE orders SET status = 'PENDING', payment_method = 'COD' WHERE id = $1", [ordId]);
                const itemsArr = typeof ord.items === 'string' ? JSON.parse(ord.items) : (ord.items || []);
                await deductInventory(userId, itemsArr);

                const confirmText = [
                    `✅ *ORDER CONFIRMED!*`,
                    `━━━━━━━━━━━━━━`,
                    `Order Ref: *${ord.order_reference || '#' + ord.id}*`,
                    `Total Amount: *${symbol}${parseFloat(ord.total_price).toFixed(2)}*`,
                    `Payment Method: *Cash on Delivery (COD)*`,
                    `Address: *${ord.address || 'Delivery Address'}*`,
                    `───────────────`,
                    `Your order is confirmed and sent to our kitchen for preparation! 🍽️`
                ].join("\n");

                await sendOfficialMessage(customerNumber, confirmText, userId);

                try {
                    await notifyKitchenAndStaff(userId, ord.order_reference || `#${ord.id}`, ord.customer_name, ord.customer_number, itemsArr, parseFloat(ord.total_price), parseFloat(ord.total_price), 0, 0, 0, 0, symbol, 'online', ord.address, '0');
                } catch (kotErr) { console.error("KOT notification fail on charge confirm:", kotErr); }
            }
            await updateSession(userId, cleanNum, 'IDLE', { cart: [] });
            return;
        }

        if (lower.startsWith('pay_charge_upi_')) {
            const ordId = lower.replace('pay_charge_upi_', '').trim();
            const ordRes = await pool.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [ordId, userId]);
            if (ordRes.rows.length > 0) {
                const ord = ordRes.rows[0];
                await pool.query("UPDATE orders SET status = 'AWAITING_PAYMENT', payment_method = 'UPI' WHERE id = $1", [ordId]);
                const itemsArr = typeof ord.items === 'string' ? JSON.parse(ord.items) : (ord.items || []);
                await deductInventory(userId, itemsArr);

                const backendBaseUrl = process.env.BACKEND_URL || 'https://backend.sasloop.in';
                const paymentLink = `${backendBaseUrl}/api/public/payment-redirect/${ord.order_reference || ordId}`;

                const upiMsg = [
                    `💳 *Prepaid UPI Selected!*`,
                    `Ref: *${ord.order_reference || '#' + ordId}*`,
                    `Total Amount: *${symbol}${parseFloat(ord.total_price).toFixed(2)}*`,
                    `───────────────`,
                    `💳 *Pay Online:* ${paymentLink}`,
                    ``,
                    `⚠️ *NOTE:* Please complete payment so we can prepare your order!`
                ].join("\n");

                await sendOfficialMessage(customerNumber, upiMsg, userId);
                const btnRes = await sendButtons(customerNumber, `💳 Click below once you have completed payment:`, [
                    { id: `payment_completed_${ord.order_reference || ordId}`, title: "I Have Paid" }
                ], userId);
                if (!btnRes || !btnRes.success) {
                    await sendOfficialMessage(customerNumber, `👉 After completing payment, reply "I HAVE PAID" to confirm.`, userId);
                }

                try {
                    await notifyKitchenAndStaff(userId, ord.order_reference || `#${ord.id}`, ord.customer_name, ord.customer_number, itemsArr, parseFloat(ord.total_price), parseFloat(ord.total_price), 0, 0, 0, 0, symbol, 'online', ord.address, '0');
                } catch (kotErr) { console.error("KOT notification fail on charge confirm:", kotErr); }
            }
            await updateSession(userId, cleanNum, 'IDLE', { cart: [] });
            return;
        }

        if (lower.startsWith('cancel_charge_')) {
            const ordId = lower.replace('cancel_charge_', '').trim();
            await pool.query("UPDATE orders SET status = 'CANCELLED', rejection_reason = 'Delivery charge rejected by customer' WHERE id = $1 AND user_id = $2", [ordId, userId]);
            await sendOfficialMessage(customerNumber, `❌ *ORDER CANCELLED*\n━━━━━━━━━━━━━━\nYour order has been cancelled as requested. Feel free to place a new order anytime!`, userId);
            await updateSession(userId, cleanNum, 'IDLE', { cart: [] });
            return;
        }

        if (lower === 'cancel' || lower === 'clear cart') {
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
                session.context.pending_item = { id: item.id, name: item.product_name, price: item.price };
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

        if (lower === 'checkout' || lower === 'proceed to checkout') {
            const text = `How would you like to receive your delicious meal today?`;
            const fo = biz.fulfillment_options || { pickup: true, delivery: true };
            const buttons = [];
            if (fo.pickup) buttons.push({ id: 'mode_pickup', title: '🥡 Pickup' });
            if (fo.delivery) buttons.push({ id: 'mode_delivery', title: '🚚 Delivery' });
            
            // Check for points
            const loyaltyRes = await pool.query("SELECT points FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2", [userId, cleanNum]);
            const points = loyaltyRes.rows[0]?.points || 0;
            const minRedeem = biz.min_redeem_points || 300;
            
            if (points >= minRedeem && !session.context.redeemedPoints) {
                buttons.push({ id: 'redeem_pts_wa', title: '🎁 Use Rewards' });
            }

            await sendButtons(customerNumber, text, buttons, userId);
            await updateSession(userId, cleanNum, 'AWAITING_MODE', session.context);
            return;
        }

        if (lower === 'redeem_pts_wa') {
            const loyaltyRes = await pool.query("SELECT points FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2", [userId, cleanNum]);
            const points = loyaltyRes.rows[0]?.points || 0;
            const minRedeem = biz.min_redeem_points || 300;
            const maxRedeem = biz.max_redeem_per_order || 300;

            if (points < minRedeem) {
                await sendOfficialMessage(customerNumber, `Sorry, you need at least ${minRedeem} points to redeem.`, userId);
                return;
            }

            const pointsToUse = Math.min(points, maxRedeem);
            session.context.redeemedPoints = pointsToUse;
            await updateSession(userId, cleanNum, 'AWAITING_MODE', session.context);

            const discount = pointsToUse * (parseFloat(biz.points_to_amount_ratio) || 0.1);
            await sendOfficialMessage(customerNumber, `✅ *Rewards Applied!* \n\nWe've applied a discount of *${symbol}${discount.toFixed(0)}* using ${pointsToUse} points. 🎊`, userId);
            
            // Show mode selection again
            const fo = biz.fulfillment_options || { pickup: true, delivery: true };
            const buttons = [];
            if (fo.pickup) buttons.push({ id: 'mode_pickup', title: '🥡 Pickup' });
            if (fo.delivery) buttons.push({ id: 'mode_delivery', title: '🚚 Delivery' });
            await sendButtons(customerNumber, "Now, how would you like to receive your order?", buttons, userId);
            return;
        }

        if (lower === 'pay_mode_upi' || lower === '1' || lower === 'upi' || lower === 'prepaid upi') {
            session.context.selectedPayMode = 'UPI';
            if (session.context.pendingFulfillment === 'PICKUP') {
                lower = 'mode_pickup';
            } else {
                lower = 'confirm_delivery_order';
            }
        } else if (lower === 'pay_mode_cod' || lower === '2' || lower === 'cod' || lower === 'cash on delivery') {
            session.context.selectedPayMode = 'COD';
            if (session.context.pendingFulfillment === 'PICKUP') {
                lower = 'mode_pickup';
            } else {
                lower = 'confirm_delivery_order';
            }
        }

        if (lower === 'mode_pickup') {
            const allowedMode = biz.settings?.whatsapp_payment_modes || 'BOTH';
            if (!session.context.selectedPayMode) {
                if (allowedMode === 'COD') {
                    session.context.selectedPayMode = 'COD';
                } else if (allowedMode === 'UPI') {
                    session.context.selectedPayMode = 'UPI';
                } else {
                    session.context.pendingFulfillment = 'PICKUP';
                    await updateSession(userId, cleanNum, 'AWAITING_PAYMENT_METHOD', session.context);
                    const buttons = [
                        { id: 'pay_mode_upi', title: '💳 Prepaid UPI' },
                        { id: 'pay_mode_cod', title: '💵 Cash on Delivery' }
                    ];
                    await sendButtons(customerNumber, `💳 *Select Payment Method for your order:*`, buttons, userId);
                    return;
                }
            }

            const isCOD = session.context.selectedPayMode === 'COD';
            const discountAmount = session.context.redeemedPoints ? (session.context.redeemedPoints * (parseFloat(biz.points_to_amount_ratio) || 0.1)) : 0;
            const total = Math.max(0, (biz.gst_included ? subtotal : (subtotal + cgst + sgst)) - discountAmount);

            const initialStatus = isCOD ? 'PENDING' : 'AWAITING_PAYMENT';
            const payMethod = isCOD ? 'COD' : 'UPI';

            await pool.query(
                "INSERT INTO orders (user_id, restaurant_id, customer_name, customer_number, address, items, total_price, order_reference, status, payment_method, redeemed_points, discount_amount, source, order_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
                [userId, biz.id || null, customerName, cleanNum, 'Pickup', JSON.stringify(cart), total, orderRef, initialStatus, payMethod, session.context.redeemedPoints || 0, discountAmount, 'WHATSAPP', 'WHATSAPP']
            );

            if (session.context.redeemedPoints) {
                await pool.query(
                    "UPDATE customer_loyalty SET points = points - $1 WHERE user_id = $2 AND customer_number = $3",
                    [session.context.redeemedPoints, userId, cleanNum]
                );
            }

            // 🔥 WEBHOOK TRIGGER
            triggerWebhook(biz, 'order.new', { reference: orderRef, type: 'PICKUP', total, items: cart, customer: { name: customerName, phone: cleanNum } });

            // 🚨 KOT & STAFF NOTIFICATION (always send, regardless of payment method)
            await deductInventory(userId, cart);

            try {
                await notifyKitchenAndStaff(
                    userId, orderRef, customerName, cleanNum, cart,
                    total, total, 0, 0, 0, 0, symbol,
                    'online', 'Pickup', '0'
                );
            } catch (kotErr) { console.error("KOT error for pickup order:", kotErr); }

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

            if (!isCOD) {
                const baseUrl = process.env.BACKEND_URL || 'https://backend.sasloop.in';
                const paymentLink = `${baseUrl}/api/public/payment-redirect/${orderRef}`;
                const upiMsg = [
                    `💳 *Prepaid UPI Selected!*`,
                    `Ref: ${orderRef}`,
                    `Total: ${symbol}${total.toFixed(2)}`,
                    `───────────────`,
                    `💳 *Pay Online:* ${paymentLink}`,
                    ``,
                    `⚠️ *NOTE:* Please complete payment first so we can accept and prepare your order!`,
                    `👉 *After paying, click the button below or reply "I HAVE COMPLETED PAYMENT".*`
                ].join("\n");

                await sendOfficialMessage(customerNumber, upiMsg, userId);
                const btnRes = await sendButtons(customerNumber, `💳 Click below once you have completed payment:`, [
                    { id: `payment_completed_${orderRef}`, title: "I Have Paid" }
                ], userId);
                if (!btnRes || !btnRes.success) {
                    await sendOfficialMessage(customerNumber, `👉 After completing payment, reply "I HAVE PAID" to confirm.`, userId);
                }
            } else {
                const receiptRows = [
                    `⏳ *Pickup Order Placed!*`,
                    `Ref: ${orderRef}`,
                    `───────────────`,
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
                receiptRows.push(`💵 *Payment Method:* Cash on Delivery / Pay on Pickup`);
                receiptRows.push(`📋 *Status:* Pending for POS Confirmation`);
                receiptRows.push(``);
                receiptRows.push(`Please arrive in 20-30 minutes for pickup. See you soon! 🥡`);

                const receipt = receiptRows.join("\n");
                await sendBrandedText(customerNumber, biz.name, receipt, userId);
            }

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

            const allowedMode = biz.settings?.whatsapp_payment_modes || 'BOTH';
            if (!session.context.selectedPayMode) {
                if (allowedMode === 'COD') {
                    session.context.selectedPayMode = 'COD';
                } else if (allowedMode === 'UPI') {
                    session.context.selectedPayMode = 'UPI';
                } else {
                    session.context.pendingFulfillment = 'DELIVERY';
                    await updateSession(userId, cleanNum, 'AWAITING_PAYMENT_METHOD', session.context);
                    const buttons = [
                        { id: 'pay_mode_upi', title: '💳 Prepaid UPI' },
                        { id: 'pay_mode_cod', title: '💵 Cash on Delivery' }
                    ];
                    await sendButtons(customerNumber, `💳 *Select Payment Method for your order:*`, buttons, userId);
                    return;
                }
            }

            const isCOD = session.context.selectedPayMode === 'COD';
            const discountAmount = session.context.redeemedPoints ? (session.context.redeemedPoints * (parseFloat(biz.points_to_amount_ratio) || 0.1)) : 0;
            const initialStatus = isCOD ? 'PENDING' : 'AWAITING_PAYMENT';
            const payMethod = isCOD ? 'COD' : 'UPI';
            
            await pool.query(
                "INSERT INTO orders (user_id, restaurant_id, customer_name, customer_number, address, items, total_price, order_reference, status, delivery_charge, payment_method, redeemed_points, discount_amount, source, order_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)",
                [userId, biz.id || null, customerName || "WhatsApp Customer", cleanNum, pending.address, JSON.stringify(pending.items), pending.total, orderRef, initialStatus, pending.deliveryCharge, payMethod, session.context.redeemedPoints || 0, discountAmount, 'WHATSAPP', 'DELIVERY']
            );

            if (session.context.redeemedPoints) {
                await pool.query(
                    "UPDATE customer_loyalty SET points = points - $1 WHERE user_id = $2 AND customer_number = $3",
                    [session.context.redeemedPoints, userId, cleanNum]
                );
            }

            // 🔥 WEBHOOK TRIGGER
            triggerWebhook(biz, 'order.new', { reference: orderRef, type: 'DELIVERY', total: pending.total, items: pending.items, address: pending.address, customer: { name: customerName, phone: cleanNum } });

            // 🚨 KOT & STAFF NOTIFICATION (always send, regardless of payment method)
            await deductInventory(userId, pending.items);

            try {
                await notifyKitchenAndStaff(
                    userId, orderRef, customerName, cleanNum, pending.items,
                    pending.total, pending.total, 0, 0, 0, 0, symbol,
                    'online', pending.address, '0'
                );
            } catch (kotErr) { console.error("KOT error for delivery order:", kotErr); }

            const frontendBaseUrl = process.env.FRONTEND_URL || 'https://backend.sasloop.in';
            const backendBaseUrl = process.env.BACKEND_URL || 'https://backend.sasloop.in';
            const paymentLink = `${backendBaseUrl}/api/public/payment-redirect/${orderRef}`;

            const receiptRows = [
                `⏳ *Delivery Order Placed!*`,
                `Ref: ${orderRef}`,
                `───────────────`,
                `💵 *Payment Method:* ${isCOD ? 'Cash on Delivery (COD)' : 'Prepaid UPI'}`
            ];

            if (!isCOD) {
                receiptRows.push(`💳 *Pay Now:* ${paymentLink}`);
                receiptRows.push(`⚠️ *NOTE:* Please complete payment first so we can accept and prepare your order!`);
                receiptRows.push(`👉 *After paying, click the button below or reply "I HAVE COMPLETED PAYMENT".*`);
            }

            receiptRows.push(`📋 *Status:* Pending Payment Verification`);
            receiptRows.push(`───────────────`);
            receiptRows.push(isCOD ? `Your order will be sent to the kitchen once confirmed. Thank you! 🎉` : `Your order will be accepted and sent to the kitchen after payment verification. Thank you! 🎉`);

            const receipt = receiptRows.join("\n");

            if (!isCOD) {
                await sendOfficialMessage(customerNumber, receipt, userId);
                const btnRes = await sendButtons(customerNumber, `💳 Click below once you have completed payment:`, [
                    { id: `payment_completed_${orderRef}`, title: "I Have Paid" }
                ], userId);
                if (!btnRes || !btnRes.success) {
                    await sendOfficialMessage(customerNumber, `👉 After completing payment, reply "I HAVE PAID" to confirm.`, userId);
                }
            } else {
                await sendOfficialMessage(customerNumber, receipt, userId);
            }

            await updateSession(userId, cleanNum, 'IDLE', { cart: [] });
            return;
        }

        if (lower === 'join_loyalty') {
            try {
                const joiningPoints = parseInt(biz.loyalty_joining_points) || 0;
                await pool.query(
                    `INSERT INTO customer_loyalty (user_id, customer_number, name, points) 
                     VALUES ($1, $2, $3, $4) 
                     ON CONFLICT (user_id, customer_number) DO NOTHING`,
                    [userId, cleanNum, customerName || "Customer", joiningPoints]
                );
                
                // Log welcome transaction
                if (joiningPoints > 0) {
                    await pool.query(
                        `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason) 
                         VALUES ($1, $2, 'POINTS_EARNED', 0, $3, 'Welcome Signup Bonus')`,
                        [userId, cleanNum, joiningPoints]
                    );
                }

                const successMsg = `🎉 *Congratulations!* You've joined our VIP Club.\n\n*${joiningPoints} Points* have been added to your account. 🎊\n\nHow can I help you today?`;
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
            
            const baseUrl = process.env.FRONTEND_URL || 'https://menu.sasloop.in';
            if (!menuLink) menuLink = `${baseUrl}/menu/${biz.id}`;

            const text = `📜 *Our Digital Menu*\n━━━━━━━━━━━━━━\n\nYou can browse our full catalog and see all the latest flavors here:\n\n🔗 ${menuLink}\n\nAnything else I can help you with?`;
            await sendOfficialMessage(customerNumber, text, userId);
            return;
        }

        // --- 🍽️ HANDLE TABLE RESERVATION ---
        if (lower === 'table_reservation' || lower === 'table reservation' || lower === 'book table' || lower === 'reserve table' || lower === 'reservation') {
            const seatingRes = await pool.query(
                `SELECT id, department_name AS name 
                 FROM table_departments 
                 WHERE (user_id = $1 OR outlet_id = $1 OR user_id = 2 OR outlet_id = 2) AND is_active = true 
                 ORDER BY department_name ASC`,
                [userId]
            );
            let seatingAreas = seatingRes.rows.map(r => r.name);
            if (seatingAreas.length === 0) {
                seatingAreas = ["Indoor", "Outdoor", "Rooftop", "VIP Section"];
            }

            const headerText = `🍽️ *Table Reservation*\n━━━━━━━━━━━━━━\nWelcome! Please select your preferred *Seating Area* for your visit:`;

            if (seatingAreas.length <= 3) {
                const buttons = seatingAreas.map(area => ({
                    id: `seat_${area.replace(/\s+/g, '_').toLowerCase()}`,
                    title: area.substring(0, 20)
                }));
                await sendButtons(customerNumber, headerText, buttons, userId);
            } else {
                const rows = seatingAreas.slice(0, 10).map(area => ({
                    id: `seat_${area.replace(/\s+/g, '_').toLowerCase()}`,
                    title: area.substring(0, 24),
                    description: `Reserve table in ${area}`
                }));
                await sendList(customerNumber, "Seating Areas 🪑", headerText, "✨ Select Area ✨", [{ title: "Available Seating Areas", rows }], userId);
            }
            return;
        }

        if (lower.startsWith('seat_')) {
            const areaSlug = lower.replace(/^seat_/, '');
            const seatingRes = await pool.query(
                `SELECT department_name AS name 
                 FROM table_departments 
                 WHERE (user_id = $1 OR outlet_id = $1 OR user_id = 2 OR outlet_id = 2) AND is_active = true 
                 ORDER BY department_name ASC`,
                [userId]
            );
            let seatingAreas = seatingRes.rows.map(r => r.name);
            if (seatingAreas.length === 0) {
                seatingAreas = ["Indoor", "Outdoor", "Rooftop", "VIP Section"];
            }
            const matchedArea = seatingAreas.find(a => a.replace(/\s+/g, '_').toLowerCase() === areaSlug) || areaSlug.replace(/_/g, ' ').toUpperCase();

            session.context.pending_reservation = { seatingArea: matchedArea };
            await updateSession(userId, cleanNum, 'AWAITING_RESERVATION_DETAILS', session.context);

            let menuLink = biz.settings?.menuLink || biz.social_website;
            const baseUrl = process.env.FRONTEND_URL || 'https://menu.sasloop.in';
            if (!menuLink) menuLink = `${baseUrl}/menu/${biz.id}`;

            const text = `🪑 *Seating Area Selected:* ${matchedArea}\n━━━━━━━━━━━━━━\n\nPlease reply with your reservation details:\n\n*Date, Time, Number of Guests*\n\n*Example:* Tomorrow 7:30 PM, 4 guests\n\nOr complete your booking online: 🔗 ${menuLink}`;
            await sendOfficialMessage(customerNumber, text, userId);
            return;
        }

        if (lower === 'loyalty' || lower === 'loyalty_check' || lower === 'balance' || lower === 'due' || lower === 'outstanding' || lower === 'points') {
            const loyaltyRes = await pool.query("SELECT points, balance FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2", [userId, cleanNum]);
            const points = loyaltyRes.rows[0]?.points || 0;
            const rawBalance = parseFloat(loyaltyRes.rows[0]?.balance || 0);
            
            let balStr = "Rs 0.00";
            if (rawBalance > 0) {
                balStr = `Rs ${rawBalance.toFixed(2)} (Advance)`;
            } else if (rawBalance < 0) {
                balStr = `Rs ${Math.abs(rawBalance).toFixed(2)} (Due)`;
            }

            const text = `🎁 *Your Rewards & Balance*\n━━━━━━━━━━━━━━\n\nTotal Points Available: *${points} pts*\nLedger Balance: *${balStr}*\n\n✨ *How to Redeem:* \nJust click "Redeem via WhatsApp" on our digital menu and send the pre-filled message! No more OTPs needed. 🎊`;
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

        // --- ⚡ MULTI-LINE ORDER FAST-TRACK PARSER ---
        if (lower.includes('\n')) {
            const lines = lower.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
            const noOptionItems = [];
            let optionItemToPick = null;

            for (const rawLine of lines) {
                const lineMatch = rawLine.match(/^(.+?)\s+(\d+)$/) || rawLine.match(/^(\d+)\s+(.+?)$/);
                if (!lineMatch) continue;

                const isTrailing = !!rawLine.match(/^(.+?)\s+(\d+)$/);
                const namePart = (isTrailing ? lineMatch[1] : lineMatch[2]).trim().toLowerCase();
                const qtyPart = parseInt(isTrailing ? lineMatch[2] : lineMatch[1]);

                if (!namePart || isNaN(qtyPart) || qtyPart <= 0) continue;

                const words = namePart.split(/\s+/);
                const matchedItem = menu.find(i => {
                    const pName = i.product_name.toLowerCase();
                    return pName === namePart || pName.includes(namePart) || namePart.includes(pName) ||
                           words.some(w => w.length >= 3 && pName.includes(w));
                });

                if (matchedItem) {
                    const optData = await getItemOptions(matchedItem.id, userId);
                    if (optData && !optionItemToPick) {
                        optionItemToPick = { item: matchedItem, optData, qty: qtyPart };
                    } else {
                        noOptionItems.push({ item: matchedItem, qty: qtyPart });
                    }
                }
            }

            if (noOptionItems.length > 0 || optionItemToPick) {
                const cart = session.context.cart || [];
                for (const b of noOptionItems) {
                    const existing = cart.find(c => c.name === b.item.product_name);
                    if (existing) existing.qty += b.qty;
                    else cart.push({ id: b.item.id, name: b.item.product_name, qty: b.qty, price: b.item.price });
                }

                session.context.cart = cart;

                if (optionItemToPick) {
                    const { item, optData, qty } = optionItemToPick;
                    const body = `😋 *Choose size/option for ${item.product_name}:*\n━━━━━━━━━━━━━━\nPlease select one of the sizes below:`;
                    await sendOptionsPicker(customerNumber, body, optData.options, userId, symbol, item.product_name);

                    session.context.pending_option_selection = {
                        mainItem: { id: item.id, name: item.product_name },
                        options: optData.options,
                        qty: qty
                    };
                    await updateSession(userId, cleanNum, 'AWAITING_OPTION_SELECTION', session.context);
                } else {
                    await updateSession(userId, cleanNum, 'IDLE', session.context);

                    const cartSummaryLines = cart.map(i => `• ${i.qty}x *${i.name}*`).join('\n');
                    const cartTotal = cart.reduce((sum, i) => sum + (i.qty * i.price), 0);

                    const msg = `✅ *Added to Bag!*\n\n${cartSummaryLines}\n\n💰 *Total Bag: ${symbol}${cartTotal.toFixed(2)}*`;
                    await sendButtons(customerNumber, msg, [
                        { id: 'checkout', title: '🛒 Checkout Now' },
                        { id: 'place_order', title: '➕ Add More' }
                    ], userId);
                }
                return;
            }
        }

        // --- ⚡ FAST-TRACK MATCHING (Bypass AI for simple keywords & direct quantity items) ---
        let simpleLower = lower.trim();
        let extractedQty = null;

        // Extract trailing or leading quantity (e.g., "rista 2", "2 rista", "kabab 3")
        const trailingQtyMatch = simpleLower.match(/^(.+?)\s+(\d+)$/);
        const leadingQtyMatch = simpleLower.match(/^(\d+)\s+(.+?)$/);

        if (trailingQtyMatch) {
            simpleLower = trailingQtyMatch[1].trim();
            extractedQty = parseInt(trailingQtyMatch[2]);
        } else if (leadingQtyMatch) {
            simpleLower = leadingQtyMatch[2].trim();
            extractedQty = parseInt(leadingQtyMatch[1]);
        }

        // Skip keyword search if it's a simple greeting or too short
        const isGreeting = greetings.includes(simpleLower);
        const isTooShort = simpleLower.length < 3;

        const rawDirectMatches = (isGreeting || isTooShort) ? [] : menu.filter(i => 
            i.product_name.toLowerCase() === simpleLower || 
            (i.category && i.category.toLowerCase() === simpleLower) || 
            (i.sub_category && i.sub_category.toLowerCase() === simpleLower) ||
            (simpleLower.length >= 3 && (i.product_name.toLowerCase().includes(simpleLower) || simpleLower.includes(i.product_name.toLowerCase())))
        );

        // Deduplicate direct matches by product_name
        const seenDirect = new Set();
        const directMatches = [];
        for (const item of rawDirectMatches) {
            const key = item.product_name.toLowerCase();
            if (!seenDirect.has(key)) {
                seenDirect.add(key);
                directMatches.push(item);
            }
        }

        if (directMatches.length > 0) {
            console.log(`⚡ Fast-Track Match Found for: ${simpleLower}`);
            
            const exactMatchItem = directMatches.find(i => i.product_name.toLowerCase() === simpleLower);
            
            if (exactMatchItem || directMatches.length === 1) {
                const item = exactMatchItem || directMatches[0];
                const optData = await getItemOptions(item.id, userId);
                if (optData) {
                    const body = `😋 *Choose size/option for ${item.product_name}:*\n━━━━━━━━━━━━━━\nPlease select one of the sizes below:`;
                    await sendOptionsPicker(customerNumber, body, optData.options, userId, symbol, item.product_name);
                    
                    session.context.pending_option_selection = {
                        mainItem: { id: item.id, name: item.product_name },
                        options: optData.options,
                        qty: extractedQty || 1
                    };
                    await updateSession(userId, cleanNum, 'AWAITING_OPTION_SELECTION', session.context);
                } else {
                    if (extractedQty && extractedQty > 0) {
                        const cart = session.context.cart || [];
                        const existing = cart.find(c => c.name === item.product_name);
                        if (existing) existing.qty += extractedQty;
                        else cart.push({ id: item.id, name: item.product_name, qty: extractedQty, price: item.price });
                        
                        session.context.cart = cart;
                        await updateSession(userId, cleanNum, 'IDLE', session.context);
                        
                        const cartSummaryLines = cart.map(i => `• ${i.qty}x *${i.name}*`).join('\n');
                        const cartTotal = cart.reduce((sum, i) => sum + (i.qty * i.price), 0);
                        
                        const msg = `✅ *Added to Bag!*\n\n${cartSummaryLines}\n\n💰 *Total Bag: ${symbol}${cartTotal.toFixed(2)}*`;
                        await sendButtons(customerNumber, msg, [
                            { id: 'checkout', title: '🛒 Checkout Now' },
                            { id: 'place_order', title: '➕ Add More' }
                        ], userId);
                    } else {
                        const text = `Excellent choice! The *${item.product_name}* is priced at ${symbol}${item.price}.\n\nHow many would you like me to add for you?`;
                        await sendBrandedText(customerNumber, biz.name, text, userId);
                        session.context.pending_item = { id: item.id, name: item.product_name, price: item.price };
                        await updateSession(userId, cleanNum, 'AWAITING_QUANTITY', session.context);
                    }
                }
            } else {
                // --- SMART GROUPING: Group items by base name (strip size/portion words) ---
                const groups = {};
                directMatches.forEach(m => {
                    const base = m.product_name.replace(/\s(Small|Medium|Large|Full|Half|Regular|Personal|Monster|1kg|500g|250g|Quarter|Single|Double|Triple|Family|Party|Mega|Mini|XL|XXL|Jumbo|King|Extra)\b/gi, '').trim();
                    if (!groups[base]) groups[base] = [];
                    groups[base].push(m);
                });

                const groupNames = Object.keys(groups);

                // If we have multiple distinct groups (e.g. Margherita Pizza, Pepperoni Pizza, etc.)
                // Show a group picker so user picks flavor first, then sees sizes
                if (groupNames.length > 1 && directMatches.length > 3) {
                    // Use multiple sections if groups > 10 (WhatsApp allows up to 10 sections x 10 rows)
                    const allRows = await buildGroupRows(groupNames, groups, userId, symbol);

                    // Split rows into sections of 10
                    const sections = [];
                    for (let i = 0; i < allRows.length; i += 10) {
                        const chunk = allRows.slice(i, i + 10);
                        sections.push({
                            title: sections.length === 0 ? `🍕 ${simpleLower} Varieties` : `More ${simpleLower}`,
                            rows: chunk
                        });
                    }
                    // WhatsApp allows max 10 sections
                    const finalSections = sections.slice(0, 10);

                    const body = `🍕 *Which type of ${simpleLower} would you like?*\n━━━━━━━━━━━━━━\nWe found *${directMatches.length}* items across *${groupNames.length}* varieties! 👇`;
                    await sendList(customerNumber, "Select Type", body, "✨ View All Types ✨", finalSections, userId);
                    
                    session.context.pending_selection = { keyword: simpleLower, qty: 1, is_group: true, groups };
                    await updateSession(userId, cleanNum, 'IDLE', session.context);
                    return;
                }

                // If only 1 group or few items — show ALL items directly using multi-section list
                const allRows = directMatches.map(m => ({
                    id: m.product_name,
                    title: m.product_name.substring(0, 24),
                    description: `${symbol}${m.price}`
                }));

                // Split into sections of 10 rows each
                const sections = [];
                for (let i = 0; i < allRows.length; i += 10) {
                    const chunk = allRows.slice(i, i + 10);
                    sections.push({
                        title: sections.length === 0 ? `🔍 ${simpleLower} Items` : `More ${simpleLower} Items`,
                        rows: chunk
                    });
                }
                // WhatsApp allows max 10 sections (= 100 items max)
                const finalSections = sections.slice(0, 10);

                const totalShown = finalSections.reduce((sum, s) => sum + s.rows.length, 0);
                const body = `🤔 *Which ${simpleLower} did you mean?*\n━━━━━━━━━━━━━━\nShowing *${totalShown}* matching items. Select from the list below. 👇`;
                await sendList(customerNumber, "Select Item", body, "✨ View Options ✨", finalSections, userId);
                
                session.context.pending_selection = { keyword: simpleLower, qty: 1 };
                await updateSession(userId, cleanNum, 'IDLE', session.context);
            }
            return;
        }

        // --- 🧠 ADVANCED AI SALESMAN ENGINE (Fallthrough) ---

        // --- ⚡ FAST ENQUIRY ---
        const enquiryWords = ['available', 'price', 'cost', 'have', 'what', 'rate', 'delivery', 'milega', 'chahiye', 'kitna', 'hai', 'kartay'];
        const complexWords = ['how', 'why', 'banatay', 'recipe', 'tell', 'batao', 'explain', 'detail', 'ingredients'];
        const hasNumbers = /\d/.test(lower);
        const words = lower.split(/\s+/);
        const hasEnquiryWord = words.some(w => enquiryWords.includes(w));
        const hasComplexWord = words.some(w => complexWords.includes(w));
        
        if (hasEnquiryWord && !hasComplexWord && !hasNumbers) {
            const isUrdu = lower.includes('chahiye') || lower.includes('milega') || lower.includes('hai') || lower.includes('kartay') || lower.includes('kitna');
            if (lower.split(' ').length < 8) {
                if (lower.includes('delivery')) {
                    const deliveryOk = biz.fulfillment_options?.delivery !== false;
                    const deliveryMsg = deliveryOk 
                        ? (isUrdu 
                            ? `🚚 *Home Delivery Available hai!* 🏠\n━━━━━━━━━━━━━━\nHum aapke ghar tak deliver karte hain. Checkout ke waqt apna location share karein delivery charges dekhne ke liye.\n\nKya aap order start karna chahenge?`
                            : `🚚 *Home Delivery is Available!* 🏠\n━━━━━━━━━━━━━━\nWe deliver to your doorstep. You can share your location pin during checkout to see delivery charges.\n\nWould you like to start your order?`)
                        : (isUrdu
                            ? `🥡 *Sirf Pickup available hai*\n━━━━━━━━━━━━━━\nAbhi hum sirf Pickup aur Dine-in support karte hain. Home delivery abhi band hai.`
                            : `🥡 *Pickup Only*\n━━━━━━━━━━━━━━\nCurrently, we only support Pickup and Dine-in. Home delivery is not available at this moment.`);
                    
                    await sendButtons(customerNumber, deliveryMsg, [
                        { id: 'place_order', title: isUrdu ? '🛍️ Order Karein' : '🛍️ Place an Order' },
                        { id: 'view_menu', title: isUrdu ? '📜 Menu Dekhein' : '📜 View Menu' }
                    ], userId);
                    return;
                }

                let query = lower;
                enquiryWords.forEach(w => { query = query.replace(new RegExp(`\\b${w}\\b`, 'g'), ''); });
                query = query.replace(/[?]/g, '').trim();
                
                if (query.length > 2) {
                    const match = menu.find(i => i.product_name.toLowerCase().includes(query) || query.includes(i.product_name.toLowerCase()));
                    if (match) {
                        const isAvailable = match.availability !== false; 
                        let status = isAvailable ? "✅ *Available*" : "❌ *Out of Stock*";
                        if (isUrdu) status = isAvailable ? "✅ *Available hai*" : "❌ *Abhi khatam hai*";

                        const reply = isUrdu 
                            ? `🤖 *Dish Enquiry*\n━━━━━━━━━━━━━━\n📦 *Item:* ${match.product_name}\n💰 *Price:* ${symbol}${match.price}\n✨ *Status:* ${status}\n\nKya aap ise order mein add karna chahenge?`
                            : `🤖 *Dish Enquiry*\n━━━━━━━━━━━━━━\n📦 *Item:* ${match.product_name}\n💰 *Price:* ${symbol}${match.price}\n✨ *Status:* ${status}\n\nWould you like to add this to your order?`;
                        
                        const buttons = [];
                        if (isAvailable) {
                            const rawTitle = isUrdu ? `🛒 Add Karein` : `🛒 Order ${match.product_name}`;
                            const buttonTitle = rawTitle.length > 20 ? rawTitle.substring(0, 17) + "..." : rawTitle;
                            buttons.push({ id: `order_${match.product_name}`, title: buttonTitle });
                        }
                        buttons.push({ id: 'place_order', title: isUrdu ? '🛍️ Aur Dekhein' : '🛍️ Browse More' });
                        await sendButtons(customerNumber, reply, buttons, userId);
                        return;
                    }
                }
            }
        }
        // --- 🧠 ADVANCED AI SALESMAN ENGINE ---
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const cartSummary = cart.length > 0 ? cart.map(i => `${i.qty}x ${i.name}`).join(", ") : "Empty";
        
        // Fetch customer balance for AI context
        const custBalRes = await pool.query(
            `SELECT balance, points FROM customer_loyalty 
             WHERE (user_id = $1 OR user_id = 2 OR user_id IS NOT NULL) 
             AND RIGHT(regexp_replace(customer_number, '\\D', '', 'g'), 10) = $2
             ORDER BY id DESC LIMIT 1`,
            [userId, cleanNum.slice(-10)]
        );
        const aiCustBal = custBalRes.rows[0] || { balance: 0, points: 0 };
        
        const systemPrompt = `
You are the Master Sales Executive for ${biz.name}.
CONTEXT:
- Customer Wallet Balance: ${symbol}${parseFloat(aiCustBal.balance || 0).toFixed(2)}
- Customer Reward Points: ${parseInt(aiCustBal.points || 0)} Points
- Cart: ${cartSummary}
- Menu: ${menuContext}
- Extra Info: ${biz.bot_knowledge || 'No specific info.'}
- Loyalty Program: Customers can redeem points by clicking "Redeem via WhatsApp" on the digital menu. This sends a unique token (RED-XXXXXX). Once they send it, the discount is applied automatically in their browser. NO OTPs are used. If customer asks for their balance, wallet, points, or ledger, inform them warmy with their exact wallet balance and points.

YOUR MISSION: Extract items, quantities, and intent. Match items against the menu list.
⚠️ CRITICAL MENU GATING: You can ONLY suggest, confirm, or upsell items that are explicitly listed in the "- Menu:" context above. If the user asks for a dish that is NOT in the Menu context (even if you know it is a common item or matches the restaurant style), do NOT assume we have it and do NOT say you will add it. Instead, politely inform them it is currently unavailable or out of stock, suggest they view the menu, and prompt them to select something else.
REPLY in the SAME LANGUAGE as the user (English or Roman Urdu).

JSON RULES:
- "intent": "ORDER_ITEM", "GREETING", "CHECKOUT", "ENQUIRY", "RESERVATION", "FEEDBACK", "CANCEL_ORDER", or "UNKNOWN".
- "items": Array of { "name": string, "quantity": number }. ⚠️ CRITICAL: Only include items that are present in the provided Menu context. Never include or guess items that are not in the Menu. NEVER guess the specific dish variant. If a user says "Biryani", "Pizza", or "Chicken", and your menu context shows multiple variants (e.g. Full/Half, Veg/Non-Veg), you MUST return the generic name ONLY (e.g. "Biryani") so the system can ask for clarification.
- "human_reply": A conversational, sales-driven response. Confirm items enthusiastically. If an item is not in the Menu context, politely explain that it is out of stock / unavailable today. If an item is ambiguous, tell them you'll show the options.
- "upsell_suggestion": A short, tempting suggestion for one more item (must be from the Menu context).

RETURN ONLY JSON:
{
  "intent": string,
  "items": [],
  "reservation": { "date": string, "time": string, "guests": number },
  "feedback": { "rating": number, "comment": string },
  "human_reply": string,
  "upsell_suggestion": string
}
`;

        let result = null;
        try {
            // --- 🚀 PRIMARY: GROQ (Fast & Reliable) ---
            const chatCompletion = await groq.chat.completions.create({
                messages: [{ role: "system", content: systemPrompt }, { role: "user", content: msgText }],
                model: "llama-3.1-8b-instant",
                response_format: { type: "json_object" }
            });

            const resultStr = chatCompletion.choices[0]?.message?.content || "{}";
            console.log(`🤖 GROQ RESPONSE for "${msgText}":`, resultStr);
            result = JSON.parse(resultStr);
        } catch (groqErr) {
            console.error("⚠️ Groq Failed, falling back to Gemini:", groqErr.message);
            
            // --- 💎 BACKUP: GOOGLE GEMINI ---
            if (process.env.GEMINI_API_KEY) {
                try {
                    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
                    const geminiRes = await axios.post(geminiUrl, {
                        contents: [{ 
                            parts: [{ 
                                text: `${systemPrompt}\n\nUSER MESSAGE: ${msgText}\n\nIMPORTANT: Return ONLY the JSON object. No markdown, no extra text.` 
                            }] 
                        }],
                        generationConfig: { 
                            responseMimeType: "application/json",
                            temperature: 0.1 
                        }
                    });

                    const geminiText = geminiRes.data.candidates[0].content.parts[0].text;
                    console.log(`💎 GEMINI RESPONSE for "${msgText}":`, geminiText);
                    result = JSON.parse(geminiText);
                } catch (geminiErr) {
                    console.error("❌ Gemini Fallback also failed:", geminiErr.message);
                    throw groqErr; // Rethrow original if fallback fails too
                }
            } else {
                throw groqErr;
            }
        }

        if (result) {
            if (result.intent === 'GREETING' || lower === 'hi' || lower === 'hello' || lower === 'menu') {
                // --- 🎁 CHECK FOR NEW CUSTOMER LOYALTY ---
                const loyaltyCheck = await pool.query("SELECT id FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2", [userId, cleanNum]);
                if (loyaltyCheck.rows.length === 0) {
                    const joiningPoints = parseInt(biz.loyalty_joining_points) || 0;
                    let pointsPromo = "";
                    if (joiningPoints > 0) {
                        pointsPromo = ` and get *${joiningPoints} Free Points* instantly`;
                    }
                    const welcomeMsg = `👋 *Welcome to ${bizName}!* ✨\n\n${result.human_reply || "Hello! It is a pleasure to meet you. 😊"}\n\n🎁 Join our *VIP Club* today${pointsPromo} to start earning rewards and track your orders! 🎈`;
                    await sendButtons(customerNumber, welcomeMsg, [
                        { id: 'join_loyalty', title: joiningPoints > 0 ? `🎁 Claim ${joiningPoints} Pts` : '🎁 Join VIP Club' },
                        { id: 'place_order', title: '🛍️ Browse Menu' }
                    ], userId);
                    return;
                }

                // Standard Professional List Menu
                await sendList(customerNumber, "How can we help? ✨", `🏠 *Welcome back to ${bizName}!* \n\nHello ${customerName}, how may I assist you today? 🌟 \n\nYou can explore our menu, place an order, or book a table below. 👇`, "✨ Open Main Menu ✨", [
                    {
                        title: "🛒 Ordering & Booking",
                        rows: [
                            { id: "place_order", title: "🛍️ Place an Order", description: "Quick selection of your favorites 🍔 computational" },
                            { id: "view_menu", title: "📜 View Digital Menu", description: "Browse our full catalog & deals 🍕🍰" },
                            { id: "table_reservation", title: "🍽️ Table Reservation", description: "Reserve a table & select seating area 🪑" }
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

            if (result.intent === 'CANCEL_ORDER') {
                const activeOrders = await pool.query(
                    "SELECT id, order_reference, status FROM orders WHERE user_id = $1 AND customer_number = $2 AND status NOT IN ('COMPLETED', 'CANCELLED') ORDER BY created_at DESC LIMIT 1",
                    [userId, cleanNum]
                );

                if (activeOrders.rows.length > 0) {
                    const order = activeOrders.rows[0];
                    const msg = `🛑 *Order Cancellation Requested*\n━━━━━━━━━━━━━━\n\nYour cancellation request for order *${order.order_reference || order.id}* has been sent to our kitchen team immediately. 🙏`;
                    await sendOfficialMessage(customerNumber, msg, userId);

                    // Notify staff & kitchen number
                    const staffNums = Array.isArray(biz.notification_numbers) ? biz.notification_numbers : (biz.notification_numbers ? [biz.notification_numbers] : []);
                    const kitchenNum = biz.kitchen_notification_number || biz.kitchen_phone;

                    const notifyTargets = new Set();
                    staffNums.forEach(n => notifyTargets.add(n));
                    if (kitchenNum) notifyTargets.add(kitchenNum);

                    const cancelText = `🚨 *URGENT: ORDER CANCELLED BY CUSTOMER!*\n━━━━━━━━━━━━━━\nOrder Ref: *${order.order_reference || order.id}*\nCustomer: ${customerName || customerNumber} (${cleanNum})\nPrevious Status: ${order.status}\n\nPlease stop preparing this order immediately!`;

                    for (let targetNum of notifyTargets) {
                        if (targetNum) {
                            await sendOfficialMessage(targetNum, cancelText, userId);
                        }
                    }
                } else {
                    await sendOfficialMessage(customerNumber, "I couldn't find any active orders for you to cancel. If you have any concerns, please type 'support' to talk to us! 😊", userId);
                }
                return;
            }

            if (result.intent === 'RESERVATION') {
                if (result.reservation && result.reservation.date && result.reservation.time && result.reservation.guests) {
                    const randomRef = `RES-${Math.floor(100000 + Math.random() * 900000)}`;
                    let defaultSeating = 'Dining';
                    try {
                        const seatRes = await pool.query(
                            `SELECT department_name FROM table_departments 
                             WHERE (user_id = $1 OR outlet_id = $1 OR user_id = 2 OR outlet_id = 2) AND is_active = true 
                             ORDER BY department_name ASC LIMIT 1`,
                            [userId]
                        );
                        if (seatRes.rows.length > 0 && seatRes.rows[0].department_name) {
                            defaultSeating = seatRes.rows[0].department_name;
                        }
                    } catch (e) {}
                    await pool.query(
                        `INSERT INTO table_reservations 
                         (user_id, outlet_id, reservation_ref, customer_name, customer_phone, guests_count, reservation_date, reservation_time, seating_preference, special_notes, status, created_at)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'PENDING', NOW())`,
                        [userId, biz.id || userId, randomRef, customerName || "Customer", cleanNum, result.reservation.guests, result.reservation.date, result.reservation.time, defaultSeating, 'Booked via AI Chat']
                    );
                    const msg = `✅ *Table Reserved! (Pending Confirmation)*\n━━━━━━━━━━━━━━\n\nWe have received your reservation request for *${result.reservation.guests} guests* on *${result.reservation.date}* at *${result.reservation.time}* (Ref: ${randomRef}).\n\nOur team will confirm your table shortly!`;
                    await sendOfficialMessage(customerNumber, msg, userId);
                } else {
                    await sendOfficialMessage(customerNumber, result.human_reply || "I'd love to help book a table. For what date, time, and how many guests?", userId);
                }
                return;
            }

            const isOrderItem = result.intent === 'ORDER_ITEM' || 
                                (result.intent && result.intent.toLowerCase().includes('order')) || 
                                (result.items && Array.isArray(result.items) && result.items.length > 0);

            if (isOrderItem && result.items && result.items.length > 0) {
                let addedSummary = [];
                let newCart = [...cart];
                let ambiguousItems = [];

                for (const aiItem of result.items) {
                    const itemName = aiItem.name || aiItem.item_name || aiItem.product_name || aiItem.item;
                    if (!aiItem || !itemName) continue; // Skip malformed items
                    
                    // Step 1: Try exact match first
                    const exactMatch = menu.find(i => i.product_name && i.product_name.toLowerCase() === itemName.toLowerCase());
                    
                    if (exactMatch) {
                        const qty = aiItem.quantity || aiItem.qty || 1;
                        const optData = await getItemOptions(exactMatch.id, userId);
                        if (optData) {
                            ambiguousItems.push({
                                is_option_selection: true,
                                item: exactMatch,
                                optData,
                                qty
                            });
                            continue;
                        }
                        const existing = newCart.find(c => c.name === exactMatch.product_name);
                        if (existing) existing.qty += qty;
                        else newCart.push({ id: exactMatch.id, name: exactMatch.product_name, qty, price: exactMatch.price });
                        addedSummary.push(`${qty}x *${exactMatch.product_name}*`);
                    } else {
                        // Step 2: Find ALL fuzzy matches (Check name, category, or sub-category)
                        const rawFuzzyMatches = menu.filter(i => 
                            i.product_name.toLowerCase().includes(itemName.toLowerCase()) ||
                            itemName.toLowerCase().includes(i.product_name.toLowerCase()) ||
                            (i.category && i.category.toLowerCase() === itemName.toLowerCase()) ||
                            (i.sub_category && i.sub_category.toLowerCase() === itemName.toLowerCase())
                        );
                        
                        // Deduplicate fuzzy matches by product_name
                        const seenFuzzy = new Set();
                        const fuzzyMatches = [];
                        for (const item of rawFuzzyMatches) {
                            const key = item.product_name.toLowerCase();
                            if (!seenFuzzy.has(key)) {
                                seenFuzzy.add(key);
                                fuzzyMatches.push(item);
                            }
                        }
                        
                        if (fuzzyMatches.length === 1) {
                            // Only one fuzzy match — safe to auto-select
                            const item = fuzzyMatches[0];
                            const qty = aiItem.quantity || aiItem.qty || 1;
                            const optData = await getItemOptions(item.id, userId);
                            if (optData) {
                                ambiguousItems.push({
                                    is_option_selection: true,
                                    item: item,
                                    optData,
                                    qty
                                });
                                continue;
                            }
                            const existing = newCart.find(c => c.name === item.product_name);
                            if (existing) existing.qty += qty;
                            else newCart.push({ id: item.id, name: item.product_name, qty, price: item.price });
                            addedSummary.push(`${qty}x *${item.product_name}*`);
                        } else if (fuzzyMatches.length > 1) {
                            // Multiple matches — ask user to clarify
                            ambiguousItems.push({ keyword: aiItem.name, qty: aiItem.quantity || aiItem.qty || 1, matches: fuzzyMatches });
                        }
                    }
                }

                // --- 🧩 DISAMBIGUATION: IF MULTIPLE MATCHES OR OPTION SELECTIONS FOUND ---
                if (ambiguousItems.length > 0) {
                    const amb = ambiguousItems[0];
                    session.context.cart = newCart;
                    session.context.pending_ambiguous = ambiguousItems.slice(1);
                    
                    if (amb.is_option_selection) {
                        const item = amb.item;
                        const optData = amb.optData;
                        const qty = amb.qty;
                        
                        let body = "";
                        if (addedSummary.length > 0) {
                            body += `✅ *Added to Bag:*\n${addedSummary.join('\n')}\n\n`;
                        }
                        body += `😋 *Choose size/option for ${item.product_name}:*\n━━━━━━━━━━━━━━\nPlease select one of the sizes below:`;
                        
                        await sendOptionsPicker(customerNumber, body, optData.options, userId, symbol, item.product_name);
                        
                        session.context.pending_option_selection = {
                            mainItem: { id: item.id, name: item.product_name },
                            options: optData.options,
                            qty: qty
                        };
                        await updateSession(userId, cleanNum, 'AWAITING_OPTION_SELECTION', session.context);
                        return;
                    } else {
                        // 🔥 SMART GROUPING: Group by base name (strip size words)
                        const groups = {};
                        amb.matches.forEach(m => {
                            const base = m.product_name.replace(/\s(Small|Medium|Large|Full|Half|Regular|Personal|Monster|1kg|500g|250g|Quarter|Single|Double|Triple|Family|Party|Mega|Mini|XL|XXL|Jumbo|King|Extra)\b/gi, '').trim();
                            if (!groups[base]) groups[base] = [];
                            groups[base].push(m);
                        });

                        const groupNames = Object.keys(groups);
                        if (groupNames.length > 1 && amb.matches.length > 3) {
                            // Show Flavor/Type List with multi-section support
                            const allGroupRows = await buildGroupRows(groupNames, groups, userId, symbol);
                            const gSections = [];
                            for (let i = 0; i < allGroupRows.length; i += 10) {
                                gSections.push({ title: gSections.length === 0 ? `🍕 ${amb.keyword} Varieties` : `More Varieties`, rows: allGroupRows.slice(i, i + 10) });
                            }
                            const body = `🍕 *Which type of ${amb.keyword} would you like?*\n━━━━━━━━━━━━━━\nWe found *${amb.matches.length}* items across *${groupNames.length}* varieties! 👇`;
                            await sendList(customerNumber, "Select Type", body, "✨ View All Types ✨", gSections.slice(0, 10), userId);
                            
                            session.context.pending_selection = { keyword: amb.keyword, qty: amb.qty, is_group: true, groups };
                            await updateSession(userId, cleanNum, 'IDLE', session.context);
                            return;
                        }

                        // Show ALL items directly using multi-section list
                        session.context.pending_selection = { keyword: amb.keyword, qty: amb.qty };
                        await updateSession(userId, cleanNum, 'IDLE', session.context);

                        const allRows = amb.matches.map(m => ({
                            id: m.product_name, 
                            title: m.product_name.substring(0, 24),
                            description: `${symbol}${m.price}`
                        }));
                        const sections = [];
                        for (let i = 0; i < allRows.length; i += 10) {
                            sections.push({ title: sections.length === 0 ? `🔍 ${amb.keyword} Items` : `More Items`, rows: allRows.slice(i, i + 10) });
                        }

                        let body = "";
                        if (addedSummary.length > 0) body += `✅ *Added to Bag:*\n${addedSummary.join('\n')}\n\n`;
                        const totalShown = sections.slice(0, 10).reduce((sum, s) => sum + s.rows.length, 0);
                        body += `🤔 *Which "${amb.keyword}" did you mean?*\n━━━━━━━━━━━━━━\nShowing *${totalShown}* matching items. Select from the list below. 👇`;
                        
                        await sendList(customerNumber, "Select Item", body, "✨ View Options ✨", sections.slice(0, 10), userId);
                        return;
                    }
                }

                if (addedSummary.length > 0) {
                    session.context.cart = newCart;
                    await updateSession(userId, cleanNum, 'IDLE', session.context);

                    const cartSummaryLines = newCart.map(item => `• ${item.qty}x *${item.name}*`).join('\n');
                    const cartTotal = newCart.reduce((sum, item) => sum + (item.qty * item.price), 0);
                    let responseText = `${result.human_reply}\n\n✅ *Current Bag:*\n${cartSummaryLines}\n\n💰 *Total: ${symbol}${cartTotal.toFixed(2)}*`;
                    
                    if (result.upsell_suggestion) responseText += `\n\n✨ *Chef's Recommendation:* \n${result.upsell_suggestion}`;

                    await sendButtons(customerNumber, responseText, [
                        { id: 'checkout', title: '🛒 Checkout Now' },
                        { id: 'place_order', title: '➕ Add More' }
                    ], userId);
                    return;
                }

                // If intent was ORDER_ITEM but we matched NOTHING
                if (result.items && result.items.length > 0) {
                    const fallback = `🤔 *I couldn't find those items in our menu.*\n━━━━━━━━━━━━━━\n${result.human_reply || "Please check the spelling or type 'view menu' to see what we have today! 📜"}`;
                    await sendOfficialMessage(customerNumber, fallback, userId);
                    return;
                }
            }

            // Fallback for ENQUIRY or GREETING (with non-empty cart) or UNKNOWN
            const finalReply = result.human_reply || "I'm here to help! What can I get for you today?";
            await sendOfficialMessage(customerNumber, finalReply, userId);
        }
    } catch (e) { 
        console.error("[TOP-LEVEL-AI-ERROR]", e); 
    }
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
                    const metaPhoneId = changes.value.metadata?.phone_number_id; 

                    console.log("\n--- ⚡ WHATSAPP WEBHOOK START ⚡ ---");
                    console.log(`⏰ Time: ${new Date().toISOString()}`);
                    console.log(`📱 From: ${fromNumber}`);
                    console.log(`🆔 Phone ID: ${metaPhoneId}`);
                    
                    // CRITICAL ERROR FALLBACK: Wrap everything in another try/catch to always reply
                    try {
                        const contactName = changes.value.contacts?.[0]?.profile?.name || "Customer";
                        console.log(`👤 Name: ${contactName}`);

                        if (!metaPhoneId) {
                            console.error("❌ CRITICAL: No metaPhoneId found in webhook payload!");
                            return;
                        }

                        const userRes = await pool.query(
                            `SELECT u.id 
                             FROM app_users u 
                             LEFT JOIN restaurants r ON r.user_id = u.id 
                             WHERE u.meta_phone_id = $1 
                             ORDER BY r.id IS NULL ASC, r.id ASC 
                             LIMIT 1`,
                            [metaPhoneId]
                        );

                        let userId = userRes.rows[0]?.id;

                        // Fallback: If exact meta_phone_id is not mapped, map to primary restaurant owner
                        if (!userId) {
                            console.warn(`⚠️ NO EXACT MATCH FOR metaPhoneId "${metaPhoneId}". Mapping to primary active restaurant account...`);
                            const fallbackRes = await pool.query(
                                `SELECT id FROM app_users WHERE meta_phone_id IS NOT NULL OR role IN ('user', 'brand_owner', 'master_admin') ORDER BY id ASC LIMIT 1`
                            );
                            userId = fallbackRes.rows[0]?.id;

                            if (userId && metaPhoneId) {
                                await pool.query("UPDATE app_users SET meta_phone_id = $1 WHERE id = $2 AND (meta_phone_id IS NULL OR meta_phone_id = '')", [metaPhoneId, userId]);
                                console.log(`✅ Auto-linked metaPhoneId "${metaPhoneId}" to User ID ${userId}`);
                            }
                        }

                        if (!userId) {
                            console.error(`❌ NO USER FOUND for PhoneID: ${metaPhoneId}`);
                            return;
                        }
                        console.log(`👤 Found UserID: ${userId} for this webhook.`);

                    // Trigger typing indicator immediately to simulate human-like behavior
                    if (message.id) {
                        await sendTypingIndicator(fromNumber, message.id, userId);
                    }

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

                            // 🔥 WEBHOOK TRIGGER
                            const bizRes = await pool.query("SELECT id, name, settings FROM restaurants WHERE user_id = $1", [userId]);
                            if (bizRes.rows.length > 0) {
                                triggerWebhook(bizRes.rows[0], 'message.incoming', { 
                                    customer: { name: contactName, phone: fromNumber }, 
                                    message: textBody || "Location Pin",
                                    is_location: isLocation,
                                    location: locationData
                                });
                            }

                            await processAiAutomations(userId, fromNumber, textBody, contactName, isLocation, locationData);
                        }

                    } catch (innerErr) {
                        console.error("CRITICAL PROCESSING ERROR:", innerErr);
                            if (metaPhoneId) {
                                const dbRes = await pool.query("SELECT id FROM app_users WHERE meta_phone_id = $1 LIMIT 1", [metaPhoneId]);
                                if (dbRes.rows[0]) {
                                    await sendOfficialMessage(fromNumber, "I'm sorry, I encountered a temporary error while processing your request. Please try again in a moment! 🍽️", dbRes.rows[0].id);
                                }
                            }
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
                AND (context->>'recovery_sent') IS NULL
                AND updated_at < NOW() - INTERVAL '30 minutes'
                AND updated_at > NOW() - INTERVAL '24 hours'
            `);
            
            for (const session of res.rows) {
                const ctx = typeof session.context === 'string' ? JSON.parse(session.context) : session.context;
                const cart = ctx.cart || [];
                if (cart.length > 0) {
                    console.log(`🛒 Sending recovery to ${session.customer_number}`);
                    const msg = `👋 *Still thinking about your order?*\n\nYour items are still waiting in your bag! 🛒\n\nWould you like to complete your order now? 🍽️`;
                    await sendButtons(session.customer_number, msg, [
                        { id: 'checkout', title: '🛒 Checkout Now' },
                        { id: 'place_order', title: '🛍️ Add More' }
                    ], session.user_id);
                    
                    await pool.query("UPDATE conversation_sessions SET context = jsonb_set(context, '{recovery_sent}', 'true') WHERE id = $1", [session.id]);
                }
            }
        } catch (e) { console.error("Cron Error:", e); }
    }, 15 * 60 * 1000); // Every 15 mins
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
            const due = await pool.query("SELECT * FROM scheduled_messages WHERE status = 'PENDING' AND scheduled_for <= NOW() LIMIT 10");
            for (const row of due.rows) {
                const sent = await sendOfficialMessage(row.customer_number, row.message, row.user_id);
                await pool.query("UPDATE scheduled_messages SET status = $1 WHERE id = $2", [sent.success ? 'SENT' : 'FAILED', row.id]);
            }
        } catch (e) { console.error("Auto Follow-up Engine Error:", e); }
    }, 60000);
};

const startWinBackCron = () => {
    console.log("⏰ 30-Day Inactive Customer Win-Back Cron Started");
    setInterval(async () => {
        try {
            const res = await pool.query(`
                SELECT c.id, c.user_id, c.phone_number, c.name, c.last_order_at, u.business_name
                FROM marketing_contacts c
                JOIN app_users u ON c.user_id = u.id
                WHERE c.is_blocked = false
                  AND (c.last_winback_sent_at IS NULL OR c.last_winback_sent_at < NOW() - INTERVAL '30 days')
                  AND (c.last_order_at < NOW() - INTERVAL '30 days' OR (c.last_order_at IS NULL AND c.created_at < NOW() - INTERVAL '14 days'))
                LIMIT 5
            `);

            for (const c of res.rows) {
                const nameStr = c.name ? ` ${c.name}` : '';
                const bizName = c.business_name || 'SaSLoop';
                const msg = `🎁 *We miss you at ${bizName}!*${nameStr} 👋\n━━━━━━━━━━━━━━\nIt's been a while since your last meal with us!\n\nHere is a special *15% OFF* voucher for your next order:\n🎟️ Use Code: *WELCOME15*\n\nTap *View Digital Menu* or reply to order now! 🍔 🥤`;
                
                await sendButtons(c.phone_number, msg, [
                    { id: 'view_menu', title: '📜 View Digital Menu' },
                    { id: 'place_order', title: '🛍️ Order Now' }
                ], c.user_id);

                await pool.query("UPDATE marketing_contacts SET last_winback_sent_at = NOW() WHERE id = $1", [c.id]);
            }
        } catch (e) { console.error("Win-Back Cron Error:", e.message); }
    }, 6 * 60 * 60 * 1000);
};

const startReservationReminderCron = () => {
    console.log("⏰ Reservation 1-Hour Advance Reminder Cron Started");
    setInterval(async () => {
        try {
            const res = await pool.query(`
                SELECT r.id, r.user_id, r.customer_name, r.customer_phone, r.customer_number, r.reservation_ref, r.reservation_date, r.reservation_time, r.guests_count, r.guests, u.business_name
                FROM table_reservations r
                JOIN app_users u ON r.user_id = u.id
                WHERE r.status IN ('CONFIRMED', 'PENDING')
                  AND (r.reminder_sent IS NULL OR r.reminder_sent = false)
                  AND (r.reservation_date = CURRENT_DATE OR r.reservation_date::text = CURRENT_DATE::text)
                  AND (r.created_at < NOW() - INTERVAL '5 minutes')
                LIMIT 5
            `);

            for (const r of res.rows) {
                const targetPhone = r.customer_phone || r.customer_number;
                if (!targetPhone) continue;

                const refStr = r.reservation_ref || `RES-${r.id}`;
                const guests = r.guests_count || r.guests || 2;
                const bizName = r.business_name || 'Restaurant';

                const reminderMsg = `⏰ *TABLE RESERVATION REMINDER*\n━━━━━━━━━━━━━━\nHi ${r.customer_name || 'Guest'}! Your table reservation at *${bizName}* is coming up today!\n\n📋 *Ref:* ${refStr}\n🕒 *Time:* ${r.reservation_time || 'Soon'}\n👥 *Guests:* ${guests} People\n\nWe look forward to hosting you! Tap below if you need directions or support. 🙏`;

                await sendButtons(targetPhone, reminderMsg, [
                    { id: 'support', title: '📞 Contact Outlet' },
                    { id: 'view_menu', title: '📜 View Menu' }
                ], r.user_id);

                await pool.query("UPDATE table_reservations SET reminder_sent = true WHERE id = $1", [r.id]);
            }
        } catch (e) { console.error("Reservation Reminder Cron Error:", e.message); }
    }, 15 * 60 * 1000);
};

const startBackupCron = () => {
    try {
        const cron = require("node-cron");
        const { exec } = require("child_process");
        cron.schedule('0 3 * * *', () => {
            const scriptPath = path.join(__dirname, "scripts", "auto_backup.js");
            exec(`node "${scriptPath}"`, (error, stdout) => {
                if (error) console.error(`❌ [CRON] Backup Error: ${error.message}`);
                else console.log(`✅ [CRON] Backup Output: ${stdout}`);
            });
        });
        console.log("⏰ Database Backup Cron Scheduled (Daily 3:00 AM)");
    } catch (e) { console.error("Backup Cron Init Error:", e.message); }
};

module.exports = {
    handleMetaWebhook,
    sendOfficialMessage,
    sendPdfDocument,
    sendButtons,
    sendList,
    getRecentChats,
    logChat,
    notifyKitchenAndStaff,
    syncBusinessProfileToWhatsApp,
    processAiAutomations,
    startCartRecoveryCron,
    startAutoFollowupCron,
    startBackupCron,
    startWinBackCron,
    startReservationReminderCron,
    getWalletCredits,
    deductWalletCredits
};
