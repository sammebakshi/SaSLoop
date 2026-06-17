const axios = require("axios");

async function checkPizzaOffer() {
  const token = 'EAF38a6uQtH0BRPQkE0FggXUWFrW3MBSqUlEsg5DOIafmwWv6rO0TNXrtDszdxgf2XZAIX9US0KZAIvTaNVzDHX7hCVLLZBtKSMT22WVpeeW4PazFI4wjDqZCT4RxOCtd2GrVqIIv9N3ZCLDYAntaZC3FTRgoPVHI8ZA2kLatWPtO4bdD8zw06h5WHel3Q0RQky0owZDZD';
  const wabaId = '1116613731527246';

  try {
    const url = `https://graph.facebook.com/v22.0/${wabaId}/message_templates?name=pizza_offer`;
    const r = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Meta pizza_offer template:", JSON.stringify(r.data, null, 2));
  } catch (err) {
    console.error("❌ Failed:", err.message);
  }
}

checkPizzaOffer();
