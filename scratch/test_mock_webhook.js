const axios = require('axios');

async function sendMockWebhook() {
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
                    name: "Sajad Test"
                  },
                  wa_id: "919469697216"
                }
              ],
              messages: [
                {
                  from: "919469697216",
                  id: "wamid.HBgLOTE5NDY5Njk3MjE2FQIAERgSQjE4QTkyNjdDREQxRkFFQjE1AA==",
                  timestamp: Math.floor(Date.now() / 1000),
                  text: {
                    body: "Hello"
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
    const res = await axios.post('http://127.0.0.1:5000/api/whatsapp/webhook', payload);
    console.log('Webhook test post status:', res.status);
    console.log('Webhook test post response:', res.data);
  } catch (err) {
    console.error('Webhook mock failed:', err.message);
  }
}

sendMockWebhook();
