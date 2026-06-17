const fs = require('fs');

const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  // 1. Backspace key keypress
  {
    target: "key === 'BACKSPACE' ? '\uFFFD\u004F\uFFFD' : key",
    replacement: "key === 'BACKSPACE' ? '⌫' : key"
  },
  // 2. Prep-time note
  {
    target: "Cart auto-sync useEffect removed \uFFFD?\" items keep",
    replacement: "Cart auto-sync useEffect removed — items keep"
  },
  // 3. Print KOT item layout
  {
    target: "   \uFFFD?\uFFFD ${itemName} x${itemQty} @ ${config.currency}${itemRate.toFixed(2)}",
    replacement: "   • ${itemName} x${itemQty} @ ${config.currency}${itemRate.toFixed(2)}"
  },
  // 4. Pre-Order Temporary Tables Header
  {
    target: "\uFFFD\u0059\u0022\uFFFD Pre-Order Temporary Tables",
    replacement: "📦 Pre-Order Temporary Tables"
  },
  // 5. Keypad press Escape
  {
    target: "val === '\uFFFD\u006F\u002E'",
    replacement: "val === '✕'"
  },
  {
    target: "val === '\uFFFD\u004F\uFFFD' || val === 'Backspace'",
    replacement: "val === '⌫' || val === 'Backspace'"
  },
  {
    target: "handleKeypadPress('\uFFFD\u004F\uFFFD');",
    replacement: "handleKeypadPress('⌫');"
  },
  {
    target: "console.error(\"\uFFFD\u004F Item click error:\", err);",
    replacement: "console.error(\"⌫ Item click error:\", err);"
  },
  // 6. Offline sync
  {
    target: "Total: \uFFFD,\uFFFD{o.total_price}",
    replacement: "Total: ₹{o.total_price}"
  },
  {
    target: "// \uFFFD\u0059\"\" Auto-sync",
    replacement: "// 🔄 Auto-sync"
  },
  {
    target: "toast.info(`\uFFFD\u0059\"\" Back online! Syncing",
    replacement: "toast.info(`🔄 Back online! Syncing"
  },
  // 7. Em dash, warning sign, single left/right angle quotes
  {
    target: "// \uFFFD\u0059\"\uFFFD Internet is REQUIRED for login \uFFFD?\"\uFFFD per system policy",
    replacement: "// 🔐 Internet is REQUIRED for login — per system policy"
  },
  {
    target: "// Server-synced order \uFFFD?\" call update",
    replacement: "// Server-synced order — call update"
  },
  {
    target: "// New order or local-only edit \uFFFD?\" call create",
    replacement: "// New order or local-only edit — call create"
  },
  // 8. Survey angles
  {
    target: "text-[#8b949e] hover:text-white\">\uFFFD?\uFFFD</button>",
    replacement: "text-[#8b949e] hover:text-white\">‹</button>"
  },
  {
    target: "text-[#8b949e] hover:text-white\">\uFFFD?\uFFFD</button>",
    replacement: "text-[#8b949e] hover:text-white\">›</button>"
  },
  // 9. Backoffice print upi qr
  {
    target: "print_upi_qr ? '\uFFFD-\uFFFD ENABLED IN BACK OFFICE'",
    replacement: "print_upi_qr ? '● ENABLED IN BACK OFFICE'"
  },
  {
    target: "DISABLED IN BACK OFFICE'",
    replacement: "DISABLED IN BACK OFFICE'"
  }
];

let replacedCount = 0;
for (const r of replacements) {
  if (content.includes(r.target)) {
    content = content.split(r.target).join(r.replacement);
    console.log(`Replaced: ${r.target.substring(0, 30)}...`);
    replacedCount++;
  } else {
    // Try regex escape just in case
    const escaped = escapeRegExp(r.target);
    const regex = new RegExp(escaped, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, r.replacement);
      console.log(`Replaced via RegExp: ${r.target.substring(0, 30)}...`);
      replacedCount++;
    }
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Finished remaining. Applied ${replacedCount} replacements.`);
