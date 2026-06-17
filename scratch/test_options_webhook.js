const pool = require("../db");
const axios = require("axios");

// 1. Monkey-patch axios.post to intercept Meta Graph API requests
const originalPost = axios.post;
axios.post = async function(url, data, config) {
    if (url.includes("graph.facebook.com") && url.includes("messages")) {
        console.log(`\n📤 [MOCK OUTBOUND WHATSAPP] to: ${data.to}`);
        if (data.type === "interactive") {
            const i = data.interactive;
            console.log(`  Type: ${i.type}`);
            if (i.body) console.log(`  Body: ${i.body.text}`);
            if (i.action && i.action.buttons) {
                console.log(`  Buttons:`, i.action.buttons.map(b => `${b.reply.title} (ID: ${b.reply.id})`));
            }
            if (i.action && i.action.sections) {
                console.log(`  List Button: ${i.action.button}`);
                i.action.sections.forEach(s => {
                    console.log(`  Section: ${s.title}`);
                    s.rows.forEach(r => console.log(`    - ${r.title} (ID: ${r.id}) [${r.description}]`));
                });
            }
        } else if (data.type === "text") {
            console.log(`  Body: ${data.text.body}`);
        } else {
            console.log(`  Payload:`, JSON.stringify(data));
        }
        return { data: { success: true } };
    }
    // Let other requests (like Groq or Gemini API) go through normally
    return originalPost.apply(this, arguments);
};

const whatsappManager = require("../whatsappManager");

// Test configuration
const userId = 48; // Shahe Tehzeeb Restaurant user
const testPhone = "+919999999999";
const cleanNum = testPhone;

function makeWebhookPayload(text, messageId = "msg_123") {
    return {
        object: "whatsapp_business_account",
        entry: [
            {
                id: "1081456295056156",
                changes: [
                    {
                        value: {
                            messaging_product: "whatsapp",
                            metadata: {
                                display_phone_number: "919469697216",
                                phone_number_id: "1081456295056156"
                            },
                            contacts: [
                                {
                                    profile: { name: "Test Option User" },
                                    wa_id: "919999999999"
                                }
                            ],
                            messages: [
                                {
                                    from: "919999999999",
                                    id: messageId,
                                    timestamp: Math.floor(Date.now() / 1000),
                                    text: { body: text },
                                    type: "text"
                                }
                            ]
                        },
                        field: "messages"
                    }
                ]
            }
        ]
    };
}

async function getSessionState() {
    const res = await pool.query(
        "SELECT state, context FROM conversation_sessions WHERE user_id = $1 AND customer_number = $2",
        [userId, cleanNum]
    );
    if (res.rows.length === 0) return null;
    const sess = res.rows[0];
    return {
        state: sess.state,
        context: typeof sess.context === 'string' ? JSON.parse(sess.context) : sess.context
    };
}

async function runTest() {
    try {
        console.log("🧹 Cleaning up existing session for test phone...");
        await pool.query(
            "DELETE FROM conversation_sessions WHERE user_id = $1 AND customer_number = $2",
            [userId, cleanNum]
        );
        await pool.query(
            "DELETE FROM chat_messages WHERE user_id = $1 AND customer_number = $2",
            [userId, cleanNum]
        );

        // --- STEP 1: Send "kabab" (Ambiguous matches) ---
        console.log("\n=== STEP 1: Sending 'kabab' ===");
        await whatsappManager.handleMetaWebhook(makeWebhookPayload("kabab", "msg_1"));
        let sess = await getSessionState();
        console.log("Session State after Step 1:", JSON.stringify(sess, null, 2));

        // --- STEP 2: Select "KABAB" from list (exact main item match with options) ---
        console.log("\n=== STEP 2: Selecting 'KABAB' from list ===");
        await whatsappManager.handleMetaWebhook(makeWebhookPayload("KABAB", "msg_2"));
        sess = await getSessionState();
        console.log("Session State after Step 2:", JSON.stringify(sess, null, 2));

        // --- STEP 3: Select "opt_5419" (HALF option selection) ---
        console.log("\n=== STEP 3: Selecting HALF option ===");
        await whatsappManager.handleMetaWebhook(makeWebhookPayload("opt_5419", "msg_3"));
        sess = await getSessionState();
        console.log("Session State after Step 3:", JSON.stringify(sess, null, 2));

        // --- STEP 4: Send exact order statement containing "kabab" via AI salesman ---
        console.log("\n=== STEP 4: Sending 'I want to order 1 kabab' (AI Salesman) ===");
        await whatsappManager.handleMetaWebhook(makeWebhookPayload("I want to order 1 kabab", "msg_4"));
        sess = await getSessionState();
        console.log("Session State after Step 4:", JSON.stringify(sess, null, 2));

        // --- STEP 5: Select FULL option from AI salesman flow ---
        console.log("\n=== STEP 5: Selecting FULL option ===");
        await whatsappManager.handleMetaWebhook(makeWebhookPayload("opt_5420", "msg_5"));
        sess = await getSessionState();
        console.log("Session State after Step 5:", JSON.stringify(sess, null, 2));

        // --- STEP 6: Complete checkout (Pickup) to test stock deduction ---
        console.log("\n=== STEP 6: Initiating Checkout ===");
        await whatsappManager.handleMetaWebhook(makeWebhookPayload("checkout", "msg_6"));
        sess = await getSessionState();
        console.log("Session State after checkout initiate:", JSON.stringify(sess, null, 2));

        // Let's check stock before checkout
        const omiBefore = await pool.query(
            "SELECT id, item_name, stock_qty FROM outlet_menu_items WHERE id IN (5419, 5420)"
        );
        console.log("\nStock qty before checkout confirmation:", omiBefore.rows);

        console.log("\n=== STEP 7: Completing Checkout (Pickup) ===");
        await whatsappManager.handleMetaWebhook(makeWebhookPayload("mode_pickup", "msg_7"));
        sess = await getSessionState();
        console.log("Session State after checkout completion:", JSON.stringify(sess, null, 2));

        // Let's check stock after checkout
        const omiAfter = await pool.query(
            "SELECT id, item_name, stock_qty FROM outlet_menu_items WHERE id IN (5419, 5420)"
        );
        console.log("Stock qty after checkout confirmation:", omiAfter.rows);

    } catch (e) {
        console.error("Test execution failed:", e);
    } finally {
        await pool.end();
    }
}

runTest();
