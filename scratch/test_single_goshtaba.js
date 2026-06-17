const pool = require('../db');
const Groq = require('groq-sdk');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
  console.log("Starting...");
  try {
    const userId = 48;
    const msgText = "Goshtaba x2";
    const lower = msgText.trim().toLowerCase();

    console.log("Fetching biz data...");
    // Fetch biz data
    const bizRes = await pool.query("SELECT r.*, u.bot_knowledge FROM restaurants r JOIN app_users u ON r.user_id = u.id WHERE r.user_id = $1", [userId]);
    const biz = bizRes.rows[0];
    const symbol = biz.currency_code === 'INR' ? '₹' : '$';

    console.log("Fetching menu...");
    // Fetch default digital menu items
    const menuRes = await pool.query("SELECT id FROM outlet_menus WHERE (outlet_id = $1 OR user_id = $1) AND is_digital_default = true LIMIT 1", [userId]);
    const menuId = menuRes.rows[0].id;
    
    const itemsRes = await pool.query(
        `SELECT omi.id, omi.item_name AS product_name, omi.base_price AS price, omi.is_active AS availability, omi.stock_qty AS stock_count, COALESCE(c.name, 'General') as category
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
    console.log("Filtered Menu Context passed to AI:", menuContext);

    const systemPrompt = `
You are the Master Sales Executive for ${biz.name}.
CONTEXT:
- Cart: Empty
- Menu: ${menuContext}
- Extra Info: ${biz.bot_knowledge || 'No specific info.'}

YOUR MISSION: Extract items, quantities, and intent. Match items against the menu list.
⚠️ CRITICAL MENU GATING: You can ONLY suggest, confirm, or upsell items that are explicitly listed in the "- Menu:" context above.
JSON RULES:
- "items": Array of { "name": string, "quantity": number }. ⚠️ CRITICAL: Only include items that are present in the provided Menu context. Never include or guess items that are not in the Menu. NEVER guess the specific dish variant. If a user says "Biryani", "Pizza", or "Chicken", and your menu context shows multiple variants (e.g. Full/Half, Veg/Non-Veg), you MUST return the generic name ONLY (e.g. "Biryani") so the system can ask for clarification.
RETURN ONLY JSON.
`;

    console.log("Calling Groq...");
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: msgText }],
        model: "llama-3.1-8b-instant",
        response_format: { type: "json_object" }
    });

    console.log("Groq output:", chatCompletion.choices[0]?.message?.content);
  } catch (e) {
    console.error("Caught error:", e);
  } finally {
    await pool.end();
  }
}
run();
