const axios = require("axios");

async function registerTemplate() {
  const token = 'EAF38a6uQtH0BRPQkE0FggXUWFrW3MBSqUlEsg5DOIafmwWv6rO0TNXrtDszdxgf2XZAIX9US0KZAIvTaNVzDHX7hCVLLZBtKSMT22WVpeeW4PazFI4wjDqZCT4RxOCtd2GrVqIIv9N3ZCLDYAntaZC3FTRgoPVHI8ZA2kLatWPtO4bdD8zw06h5WHel3Q0RQky0owZDZD';
  const wabaId = '1116613731527246';

  const tplData = {
    name: "wazwan_offer",
    category: "MARKETING",
    language: "en",
    headerType: "NONE",
    headerText: null,
    bodyText: "Get Flat 10 % off on wazwan orders above 1000",
    footerText: null,
    buttons: []
  };

  try {
    const components = [
      {
        type: "BODY",
        text: tplData.bodyText
      }
    ];

    const payload = {
      name: tplData.name,
      category: tplData.category,
      language: tplData.language,
      components: components
    };

    console.log(`Submitting to Meta WABA ${wabaId}...`);
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${wabaId}/message_templates`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("✅ Success! Registered template with Meta:", response.data);
  } catch (err) {
    console.error("❌ Failed to register template:", err.response?.data?.error?.message || err.message);
  }
}

registerTemplate();
