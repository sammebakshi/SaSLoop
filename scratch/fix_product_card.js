const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const targetPattern = /const ProductCard =[\s\S]*?const CartItem =/g;

const replacement = `const ProductCard = ({ item, currency, isDark, onAdd, trackInventory }) => {
  const isOutOfStock = trackInventory && item.stock !== undefined && item.stock <= 0;

  return (
    <div onClick={() => !isOutOfStock && onAdd()} className={\`relative group border cursor-pointer transition-all flex flex-col h-[52px] overflow-hidden rounded-sm \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'} \${isOutOfStock ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:border-[#18ba60] hover:shadow-2xl hover:z-10'}\`}>
      <div className="p-1 flex flex-col justify-between h-full">
        <h4 className={\`text-[8.5px] font-black uppercase tracking-tighter leading-[1.1] line-clamp-2 \${isDark ? 'text-white' : 'text-slate-900'} italic\`}>{item.product_name || item.name}</h4>
        <div className="flex justify-between items-end mt-auto">
          <span className="text-[10px] font-black text-[#18ba60] tracking-tighter tabular-nums">{currency}{parseFloat(item.price || 0).toFixed(0)}</span>
          {item.stock !== undefined && <span className={\`text-[6px] font-bold \${isDark ? 'text-[#8b949e]' : 'text-slate-400'} opacity-40\`}>STK:{item.stock}</span>}
        </div>
      </div>
    </div>
  );
};

const CartItem =`;

if (targetPattern.test(content)) {
  content = content.replace(targetPattern, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("ProductCard fixed successfully!");
} else {
  console.log("Pattern NOT found!");
}
