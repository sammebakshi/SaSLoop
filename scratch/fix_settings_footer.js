const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');
const isCRLF = content.includes('\r\n');
let n = content.replace(/\r\n/g, '\n');

// The exact lines from 23179 (0-indexed: 23178) to 23195 (0-indexed: 23194)
const oldBlock = [
   '                           </div>',
   '                    {/* Footer */}',
   '                    <div className={`p-4 border-t flex justify-end items-center shrink-0 ${isDark ? \'bg-[#161b22] border-[#30363d]\' : \'bg-[#f8f9fa] border-slate-200\'}`}>',
   '                       <button',
   '                          onClick={() => {',
   '                             toast.success("Settings Saved!");',
   '                             setIsSettingsModalOpen(false);',
   '                          }}',
   '                          className="px-6 py-2 bg-[#10ac84] hover:bg-[#0e9a75] text-white rounded-lg text-[10px] font-black uppercase transition-all active:scale-95 shadow-md"',
   '                       >',
   '                          Save & Close',
   '                       </button>',
   '                    </div>',
   '                 </motion.div>',
   '              </motion.div>',
   '           )}',
   '        </AnimatePresence>',
].join('\n');

const newBlock = [
   '                           </div>',
   '                        )}',
   '                      </div>',
   '                     {/* Footer */}',
   '                     <div className={`px-5 py-3 border-t flex justify-end items-center gap-3 shrink-0 ${isDark ? \'bg-[#0d1117] border-[#30363d]\' : \'bg-white border-slate-200\'}`}>',
   '                        <button',
   '                           onClick={() => {',
   '                              setIsSettingsModalOpen(false);',
   '                              setSettingsActiveTab(\'general\');',
   '                           }}',
   '                           className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 border ${',
   '                              isDark ? \'border-[#30363d] text-slate-300 hover:bg-[#1f2937]\' : \'border-slate-200 text-slate-600 hover:bg-slate-100\'',
   '                           }`}',
   '                        >',
   '                           Cancel',
   '                        </button>',
   '                        <button',
   '                           onClick={() => {',
   '                              toast.success("Settings Saved!");',
   '                              setIsSettingsModalOpen(false);',
   '                              setSettingsActiveTab(\'general\');',
   '                           }}',
   '                           className="px-6 py-2 bg-[#18ba60] hover:bg-[#15a855] text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-md"',
   '                        >',
   '                           Save & Close',
   '                        </button>',
   '                     </div>',
   '                  </div>',
   '               </div>',
   '            )}',
].join('\n');

const idx = n.indexOf(oldBlock);
if (idx === -1) {
   console.error("❌ Could not find old footer block");
   // Debug: find sub-parts
   console.log("motion.div found:", n.indexOf('</motion.div>\n              </motion.div>'));
   console.log("AnimatePresence found:", n.indexOf('</AnimatePresence>', n.lastIndexOf('isSettingsModalOpen')));
   process.exit(1);
}

console.log("✓ Found old footer block at index:", idx);
n = n.substring(0, idx) + newBlock + n.substring(idx + oldBlock.length);

if (isCRLF) n = n.replace(/\n/g, '\r\n');
fs.writeFileSync(appPath, n, 'utf8');
console.log("🎉 Settings modal footer + closing tags updated to UDM!");
