const fs = require('fs');
const filePath = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\backend\\whatsappManager.js';
let content = fs.readFileSync(filePath, 'utf8');

// Match the line regardless of exact whitespace
const regex = /finalGrandTotal\s*=\s*Math\.max\(0,\s*finalGrandTotal\s*-\s*discountAmount\);/;
const match = content.match(regex);

if (match) {
    const target = match[0];
    const injection = "\n        }\n\n        if (orderType === 'delivery') {\n            finalGrandTotal += parseFloat(deliveryCharge) || 0;";
    if (!content.includes("orderType === 'delivery'")) {
        content = content.replace(target, target + injection);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Successfully injected delivery charge calculation.");
    } else {
        console.log("Already injected.");
    }
} else {
    console.log("Target NOT found even with regex.");
}
