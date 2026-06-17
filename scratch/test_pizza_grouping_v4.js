const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});
const axios = require("axios");

// Monkey-patch axios.post to intercept Graph API requests
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
        }
        return { data: { success: true } };
    }
    return originalPost.apply(this, arguments);
};

const whatsappManager = require("../whatsappManager");

const userId = 48; // Shahe Tehzeeb Restaurant
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
                                    profile: { name: "Test Pizza User" },
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
    const mockItemNames = [
        "CHEESE PIZZA SMALL", "CHEESE PIZZA MEDIUM", "CHEESE PIZZA LARGE",
        "VEG PIZZA SMALL", "VEG PIZZA MEDIUM", "VEG PIZZA LARGE",
        "MUSHROOM PIZZA SMALL", "MUSHROOM PIZZA MEDIUM", "MUSHROOM PIZZA LARGE",
        "ONION PIZZA SMALL", "ONION PIZZA MEDIUM", "ONION PIZZA LARGE"
    ];

    try {
        console.log("Mocking pizza sizes for user 48...");
        for (const name of mockItemNames) {
            await pool.query(
                `INSERT INTO outlet_menu_items (menu_id, item_name, base_price, is_active, item_type)
                 VALUES (33, $1, 200.00, true, '0')`,
                [name]
            );
        }

        console.log("Cleaning existing sessions...");
        await pool.query(
            "DELETE FROM conversation_sessions WHERE user_id = $1 AND customer_number = $2",
            [userId, cleanNum]
        );

        console.log("\n=== STEP 1: Sending 'pizza' (Should trigger smart grouping) ===");
        await whatsappManager.handleMetaWebhook(makeWebhookPayload("pizza", "pizza_msg_1"));
        let sess = await getSessionState();
        console.log("Session State after Step 1:", JSON.stringify(sess, null, 2));

        console.log("\n=== STEP 2: Selecting 'group_CHEESE PIZZA' (Should trigger sizes list) ===");
        await whatsappManager.handleMetaWebhook(makeWebhookPayload("group_CHEESE PIZZA", "pizza_msg_2"));
        sess = await getSessionState();
        console.log("Session State after Step 2:", JSON.stringify(sess, null, 2));

    } catch (e) {
        console.error("Test failed:", e);
    } finally {
        console.log("\nCleaning up mock pizza sizes...");
        await pool.query(
            "DELETE FROM outlet_menu_items WHERE menu_id = 33 AND item_name = ANY($1)",
            [mockItemNames]
        );
        await pool.end();
        console.log("Cleanup complete.");
    }
}

runTest();
