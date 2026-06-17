const axios = require('axios');

async function testPost() {
  try {
    const res = await axios.post('https://comply-lagged-concave.ngrok-free.dev/api/whatsapp/webhook', {
      object: "whatsapp_business_account",
      entry: [
        {
          id: "1116613731527246",
          changes: [
            {
              value: {
                messaging_product: "whatsapp",
                metadata: {
                  display_phone_number: "919906123989",
                  phone_number_id: "1081456295056156"
                },
                contacts: [
                  {
                    profile: {
                      name: "Sajad Bakshi"
                    },
                    wa_id: "917006089744"
                  }
                ],
                messages: [
                  {
                    from: "917006089744",
                    id: "wamid.TestPostMockMessage" + Date.now(),
                    timestamp: Math.floor(Date.now() / 1000).toString(),
                    text: {
                      body: "kabab"
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
    });
    console.log('Public POST status:', res.status);
    console.log('Public POST body:', res.data);
  } catch (err) {
    console.error('Public POST failed:', err.message);
    if (err.response) {
      console.log('Response body:', err.response.data);
    }
  }
}

testPost();
