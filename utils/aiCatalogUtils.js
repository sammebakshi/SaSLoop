const axios = require('axios');
const fs = require('fs');

/**
 * Uses Gemini Vision to parse a menu image into a structured JSON.
 * @param {string} imagePath - Path to the uploaded menu image.
 */
async function scanMenuWithAI(imagePath) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("Gemini API Key missing");

        const imageData = fs.readFileSync(imagePath).toString('base64');

        const prompt = `
            Analyze this menu image and extract all food/drink items. 
            Return ONLY a valid JSON array of objects. 
            Each object MUST have:
            - "product_name": string (Title of the dish)
            - "price": number (Numeric value only)
            - "category": string (e.g. Beverages, Main Course, Starters)
            - "description": string (Short description if available)
            - "is_veg": boolean (true if vegetarian, else false)
            
            Do not include any other text, just the JSON array.
        `;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                contents: [{
                    parts: [
                        { text: prompt },
                        { inline_data: { mime_type: "image/jpeg", data: imageData } }
                    ]
                }]
            },
            { headers: { 'Content-Type': 'application/json' } }
        );

        const text = response.data.candidates[0].content.parts[0].text;
        // Clean the response from markdown if present
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        const jsonStr = jsonMatch ? jsonMatch[0] : text;
        
        return JSON.parse(jsonStr);
    } catch (err) {
        console.error("AI Menu Scan Error:", err.message);
        throw err;
    }
}

module.exports = { scanMenuWithAI };
