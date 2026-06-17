const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});
const axios = require("axios");

// Intercept Meta Graph API requests
const originalPost = axios.post;
axios.post = async function(url, data, config) {
    if (url.includes("graph.facebook.com") && url.includes("messages")) {
        console.log(`\n📤 [MOCK OUTBOUND WHATSAPP] to: ${data.to}`);
        if (data.typing_indicator) {
            console.log(`  Typing Indicator Status: ${data.status} for Message ID: ${data.message_id}`);
        } else if (data.type === "interactive") {
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
    return originalPost.apply(this, arguments);
};

const whatsappManager = require("../whatsappManager");
const userId = 48;
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
                            contacts: [{ profile: { name: "Test Option User" }, wa_id: "919999999999" }],
                            messages: [{
                                from: "919999999999",
                                id: messageId,
                                timestamp: Math.floor(Date.now() / 1000),
                                text: { body: text },
                                type: "text"
                            }]
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
        await pool.query("DELETE FROM conversation_sessions WHERE user_id = $1 AND customer_number = $2", [userId, cleanNum]);

        // Test 1: Sending "cheese pizza" directly (exact match, should show options SMALL, MEDIUM, LARGE)
        console.log("\n=== TEST 1: Sending 'cheese pizza' ===");
        await whatsappManager.handleMetaWebhook(makeWebhookPayload("cheese pizza", "pizza_1"));
        let sess = await getSessionState();
        console.log("Session State after Test 1:", JSON.stringify(sess, null, 2));

        // Reset session
        await pool.query("DELETE FROM conversation_sessions WHERE user_id = $1 AND customer_number = $2", [userId, cleanNum]);

        // Test 2: Sending "kabab pizza" directly (exact match, should show options SMALL, MEDIUM, LARGE)
        console.log("\n=== TEST 2: Sending 'kabab pizza' ===");
        await whatsappManager.handleMetaWebhook(makeWebhookPayload("kabab pizza", "pizza_2"));
        sess = await getSessionState();
        console.log("Session State after Test 2:", JSON.stringify(sess, null, 2));

        // Reset session
        await pool.query("DELETE FROM conversation_sessions WHERE user_id = $1 AND customer_number = $2", [userId, cleanNum]);

        // Test 3: Sending "pizza" (ambiguous, should show list of pizza flavors)
        console.log("\n=== TEST 3: Sending 'pizza' ===");
        await whatsappManager.handleMetaWebhook(makeWebhookPayload("pizza", "pizza_3"));
        sess = await getSessionState();
        console.log("Session State after Test 3:", JSON.stringify(sess, null, 2));

        // Test 4: Selecting "CHEESE PIZZA" from list (exact match, should transition to options selection)
        console.log("\n=== TEST 4: Sending 'CHEESE PIZZA' (selecting flavor) ===");
        await whatsappManager.handleMetaWebhook(makeWebhookPayload("CHEESE PIZZA", "pizza_4"));
        sess = await getSessionState();
        console.log("Session State after Test 4:", JSON.stringify(sess, null, 2));

        // Test 5: Selecting "MEDIUM" size (id = 5781)
        console.log("\n=== TEST 5: Selecting MEDIUM option (opt_5781) ===");
        await whatsappManager.handleMetaWebhook(makeWebhookPayload("opt_5781", "pizza_5"));
        sess = await getSessionState();
        console.log("Session State after Test 5:", JSON.stringify(sess, null, 2));

    } catch (e) {
        console.error("Test failed:", e);
    } finally {
        await pool.end();
    }
}

runTest();
