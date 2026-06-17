const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Declare tempKitchenNote state
const target1 = `  const [selectedItemForModifiers, setSelectedItemForModifiers] = useState(null);`;
const replacement1 = `  const [selectedItemForModifiers, setSelectedItemForModifiers] = useState(null);
  const [tempKitchenNote, setTempKitchenNote] = useState('');`;

if (!content.includes(target1)) {
  console.error("Target 1 not found!");
  process.exit(1);
}
content = content.replace(target1, replacement1);
console.log("Target 1 replaced successfully.");

// 2. Pre-populate kitchen note on catalog item click
const target2 = `      const hasOptions = optionGroups.some(og => og.item_id === item.id);
      if (hasOptions) {
        const tierPrice = getItemDisplayPrice(item);
        const label = getItemPriceLabel();
        setSelectedItemForModifiers({
          ...item,
          price: tierPrice,
          original_price: item.price,
          priceLabel: label
        });
      }`;

const replacement2 = `      const hasOptions = optionGroups.some(og => og.item_id === item.id);
      if (hasOptions) {
        const tierPrice = getItemDisplayPrice(item);
        const label = getItemPriceLabel();
        const existingItem = cart.find(c => c.id === item.id && c.priceLabel === label && c.modifiers && c.modifiers.length > 0);
        setTempKitchenNote(existingItem?.modifier || '');
        setSelectedItemForModifiers({
          ...item,
          price: tierPrice,
          original_price: item.price,
          priceLabel: label
        });
      }`;

// We clean up carriage returns for comparison/replacement
const cleanString = (str) => str.replace(/\r\n/g, '\n');

const cleanedContent = cleanString(content);
const cleanedTarget2 = cleanString(target2);

if (!cleanedContent.includes(cleanedTarget2)) {
  console.error("Target 2 not found!");
  process.exit(1);
}

// Find position and replace in raw content (preserving CRLF where appropriate)
const idx2 = cleanedContent.indexOf(cleanedTarget2);
const rawTargetLength2 = content.split('\n').slice(
  cleanedContent.slice(0, idx2).split('\n').length - 1,
  cleanedContent.slice(0, idx2).split('\n').length - 1 + target2.split('\n').length
).join('\n').length;

// For simple string replace:
content = content.replace(target2.replace(/\r\n/g, '\r\n'), replacement2.replace(/\n/g, '\r\n'));
console.log("Target 2 replaced successfully.");

// 3. Replace the entire MODIFIER SELECTION MODAL block
// Let's locate it by finding the start of the block and the matching AnimatePresence close
const startMarker = `{/* MODIFIER SELECTION MODAL */}`;
const cleanContent2 = cleanString(content);

if (!cleanContent2.includes(startMarker)) {
  console.error("Start marker for Target 3 not found!");
  process.exit(1);
}

const startIdx = cleanContent2.indexOf(startMarker);
// Find the closing AnimatePresence after the startIdx
const nextAnimatePresenceCloseIdx = cleanContent2.indexOf('</AnimatePresence>', startIdx);
if (nextAnimatePresenceCloseIdx === -1) {
  console.error("AnimatePresence close tag not found!");
  process.exit(1);
}

const endIdx = nextAnimatePresenceCloseIdx + '</AnimatePresence>'.length;

const oldModalBlockCleaned = cleanContent2.slice(startIdx, endIdx);
console.log("Found modal block of length:", oldModalBlockCleaned.length);

const newModalBlockCleaned = `{/* MODIFIER SELECTION MODAL */}
        <AnimatePresence>
           {selectedItemForModifiers && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1e293b]/80 backdrop-blur-sm">
                 <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-lg bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
                    {/* Header with image */}
                    <div className="relative rounded-t-[2rem] overflow-hidden">
                       {selectedItemForModifiers.image_url ? (
                          <div className="relative h-40 w-full">
                             <img src={selectedItemForModifiers.image_url.startsWith('http') ? selectedItemForModifiers.image_url : \`\${API_BASE}\${selectedItemForModifiers.image_url}\`} alt={selectedItemForModifiers.product_name} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-gradient-to-t from-emerald-700/95 via-emerald-600/60 to-transparent" />
                             <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end">
                                <div>
                                   <h3 className="text-xl font-black uppercase italic tracking-tighter text-white drop-shadow-lg">{selectedItemForModifiers.product_name}</h3>
                                   <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100 opacity-80">Customize your selection</p>
                                </div>
                                <button onClick={() => { setSelectedItemForModifiers(null); setTempKitchenNote(''); }} className="text-white opacity-80 hover:opacity-100 text-2xl font-bold transition-all bg-black/20 rounded-full w-9 h-9 flex items-center justify-center backdrop-blur-sm">✕</button>
                             </div>
                          </div>
                       ) : (
                          <div className="p-6 bg-emerald-600 text-white flex justify-between items-center">
                             <div>
                                <h3 className="text-xl font-black uppercase italic tracking-tighter">{selectedItemForModifiers.product_name}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100 opacity-60">Customize your selection</p>
                             </div>
                             <button onClick={() => { setSelectedItemForModifiers(null); setTempKitchenNote(''); }} className="text-white opacity-60 hover:opacity-100 text-2xl font-bold transition-all">✕</button>
                          </div>
                       )}
                    </div>
                    <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar">
                        {optionGroups.filter(og => og.item_id === selectedItemForModifiers.id).map(og => (
                           <div key={og.id} className="space-y-3">
                              <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400">{og.name} (Min: {og.min_selectable}, Max: {og.max_selectable})</h4>
                              <div className="grid grid-cols-2 gap-3">
                                 {og.options.map(o => {
                                    const modObj = { name: o.name, price: parseFloat(o.price_override) || 0, groupId: og.id };
                                    
                                    // Count occurrences of this exact option in the cart for this item
                                    const optionQtyInCart = cart.reduce((sum, c) => {
                                       if (c.id === selectedItemForModifiers.id && c.priceLabel === selectedItemForModifiers.priceLabel && c.modifiers) {
                                          const hasMod = c.modifiers.some(m => m.name === o.name && m.groupId === og.id);
                                          if (hasMod) {
                                             return sum + c.quantity;
                                          }
                                       }
                                       return sum;
                                    }, 0);
                                    
                                    const isSelected = optionQtyInCart > 0;
                                    
                                    return (
                                       <button key={o.name} onClick={() => {
                                             // 1. Calculate total options currently in cart for this group
                                             const totalGroupQty = cart.reduce((sum, c) => {
                                                if (c.id === selectedItemForModifiers.id && c.priceLabel === selectedItemForModifiers.priceLabel && c.modifiers) {
                                                   const count = c.modifiers.filter(m => m.groupId === og.id).length;
                                                   if (count > 0) {
                                                      return sum + c.quantity;
                                                   }
                                                }
                                                return sum;
                                             }, 0);

                                             // 2. Enforce max_selectable
                                             if (og.max_selectable === 1) {
                                                setCart(prev => {
                                                   const existIdx = prev.findIndex(c => 
                                                      c.id === selectedItemForModifiers.id &&
                                                      c.priceLabel === selectedItemForModifiers.priceLabel &&
                                                      c.modifiers &&
                                                      c.modifiers.some(m => m.groupId === og.id)
                                                   );

                                                   if (existIdx !== -1) {
                                                      // Replace existing option from the same group
                                                      return prev.map((c, idx) => {
                                                         if (idx === existIdx) {
                                                            const updatedModifiers = c.modifiers.map(m => m.groupId === og.id ? modObj : m);
                                                            return {
                                                               ...c,
                                                               quantity: 1,
                                                               modifiers: updatedModifiers,
                                                               modifier: tempKitchenNote || undefined
                                                            };
                                                         }
                                                         return c;
                                                      });
                                                   } else {
                                                      // Add new item with quantity 1
                                                      return [...prev, {
                                                         ...selectedItemForModifiers,
                                                         quantity: 1,
                                                         price: 0,
                                                         modifiers: [modObj],
                                                         modifier: tempKitchenNote || undefined
                                                      }];
                                                   }
                                                });
                                                toast.success(\`Selected \${selectedItemForModifiers.product_name} (\${o.name})\`);
                                             } else {
                                                // max_selectable > 1
                                                if (totalGroupQty >= og.max_selectable) {
                                                   toast.warning(\`Max \${og.max_selectable} options allowed for \${og.name}\`);
                                                   return;
                                                }

                                                setCart(prev => {
                                                   const existIdx = prev.findIndex(p => {
                                                      if (p.id !== selectedItemForModifiers.id || p.priceLabel !== selectedItemForModifiers.priceLabel) return false;
                                                      return p.modifiers && p.modifiers.some(m => m.name === o.name && m.groupId === og.id);
                                                   });

                                                   if (existIdx !== -1) {
                                                      // Increment quantity
                                                      return prev.map((p, i) => i === existIdx ? { ...p, quantity: p.quantity + 1 } : p);
                                                   } else {
                                                      // Add new item with quantity 1
                                                      return [...prev, {
                                                         ...selectedItemForModifiers,
                                                         quantity: 1,
                                                         price: 0,
                                                         modifiers: [modObj],
                                                         modifier: tempKitchenNote || undefined
                                                      }];
                                                   }
                                                });
                                                toast.success(\`Added \${selectedItemForModifiers.product_name} (\${o.name})\`);
                                             }
                                             setLastAddedItemId(selectedItemForModifiers.id);
                                          }} className={\`p-4 rounded-2xl border flex flex-col items-start transition-all relative \${isSelected ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'}\`}>
                                           <span className="text-[10px] font-black uppercase italic">
                                              {o.name} {optionQtyInCart > 0 && \`(x\${optionQtyInCart})\`}
                                           </span>
                                           <span className="text-[8px] font-bold opacity-60">+{config.currency}{modObj.price}</span>
                                        </button>
                                     );
                                  })}
                               </div>
                            </div>
                         ))}
                         <div className="space-y-3">
                            <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Kitchen Note</h4>
                            <textarea 
                               placeholder="Ex: No Onions, Less Salt..." 
                               value={tempKitchenNote} 
                               className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:border-emerald-500 h-24 transition-all" 
                               onChange={(e) => {
                                  const val = e.target.value;
                                  setTempKitchenNote(val);
                                  setCart(prev => prev.map(c => {
                                     if (c.id === selectedItemForModifiers.id && c.priceLabel === selectedItemForModifiers.priceLabel && c.modifiers && c.modifiers.length > 0) {
                                        return { ...c, modifier: val || undefined };
                                     }
                                     return c;
                                  }));
                               }} 
                            />
                         </div>
                      </div>
                      <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
                         <button onClick={() => {
                               const itemOptionGroups = optionGroups.filter(og => og.item_id === selectedItemForModifiers.id);
                               
                               // Check min selection for each group using cart quantities
                               for (const og of itemOptionGroups) {
                                  const totalGroupQty = cart.reduce((sum, c) => {
                                     if (c.id === selectedItemForModifiers.id && c.priceLabel === selectedItemForModifiers.priceLabel && c.modifiers) {
                                        const count = c.modifiers.filter(m => m.groupId === og.id).length;
                                        if (count > 0) {
                                           return sum + c.quantity;
                                        }
                                     }
                                     return sum;
                                  }, 0);

                                  if (totalGroupQty < og.min_selectable) {
                                     toast.warning(\`Please select at least \${og.min_selectable} option(s) for \${og.name}\`);
                                     return;
                                  }
                               }
                               
                               // Reset temp state and close modal
                               setTempKitchenNote('');
                               setSelectedItemForModifiers(null);
                            }} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">
                               Done
                            </button>
                      </div>
                  </motion.div>
               </motion.div>
            )}
        </AnimatePresence>`;

// Do exact replacement by finding index in CRLF string
// To preserve line endings we slice CRLF string at corresponding clean-string positions
const linesArray = content.split('\n');
const cleanLinesArray = cleanContent2.split('\n');

// Find index of first line in linesArray
const startLineIdx = cleanLinesArray.findIndex(l => l.includes(startMarker));
const endLineIdx = cleanLinesArray.findIndex((l, i) => i > startLineIdx && l.includes('</AnimatePresence>'));

if (startLineIdx === -1 || endLineIdx === -1) {
  console.error("Failed to resolve line index for Target 3!");
  process.exit(1);
}

console.log("Replacing from line", startLineIdx + 1, "to", endLineIdx + 1);

const linesBefore = linesArray.slice(0, startLineIdx);
const linesAfter = linesArray.slice(endLineIdx + 1);

const finalReplacementLines = newModalBlockCleaned.replace(/\n/g, '\r\n').split('\n');

const newLinesArray = [...linesBefore, ...finalReplacementLines, ...linesAfter];
const newContent = newLinesArray.join('\n');

fs.writeFileSync(filePath, newContent, 'utf8');
console.log("Target 3 replaced successfully. File updated.");
