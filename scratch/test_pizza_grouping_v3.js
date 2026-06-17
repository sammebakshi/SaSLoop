const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});
const axios = require("axios");

// Monkey-patch axios.post
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

const userId = 8; 
const mockPhoneId = "999888777";
const testPhone = "+919999999999";
const cleanNum = testPhone;

function makeWebhookPayload(text, messageId = "msg_123") {
    return {
        object: "whatsapp_business_account",
        entry: [
            {
                id: mockPhoneId,
                changes: [
                    {
                        value: {
                            messaging_product: "whatsapp",
                            metadata: {
                                display_phone_number: "919469697216",
                                phone_number_id: mockPhoneId
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
    let originalUser = null;
    let originalRestaurant = null;
    let originalMenus = [];

    try {
        console.log("Saving original state...");
        const userRes = await pool.query("SELECT meta_phone_id, meta_access_token FROM app_users WHERE id = $1", [userId]);
        originalUser = userRes.rows[0];

        const restRes = await pool.query("SELECT settings FROM restaurants WHERE user_id = $1", [userId]);
        originalRestaurant = restRes.rows[0];

        const menusRes = await pool.query("SELECT id, is_digital_default FROM outlet_menus WHERE user_id = $1", [userId]);
        originalMenus = menusRes.rows;

        console.log("Mocking database state for testing...");
        // Set mock credentials so sendOfficialMessage doesn't exit early
        await pool.query(
            "UPDATE app_users SET meta_phone_id = $1, meta_access_token = 'mock_token' WHERE id = $2",
            [mockPhoneId, userId]
        );

        // Make restaurant open 24/7
        const openSettings = {
            working_hours: [
                { day: "Monday", open: "00:00", close: "23:59" },
                { day: "Tuesday", open: "00:00", close: "23:59" },
                { day: "Wednesday", open: "00:00", close: "23:59" },
                { day: "Thursday", open: "00:00", close: "23:59" },
                { day: "Friday", open: "00:00", close: "23:59" },
                { day: "Saturday", open: "00:00", close: "23:59" },
                { day: "Sunday", open: "00:00", close: "23:59" }
            ]
        };
        await pool.query("UPDATE restaurants SET settings = $1 WHERE user_id = $2", [JSON.stringify(openSettings), userId]);

        // Make menu 31 digital default and others false
        await pool.query("UPDATE outlet_menus SET is_digital_default = false WHERE user_id = $1", [userId]);
        await pool.query("UPDATE outlet_menus SET is_digital_default = true WHERE id = 31");

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
        console.log("\nRestoring original database state...");
        if (originalUser) {
            await pool.query(
                "UPDATE app_users SET meta_phone_id = $1, meta_access_token = $2 WHERE id = $3",
                [originalUser.meta_phone_id, originalUser.meta_access_token, userId]
            );
        }
        if (originalRestaurant) {
            await pool.query(
                "UPDATE restaurants SET settings = $1 WHERE user_id = $2",
                [originalRestaurant.settings, userId]
            );
        }
        for (const menu of originalMenus) {
            await pool.query(
                "UPDATE outlet_menus SET is_digital_default = $1 WHERE id = $2",
                [menu.is_digital_default, menu.id]
            );
        }
        await pool.end();
        console.log("Database state restored.");
    }
}

runTest();
