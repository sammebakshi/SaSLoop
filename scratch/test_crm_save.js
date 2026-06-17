const whatsappManager = require("../whatsappManager");
const pool = require("../db");

// Mock sending functions to avoid calling external APIs
whatsappManager.sendOfficialMessage = async (to, content, userId) => {
    console.log(`[MOCK SEND] To: ${to} | Content:`, content);
    return { success: true };
};

async function testCrmSave() {
    // Generate a random 10 digit number to ensure it's a "new" number
    const randomNum = "91" + Math.floor(1000000000 + Math.random() * 9000000000);
    const customerName = "Test CRM Customer " + Date.now();
    console.log(`Testing with new phone number: ${randomNum}, Name: ${customerName}`);

    const payload = {
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
                                    profile: {
                                        name: customerName
                                    },
                                    wa_id: randomNum
                                }
                            ],
                            messages: [
                                {
                                    from: randomNum,
                                    id: "wamid.test_" + Date.now(),
                                    timestamp: Math.floor(Date.now() / 1000),
                                    text: {
                                        body: "Hi"
                                    },
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

    try {
        console.log("Calling handleMetaWebhook...");
        await whatsappManager.handleMetaWebhook(payload);
        
        // Wait a second for async processing to finish if any
        await new Promise(r => setTimeout(r, 1000));

        console.log("\nChecking database for the new contact...");
        const cleanPhone = "+" + randomNum;
        
        const mcRes = await pool.query(
            "SELECT * FROM marketing_contacts WHERE phone_number = $1", 
            [cleanPhone]
        );
        console.log("marketing_contacts rows count:", mcRes.rows.length);
        if (mcRes.rows.length > 0) {
            console.log("marketing_contacts row:", mcRes.rows[0]);
        } else {
            console.log("❌ marketing_contacts row NOT FOUND!");
        }

        const custRes = await pool.query(
            "SELECT * FROM customers WHERE number = $1", 
            [cleanPhone]
        );
        console.log("customers rows count:", custRes.rows.length);
        if (custRes.rows.length > 0) {
            console.log("customers row:", custRes.rows[0]);
        } else {
            console.log("❌ customers row NOT FOUND!");
        }

    } catch (err) {
        console.error("Test execution failed:", err);
    } finally {
        await pool.end();
    }
}

testCrmSave();
