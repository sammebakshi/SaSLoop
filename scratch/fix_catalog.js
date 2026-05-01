
const fs = require('fs');
const path = 'c:/Users/Sajad/Desktop/SaSLoop/backend/SaSLoop-dashboard/src/pages/DigitalCatalog.jsx';
let lines = fs.readFileSync(path, 'utf8').split('\n');

// Find the stock input line
let targetIndex = lines.findIndex(l => l.includes('input type="number" value={editingItem.stock_count'));
if (targetIndex !== -1) {
    // Keep everything up to the input
    lines = lines.slice(0, targetIndex + 1);
    // Add the correct closing structure
    lines.push('                            </div>');
    lines.push('                         )}');
    lines.push('                      </div>');
    lines.push('');
    lines.push('                      <div className="flex gap-4 pt-4">');
    lines.push('                         <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-5 bg-slate-100 text-slate-600 font-black text-[11px] uppercase rounded-2xl tracking-widest">Discard Changes</button>');
    lines.push('                         <button type="submit" className="flex-2 px-12 py-5 bg-slate-900 text-white font-black text-[11px] uppercase rounded-2xl tracking-widest shadow-2xl shadow-slate-200">Save Updates</button>');
    lines.push('                      </div>');
    lines.push('                  </form>');
    lines.push('              </div>');
    lines.push('          </div>');
    lines.push('      )}');
    lines.push('      {notice && (');
    lines.push('        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[500] bg-slate-900 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-3 animate-slide-up">');
    lines.push('            <CheckCircle2 className="w-6 h-6 text-emerald-400" />');
    lines.push('            <span className="font-black text-[10px] uppercase tracking-widest">{notice.message}</span>');
    lines.push('        </div>');
    lines.push('      )}');
    lines.push('      {confirmAction && (');
    lines.push('        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">');
    lines.push('            <div className="bg-white w-full max-w-sm p-12 rounded-[3.5rem] shadow-2xl text-center animate-in zoom-in-95 duration-300">');
    lines.push('                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">');
    lines.push('                    <AlertCircle className="w-10 h-10" />');
    lines.push('                </div>');
    lines.push('                <h4 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter uppercase italic">Confirm Action</h4>');
    lines.push('                <p className="text-slate-400 text-xs font-bold mb-10 uppercase tracking-widest leading-relaxed px-4">{confirmAction.message}</p>');
    lines.push('                <div className="flex gap-4">');
    lines.push('                    <button onClick={() => setConfirmAction(null)} className="flex-1 py-5 bg-slate-100 text-slate-400 font-black text-[11px] uppercase rounded-2xl transition-all active:scale-95">Cancel</button>');
    lines.push('                    <button onClick={confirmAction.onConfirm} className="flex-1 py-5 bg-rose-500 text-white font-black text-[11px] uppercase rounded-2xl shadow-xl shadow-rose-100 transition-all active:scale-95">Yes, Delete</button>');
    lines.push('                </div>');
    lines.push('            </div>');
    lines.push('        </div>');
    lines.push('      )}');
    lines.push('    </div>');
    lines.push('  );');
    lines.push('}');
    lines.push('');
    lines.push('export default DigitalCatalog;');
    
    fs.writeFileSync(path, lines.join('\n'));
    console.log("Re-fixed!");
} else {
    console.log("Target not found!");
}
