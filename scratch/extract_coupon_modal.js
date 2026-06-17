const fs = require('fs');

const content = fs.readFileSync('scratch/App_reconstructed_parsed.jsx', 'utf8');

// Find the coupon modal string starting with:
// "               </motion.div>\n            )}\n         </AnimatePresence>\n\n         {/* COUPON SELECTION MODAL */}\n
const startKeyword = 'COUPON SELECTION MODAL';
const index = content.indexOf(startKeyword);

if (index === -1) {
  console.log('COUPON SELECTION MODAL not found in App_reconstructed_parsed.jsx');
} else {
  // Let's find the start of the double-quoted string
  // Search backward from index to find the double quote `"`
  let startQuote = -1;
  for (let i = index; i >= 0; i--) {
    if (content[i] === '"' && content[i-1] !== '\\') {
      startQuote = i;
      break;
    }
  }
  
  // Search forward from index to find the end double quote `"`
  let endQuote = -1;
  for (let i = index; i < content.length; i++) {
    if (content[i] === '"' && content[i-1] !== '\\') {
      endQuote = i;
      break;
    }
  }

  console.log(`Found string boundaries: startQuote=${startQuote}, endQuote=${endQuote}`);
  if (startQuote !== -1 && endQuote !== -1) {
    const escapedStr = content.slice(startQuote + 1, endQuote);
    // Unescape the string
    const unescaped = escapedStr
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
      
    fs.writeFileSync('scratch/coupon_modal_clean.jsx', unescaped, 'utf8');
    console.log('Successfully wrote unescaped coupon modal code to scratch/coupon_modal_clean.jsx');
  }
}
