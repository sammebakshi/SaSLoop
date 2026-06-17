const Groq = require("groq-sdk");
require("dotenv").config();

async function test() {
    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: "Say Hello" }],
            model: "llama-3.1-8b-instant",
        });
        console.log("Groq output:", chatCompletion.choices[0]?.message?.content);
    } catch (e) {
        console.error("Groq Error:", e.message);
    }
}

test();
