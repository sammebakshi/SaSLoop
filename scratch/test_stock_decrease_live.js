const pool = require("../db");
const axios = require("axios");

// Intercept Outbound Meta Graph requests
const originalPost = axios.post;
axios.post = async function(url, data, config) {
    if (url.includes("graph.facebook.com") && url.includes("messages")) {
        return { data: { success: true } };
    }
    return originalPost.apply(this, arguments);
};

const whatsappManager = require("../whatsappManager");

const userId = 48;
const testPhone = "+919999999999";
const cleanNum = testPhone;

function makeTextWebhookPayload(text, messageId = "msg_123") {
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
                                    profile: { name: "Test Stock User" },
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

function makeButtonWebhookPayload(buttonId, messageId = "msg_123") {
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
                                    profile: { name: "Test Stock User" },
                                    wa_id: "919999999999"
                                }
                            ],
                            messages: [
                                {
                                    from: "919999999999",
                                    id: messageId,
                                    timestamp: Math.floor(Date.now() / 1000),
                                    type: "interactive",
                                    interactive: {
                                        type: "button_reply",
                                        button_reply: {
                                            id: buttonId,
                                            title: buttonId
                                        }
                                    }
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

function makeListWebhookPayload(rowId, messageId = "msg_123") {
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
                                    profile: { name: "Test Stock User" },
                                    wa_id: "919999999999"
                                }
                            ],
                            messages: [
                                {
                                    from: "919999999999",
                                    id: messageId,
                                    timestamp: Math.floor(Date.now() / 1000),
                                    type: "interactive",
                                    interactive: {
                                        type: "list_reply",
                                        list_reply: {
                                            id: rowId,
                                            title: rowId
                                        }
                                    }
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

async function run() {
    try {
        console.log("🛠️ Setting starting stock to 10 and availability to true for items...");
        // Set stock in business_items for KABAB (id 473)
        await pool.query("UPDATE business_items SET stock_count = 10, availability = true WHERE id = 473");
        // Set stock in outlet_menu_items for KABAB options (5419, 5420)
        await pool.query("UPDATE outlet_menu_items SET stock_qty = 10.000 WHERE id IN (5419, 5420)");

        console.log("🧹 Cleaning up existing session...");
        await pool.query("DELETE FROM conversation_sessions WHERE user_id = $1 AND customer_number = $2", [userId, cleanNum]);
        await pool.query("DELETE FROM chat_messages WHERE user_id = $1 AND customer_number = $2", [userId, cleanNum]);

        console.log("\n--- Checking Initial Stock ---");
        const initBI = await pool.query("SELECT id, product_name, stock_count FROM business_items WHERE id = 473");
        const initOMI = await pool.query("SELECT id, item_name, stock_qty FROM outlet_menu_items WHERE id IN (5419, 5420)");
        console.log("Initial business_items stock (id 473):", initBI.rows[0]);
        console.log("Initial outlet_menu_items stock:", initOMI.rows);

        // Run checkout simulation
        console.log("\n🛒 Simulating ordering HALF & FULL Kabab...");
        // 1. Send "kabab" to trigger search
        await whatsappManager.handleMetaWebhook(makeTextWebhookPayload("kabab", "msg_1"));
        // 2. Select "KABAB" from options list
        await whatsappManager.handleMetaWebhook(makeListWebhookPayload("KABAB", "msg_2"));
        // 3. Choose HALF
        await whatsappManager.handleMetaWebhook(makeButtonWebhookPayload("opt_5419", "msg_3"));
        // 4. Order another kabab
        await whatsappManager.handleMetaWebhook(makeTextWebhookPayload("I want to order 1 kabab", "msg_4"));
        // 5. Choose FULL
        await whatsappManager.handleMetaWebhook(makeButtonWebhookPayload("opt_5420", "msg_5"));
        // 6. Checkout
        await whatsappManager.handleMetaWebhook(makeButtonWebhookPayload("checkout", "msg_6"));
        // 7. Select pickup mode (triggers deductInventory)
        await whatsappManager.handleMetaWebhook(makeButtonWebhookPayload("mode_pickup", "msg_7"));

        console.log("\n--- Checking Final Stock ---");
        const finalBI = await pool.query("SELECT id, product_name, stock_count FROM business_items WHERE id = 473");
        const finalOMI = await pool.query("SELECT id, item_name, stock_qty FROM outlet_menu_items WHERE id IN (5419, 5420)");
        console.log("Final business_items stock (id 473):", finalBI.rows[0]);
        console.log("Final outlet_menu_items stock:", finalOMI.rows);

        const okBI = finalBI.rows[0].stock_count < 10;
        const okOMI = finalOMI.rows.every(r => parseFloat(r.stock_qty) < 10);
        if (okBI && okOMI) {
            console.log("\n✅ SUCCESS: Stock was successfully decremented for both master catalog and outlet menu items!");
        } else {
            console.log("\n❌ FAILURE: Stock did not decrement as expected.");
        }

    } catch (e) {
        console.error("Test execution failed:", e);
    } finally {
        await pool.end();
    }
}

run();
