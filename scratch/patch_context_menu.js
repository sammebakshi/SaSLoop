const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize to LF
const normalized = content.replace(/\r\n/g, '\n');
let updated = normalized;

// 1. Separate View table button onContextMenu
const separateViewTarget = `<button key={table.id} onClick={() => selectPosTable(table)} className={\`h-24 w-full rounded-md \${statusColors[status] || statusColors.AVAILABLE} text-white font-bold text-xs cursor-pointer transition-all active:scale-[0.98] relative shadow-sm flex flex-col justify-between p-3 \${isSelected ? 'ring-2 ring-offset-2 ring-[#ff9f43] border-2 border-[#ff9f43]' : 'border-0'}\`}>`;

const separateViewReplacement = `<button
                                      key={table.id}
                                      onClick={() => selectPosTable(table)}
                                      onContextMenu={(e) => {
                                        e.preventDefault();
                                        setTableContextMenu({
                                          tableId: table.id,
                                          x: e.clientX,
                                          y: e.clientY
                                        });
                                      }}
                                      className={\`h-24 w-full rounded-md \${statusColors[status] || statusColors.AVAILABLE} text-white font-bold text-xs cursor-pointer transition-all active:scale-[0.98] relative shadow-sm flex flex-col justify-between p-3 \${isSelected ? 'ring-2 ring-offset-2 ring-[#ff9f43] border-2 border-[#ff9f43]' : 'border-0'}\`}>`;

if (updated.includes(separateViewTarget)) {
  updated = updated.replace(separateViewTarget, separateViewReplacement);
  console.log("SUCCESS: Replaced Separate View button pattern!");
} else {
  console.log("WARNING: Separate View button pattern not found!");
}

// 2. Render Context Menu popup at the bottom of the component (right before <VirtualKeyboard)
const virtualKeyboardTarget = `      <VirtualKeyboard target={keyboardTarget} onClose={() => setKeyboardTarget(null)} />`;

const contextMenuComponent = `      {tableContextMenu && (
        <div 
          className={\`fixed z-[9999] rounded-xl shadow-2xl border p-1.5 flex flex-col gap-1 w-44 font-sans \${isDark ? 'bg-[#161b22] border-[#30363d] text-white shadow-black/40' : 'bg-white border-slate-200 text-slate-800 shadow-slate-300/50'}\`}
          style={{ left: Math.min(window.innerWidth - 180, tableContextMenu.x), top: Math.min(window.innerHeight - 185, tableContextMenu.y) }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={\`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider border-b \${isDark ? 'border-[#30363d] text-[#8b949e]' : 'border-slate-100 text-slate-400'} mb-1\`}>
            Set Table Status
          </div>
          {[
            { label: 'Available (Free)', status: 'AVAILABLE', color: '#10ac84' },
            { label: 'Reserved', status: 'RESERVED', color: '#ffb142' },
            { label: 'Draft Printed', status: 'DRAFT_PRINTED', color: '#8d6e63' },
            { label: 'Bill Saved', status: 'BILL_SAVED', color: '#ff7675' }
          ].map(opt => (
            <button
              key={opt.status}
              type="button"
              onClick={() => {
                setTableStatuses(prev => ({ ...prev, [tableContextMenu.tableId]: opt.status }));
                setTableContextMenu(null);
              }}
              className={\`flex items-center gap-2.5 px-2.5 py-2 w-full text-left rounded-lg transition-colors \${
                isDark 
                  ? 'hover:bg-[#21262d] text-gray-200 hover:text-white' 
                  : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
              }\`}
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: opt.color }} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
      <VirtualKeyboard target={keyboardTarget} onClose={() => setKeyboardTarget(null)} />`;

if (updated.includes(virtualKeyboardTarget)) {
  updated = updated.replace(virtualKeyboardTarget, contextMenuComponent);
  console.log("SUCCESS: Inserted context menu rendering block!");
} else {
  console.log("ERROR: VirtualKeyboard target not found for context menu insertion!");
}

if (updated !== normalized) {
  const finalContent = content.includes('\r\n') ? updated.replace(/\n/g, '\r\n') : updated;
  fs.writeFileSync(filePath, finalContent, 'utf8');
  console.log("SUCCESS: app patch applied successfully!");
} else {
  console.log("ERROR: No updates were made to the file.");
}
