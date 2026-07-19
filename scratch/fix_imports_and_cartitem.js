const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix the lucide-react import
const oldImport = `  Printer, Save, CheckCircle, Globe, QrCode, List, Bell, Monitor, LayoutGrid, Sliders, Key, BookOpen, Layers, Receipt,
  BarChart3, Store, PieChart, Activity, WifiOff, CreditCard, FileText, Receipt, Layers,`;

const newImport = `  Printer, Save, CheckCircle, Globe, QrCode, List, Bell, Monitor, LayoutGrid, Sliders, Key, BookOpen, Layers, Receipt,
  BarChart3, Store, PieChart, Activity, WifiOff, CreditCard, FileText,`;

if (content.includes(oldImport)) {
  content = content.replace(oldImport, newImport);
  console.log("Import block replaced successfully!");
} else {
  // Try with different line endings
  const oldImportCRLF = oldImport.replace(/\n/g, '\r\n');
  const newImportCRLF = newImport.replace(/\n/g, '\r\n');
  if (content.includes(oldImportCRLF)) {
    content = content.replace(oldImportCRLF, newImportCRLF);
    console.log("Import block (CRLF) replaced successfully!");
  } else {
    console.log("Import block pattern not found!");
  }
}

// 2. Remove duplicate CartItem
// We have two identical copies of CartItem:
// const CartItem = ({ item, currency, isDark, onUpdate, onRemove }) => (
// ...
// );
// right next to each other. Let's find the first one, and if there is a second one right after it, remove it.

const cartItemBlock = `const CartItem = ({ item, currency, isDark, onUpdate, onRemove }) => (
  <div className={\`flex flex-col gap-0 p-1.5 border-b border-[#30363d] hover:bg-white/5 transition-all group\`}>
     <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
           <h4 className={\`text-[9px] font-black uppercase italic truncate tracking-tight text-[#c9d1d9]\`}>{item.product_name || item.name}</h4>
           <div className="flex items-center gap-2">
              <span className="text-[8px] font-black text-[#18ba60] tabular-nums">{currency}{parseFloat(item.price).toFixed(0)}</span>
           </div>
        </div>
        <div className="flex items-center bg-[#0d1117] rounded-sm border border-[#30363d] shrink-0">
           <button onClick={() => onUpdate(item.quantity - 1)} className="w-4 h-4 flex items-center justify-center text-[10px] text-[#8b949e] hover:text-white hover:bg-white/5">-</button>
           <span className="w-5 text-center text-[9px] font-black text-white tabular-nums">{item.quantity}</span>
           <button onClick={() => onUpdate(item.quantity + 1)} className="w-4 h-4 flex items-center justify-center text-[10px] text-[#8b949e] hover:text-white hover:bg-white/5">+</button>
        </div>
        <div className="text-right shrink-0 min-w-[40px]">
           <p className={\`text-[10px] font-black text-white tabular-nums\`}>{currency}{(item.price * item.quantity).toFixed(0)}</p>
        </div>
        <button onClick={onRemove} className="text-[#8b949e] hover:text-rose-500 transition-colors ml-0.5 opacity-0 group-hover:opacity-100"><Trash2 size={12}/></button>
     </div>
  </div>
);`;

// Let's search for double occurrence of this block.
// To ignore line-ending and minor whitespace differences, we can write a regex or standard replace.
const doubleCartItemPattern = /const CartItem = \(\{ item, currency, isDark, onUpdate, onRemove \}\) => \([\s\S]*?\);\s*[\r\n\s]*const CartItem = \(\{ item, currency, isDark, onUpdate, onRemove \}\) => \([\s\S]*?\);\s*[\r\n\s]*const KOTHistoryView/g;

if (doubleCartItemPattern.test(content)) {
  console.log("Found double CartItem pattern!");
  content = content.replace(doubleCartItemPattern, (match) => {
    // Keep only the first CartItem block and transition to KOTHistoryView
    const firstPart = match.substring(0, match.indexOf('const CartItem =', 20)); // search after first index
    return firstPart + '\n\nconst KOTHistoryView';
  });
  console.log("Double CartItem replaced successfully!");
} else {
  console.log("Double CartItem pattern not found. Let's do a simple check.");
  // Fallback: search for standard index of "const CartItem"
  const firstIdx = content.indexOf('const CartItem =');
  const secondIdx = content.indexOf('const CartItem =', firstIdx + 1);
  console.log("First index:", firstIdx, "Second index:", secondIdx);
  if (firstIdx !== -1 && secondIdx !== -1) {
     // Let's inspect the text between firstIdx and secondIdx
     const textBetween = content.substring(firstIdx, secondIdx);
     console.log("Text between length:", textBetween.length);
     // Let's remove the second CartItem block by finding where it ends (usually it ends with ");" followed by KOTHistoryView)
     const endOfSecond = content.indexOf('const KOTHistoryView', secondIdx);
     if (endOfSecond !== -1) {
        content = content.substring(0, secondIdx) + content.substring(endOfSecond);
        console.log("Second CartItem removed via indexes!");
     }
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Finished writing updates!");
