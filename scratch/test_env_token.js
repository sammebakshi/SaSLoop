require('dotenv').config();
const axios = require('axios');

async function test() {
    const token = process.env.META_ACCESS_TOKEN;
    const phoneId = process.env.META_PHONE_ID;
    console.log("Testing phoneId:", phoneId);
    console.log("Token start:", token ? token.substring(0, 30) : "NONE");

    try {
        const res = await axios.post(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: "+917006089744",
            type: "text",
            text: { body: "Test OTP from SaSLoop System Token" }
        }, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        console.log("SUCCESS:", res.data);
    } catch(err) {
        console.error("FAILED:", err.response ? err.response.data : err.message);
    }
    process.exit(0);
}
test();
