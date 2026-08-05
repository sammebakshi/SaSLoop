const fs = require('fs');
const filePath = 'pos-app/src/App.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix computedGrandTotal calculation
const target1 = 'const computedGrandTotal = subtotal + deliveryCharge + serviceCharge + tipAmount + tax_cgst + tax_sgst - totalDiscount;';
const replace1 = 'const isTaxActive = taxRate > 0;\n    const computedGrandTotal = (isInclusive || !isTaxActive)\n      ? (subtotal + deliveryCharge + serviceCharge + tipAmount - totalDiscount)\n      : (subtotal + deliveryCharge + serviceCharge + tipAmount + tax_cgst + tax_sgst - totalDiscount);';

if (content.includes(target1)) {
    content = content.replace(target1, replace1);
    console.log('Fixed computedGrandTotal in App.jsx');
} else {
    console.log('Target 1 not found in App.jsx');
}

// 2. Fix business?.name fallback taking user name (WASIM) instead of restaurant name
content = content.replaceAll('business?.business_name || business?.name || posSettings.receiptHeader', 'business?.business_name || posSettings.receiptHeader');
content = content.replaceAll('business?.business_name || business?.name || "SHAHE TEHZEEB RESTAURANT"', 'business?.business_name || posSettings.receiptHeader || "SHAHE TEHZEEB RESTAURANT"');

fs.writeFileSync(filePath, content, 'utf8');
console.log('App.jsx successfully updated');
