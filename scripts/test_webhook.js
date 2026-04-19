const axios = require('axios');

const payload = {
  object: "whatsapp_business_account",
  entry: [{
    id: "WHATEVER",
    changes: [{
      value: {
        messaging_product: "whatsapp",
        metadata: {
          display_phone_number: "1234567890",
          phone_number_id: "mock_phone_id"
        },
        contacts: [{
            profile: { name: "Test User" },
            wa_id: "1234567"
        }],
        messages: [{
          from: "1234567",
          id: "wamid.XYZ",
          timestamp: "123456789",
          text: {
            body: "hi"
          },
          type: "text"
        }]
      },
      field: "messages"
    }]
  }]
};

axios.post('http://localhost:5000/api/whatsapp/webhook', payload)
  .then(res => console.log('Mock webhook sent! Status:', res.status))
  .catch(err => console.error('Error:', err.message));
