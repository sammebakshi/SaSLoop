const axios = require('axios');

async function testWebhook() {
    try {
        console.log("🚀 Sending mock Meta WhatsApp Webhook payload to production...");
        const payload = {
            object: "whatsapp_business_account",
            entry: [
                {
                    id: "WHATSAPP_BUSINESS_ACCOUNT_ID",
                    changes: [
                        {
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "15550257002",
                                    phone_number_id: "105557778899"
                                },
                                contacts: [
                                    {
                                        profile: { name: "Test User" },
                                        wa_id: "919876543210"
                                    }
                                ],
                                messages: [
                                    {
                                        from: "919876543210",
                                        id: "wamid.HBgMOTE5ODc2NTQzMjEwFQIAERgSQTExMjIzM0Q0NUU2Nzg5QUFBAA==",
                                        timestamp: Math.floor(Date.now() / 1000),
                                        text: { body: "Hi" },
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

        const res = await axios.post('https://backend.sasloop.in/api/whatsapp/webhook', payload);
        console.log("✅ Production Webhook Response Status:", res.status, res.data);
    } catch (e) {
        console.error("❌ Webhook Error:", e.response?.data || e.message);
    }
}

testWebhook();
