const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});
const Groq = require('groq-sdk');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
  try {
    const userId = 48;
    const msgText = "Rista 4,Kabab 2,Goshtaba 3";
    const lower = msgText.trim().toLowerCase();

    // Fetch biz data
    const bizRes = await pool.query(
        `SELECT r.*, u.bot_knowledge 
         FROM restaurants r 
         JOIN app_users u ON r.user_id = u.id 
         WHERE r.user_id = $1`, 
        [userId]
    );
    const biz = bizRes.rows[0];
    const symbol = biz.currency_code === 'INR' ? '₹' : '$';

    // Fetch default digital menu items
    const menuRes = await pool.query(
        `SELECT id FROM outlet_menus 
         WHERE (outlet_id = $1 OR user_id = $1) AND is_digital_default = true LIMIT 1`,
        [userId]
    );
    const menuId = menuRes.rows[0].id;
    
    const itemsRes = await pool.query(
        `SELECT omi.id, 
                omi.item_name AS product_name, 
                omi.base_price AS price, 
                omi.is_active AS availability, 
                omi.stock_qty AS stock_count,
                COALESCE(c.name, 'General') as category
         FROM outlet_menu_items omi
         LEFT JOIN categories c ON omi.category_id = c.id
         WHERE omi.menu_id = $1 AND omi.item_type = '0' AND omi.is_active = true
           AND (c.id IS NULL OR c.is_active = true)
           AND omi.item_name NOT IN (SELECT name FROM options_list)
         ORDER BY omi.id ASC`,
        [menuId]
    );
    const allItems = itemsRes.rows.map(item => ({
        id: item.id,
        product_name: item.product_name,
        price: parseFloat(item.price),
        availability: item.availability,
        stock_count: item.stock_count !== null ? parseFloat(item.stock_count) : null,
        category: item.category
    }));

    // Smart filtering
    const searchWords = lower.split(/[\s,]+/).filter(w => w.length > 2 && isNaN(w));
    let menu = allItems.filter(item => {
        const pName = item.product_name.toLowerCase();
        return searchWords.some(word => 
            pName.includes(word) || 
            word.includes(pName) ||
            (word.length > 4 && pName.split('').filter(c => word.includes(c)).length / word.length > 0.75)
        );
    });
    
    if (menu.length === 0) menu = allItems.slice(0, 25);
    const menuContext = menu.map(i => `${i.product_name}: ${symbol}${i.price}`).join(", ");
    
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const cartSummary = "Empty";
    
    const systemPrompt = `
You are the Master Sales Executive for ${biz.name}.
CONTEXT:
- Cart: ${cartSummary}
- Menu: ${menuContext}
- Extra Info: ${biz.bot_knowledge || 'No specific info.'}
- Loyalty Program: Customers can redeem points by clicking "Redeem via WhatsApp" on the digital menu. This sends a unique token (RED-XXXXXX). Once they send it, the discount is applied automatically in their browser. NO OTPs are used.

YOUR MISSION: Extract items, quantities, and intent. Match items against the menu list.
⚠️ CRITICAL MENU GATING: You can ONLY suggest, confirm, or upsell items that are explicitly listed in the "- Menu:" context above. If the user asks for a dish that is NOT in the Menu context (even if you know it is a common item or matches the restaurant style), do NOT assume we have it and do NOT say you will add it. Instead, politely inform them it is currently unavailable or out of stock, suggest they view the menu, and prompt them to select something else.
REPLY in the SAME LANGUAGE as the user (English or Roman Urdu).

JSON RULES:
- "intent": "ORDER_ITEM", "GREETING", "CHECKOUT", "ENQUIRY", "RESERVATION", "FEEDBACK", "CANCEL_ORDER", or "UNKNOWN".
- "items": Array of { "name": string, "quantity": number }. ⚠️ CRITICAL: Only include items that are present in the provided Menu context. Never include or guess items that are not in the Menu. NEVER guess the specific dish variant. If a user says "Biryani", "Pizza", or "Chicken", and your menu context shows multiple variants (e.g. Full/Half, Veg/Non-Veg), you MUST return the generic name ONLY (e.g. "Biryani") so the system can ask for clarification.
- "human_reply": A conversational, sales-driven response. Confirm items enthusiastically. If an item is not in the Menu context, politely explain that it is out of stock / unavailable today. If an item is ambiguous, tell them you'll show the options.
- "upsell_suggestion": A short, tempting suggestion for one more item (must be from the Menu context).

RETURN ONLY JSON:
{
  "intent": string,
  "items": [],
  "reservation": { "date": string, "time": string, "guests": number },
  "feedback": { "rating": number, "comment": string },
  "human_reply": string,
  "upsell_suggestion": string
}
`;

    const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: msgText }],
        model: "llama-3.1-8b-instant",
        response_format: { type: "json_object" }
    });

    const resultStr = chatCompletion.choices[0]?.message?.content || "{}";
    console.log(`🤖 GROQ RESPONSE:`, resultStr);
    const result = JSON.parse(resultStr);

    // Now let's trace matching logic
    console.log("\n--- TRACING MATCHING LOGIC ---");
    let addedSummary = [];
    let newCart = [];
    let ambiguousItems = [];

    for (const aiItem of result.items) {
        if (!aiItem || !aiItem.name) continue;
        console.log(`\nProcessing AI Item: "${aiItem.name}" with quantity: ${aiItem.quantity}`);
        
        // Step 1: Try exact match first
        const exactMatch = menu.find(i => i.product_name && i.product_name.toLowerCase() === aiItem.name.toLowerCase());
        
        if (exactMatch) {
            console.log(`Exact Match Found: ${exactMatch.product_name} (ID: ${exactMatch.id})`);
            const qty = aiItem.quantity || aiItem.qty || 1;
            // Let's mock getItemOptions or print the item
            const existing = newCart.find(c => c.name === exactMatch.product_name);
            if (existing) existing.qty += qty;
            else newCart.push({ id: exactMatch.id, name: exactMatch.product_name, qty, price: exactMatch.price });
            addedSummary.push(`${qty}x *${exactMatch.product_name}*`);
        } else {
            console.log(`No Exact Match for "${aiItem.name}". Running fuzzy matching...`);
            // Step 2: Find ALL fuzzy matches (Check name, category, or sub-category)
            const rawFuzzyMatches = menu.filter(i => 
                i.product_name.toLowerCase().includes(aiItem.name.toLowerCase()) ||
                aiItem.name.toLowerCase().includes(i.product_name.toLowerCase()) ||
                (i.category && i.category.toLowerCase() === aiItem.name.toLowerCase()) ||
                (i.sub_category && i.sub_category.toLowerCase() === aiItem.name.toLowerCase())
            );
            
            // Deduplicate fuzzy matches by product_name
            const seenFuzzy = new Set();
            const fuzzyMatches = [];
            for (const item of rawFuzzyMatches) {
                const key = item.product_name.toLowerCase();
                if (!seenFuzzy.has(key)) {
                    seenFuzzy.add(key);
                    fuzzyMatches.push(item);
                }
            }
            
            console.log(`Fuzzy Matches found:`, fuzzyMatches.map(m => m.product_name));

            if (fuzzyMatches.length === 1) {
                const item = fuzzyMatches[0];
                console.log(`Exactly ONE fuzzy match: "${item.product_name}" (ID: ${item.id})`);
                const qty = aiItem.quantity || aiItem.qty || 1;
                const existing = newCart.find(c => c.name === item.product_name);
                if (existing) existing.qty += qty;
                else newCart.push({ id: item.id, name: item.product_name, qty, price: item.price });
                addedSummary.push(`${qty}x *${item.product_name}*`);
            } else if (fuzzyMatches.length > 1) {
                console.log(`MULTIPLE fuzzy matches found!`);
                ambiguousItems.push({ keyword: aiItem.name, qty: aiItem.quantity || aiItem.qty || 1, matches: fuzzyMatches });
            } else {
                console.log(`Zero fuzzy matches found for "${aiItem.name}"`);
            }
        }
    }

    console.log("\n--- RESULT ---");
    console.log("newCart:", newCart);
    console.log("addedSummary:", addedSummary);
    console.log("ambiguousItems:", ambiguousItems.map(a => ({ keyword: a.keyword, matchesCount: a.matches.length, matches: a.matches.map(m => m.product_name) })));

  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}
run();
