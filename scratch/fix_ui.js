
const fs = require('fs');
const path = 'c:/Users/Sajad/Desktop/SaSLoop/backend/SaSLoop-dashboard/src/pages/DigitalCatalog.jsx';
let content = fs.readFileSync(path, 'utf8');

const badSection = `                    <div className="relative group">
                       <input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={(e) => handleAiScan(e.target.files[0])}
                          disabled={scanning}
                       <input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={(e) => handleAiScan(e.target.files[0])}
                          disabled={scanning}
                       />
                       <button className={\`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all \${scanning ? 'bg-indigo-100 text-indigo-400 animate-pulse' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 group-hover:scale-105'}\`}>
                          <Sparkles className={\`w-4 h-4 \${scanning ? 'animate-spin' : ''}\`} /> {scanning ? 'AI Scanning...' : 'Import from Photo'}
                       </button>
                    </div>`;

const goodSection = `                    <div className="relative group">
                       <input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={(e) => handleAiScan(e.target.files[0])}
                          disabled={scanning}
                       />
                       <button className={\`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all \${scanning ? 'bg-indigo-100 text-indigo-400 animate-pulse' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 group-hover:scale-105'}\`}>
                          <Sparkles className={\`w-4 h-4 \${scanning ? 'animate-spin' : ''}\`} /> {scanning ? 'AI Scanning...' : 'Import from Photo'}
                       </button>
                    </div>`;

content = content.replace(badSection, goodSection);
fs.writeFileSync(path, content);
console.log("Fixed!");
