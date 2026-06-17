const fs = require('fs');

const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const lineFixes = {
  3804: "                    ✕",
  6037: "    // 🔐 Internet is REQUIRED for login — per system policy",
  9116: "                            ✕",
  9142: "                                  —",
  9350: "                                  —",
  14744: "✕",
  14855: "✕",
  15094: "✕",
  15287: "✕",
  15887: "✕",
  15968: "                             —",
  16144: "✕",
  16246: "✕",
  17975: "                                {business?.business_details?.settings?.print_upi_qr ? '● ENABLED IN BACK OFFICE' : '○ DISABLED IN BACK OFFICE'}",
  18547: "✕",
  19073: "✕"
};

for (const lineNumStr in lineFixes) {
  const lineIndex = parseInt(lineNumStr) - 1;
  const original = lines[lineIndex];
  const fixed = lineFixes[lineNumStr];
  console.log(`Line ${lineNumStr}:\n  Original: ${original.trim()}\n  Fixed   : ${fixed.trim()}`);
  lines[lineIndex] = fixed;
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('Successfully completed last replacements!');
