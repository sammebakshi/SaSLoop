require('dotenv').config();
const { sendOfficialMessage } = require('./whatsappManager');

async function testOtp() {
    const phone = "+917006089744";
    const otp = "8899";
    const msg = `🔐 *Your OTP for Online Menu Login*\n\n*${otp}*\n\nThis code expires in 5 minutes. Do not share it with anyone.\n\n— SaSLoop Ordering`;
    
    console.log("Sending test OTP for user 1...");
    const res1 = await sendOfficialMessage(phone, msg, 1);
    console.log("Result for User 1:", JSON.stringify(res1));

    console.log("Sending test OTP for user 2...");
    const res2 = await sendOfficialMessage(phone, msg, 2);
    console.log("Result for User 2:", JSON.stringify(res2));

    process.exit(0);
}
testOtp();
