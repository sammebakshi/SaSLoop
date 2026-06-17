const axios = require("axios");

async function checkPhoneFields() {
  const token = 'EAF38a6uQtH0BRPQkE0FggXUWFrW3MBSqUlEsg5DOIafmwWv6rO0TNXrtDszdxgf2XZAIX9US0KZAIvTaNVzDHX7hCVLLZBtKSMT22WVpeeW4PazFI4wjDqZCT4RxOCtd2GrVqIIv9N3ZCLDYAntaZC3FTRgoPVHI8ZA2kLatWPtO4bdD8zw06h5WHel3Q0RQky0owZDZD';
  const phoneId = '1081456295056156';

  const fields = [
    'whatsapp_business_account',
    'whatsapp_business_account_id',
    'business',
    'business_account',
    'parent',
    'owner',
    'account_id'
  ];

  for (const field of fields) {
    try {
      const url = `https://graph.facebook.com/v22.0/${phoneId}?fields=${field}`;
      const r = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`✅ field "${field}":`, JSON.stringify(r.data, null, 2));
    } catch (err) {
      console.log(`❌ field "${field}":`, err.response?.data?.error?.message || err.message);
    }
  }

  // Also query without specifying a field to see default fields
  try {
    const url = `https://graph.facebook.com/v22.0/${phoneId}`;
    const r = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Default fields:`, JSON.stringify(r.data, null, 2));
  } catch (err) {
    console.log(`❌ Default fields:`, err.message);
  }
}

checkPhoneFields();
