
const fs = require('fs');
const path = 'c:/Users/Sajad/Desktop/SaSLoop/backend/SaSLoop-dashboard/src/pages/DigitalCatalog.jsx';
let content = fs.readFileSync(path, 'utf8');

const problematic = \`                    <div className="relative group">
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
                       <button className={\\\`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all \\\${scanning ? 'bg-indigo-100 text-indigo-400 animate-pulse' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 group-hover:scale-105'}\\\`}>
                          <Sparkles className={\\\`w-4 h-4 \\\${scanning ? 'animate-spin' : ''}\\\`} /> {scanning ? 'AI Scanning...' : 'Import from Photo'}
                       </button>
                    </div>\`;

const fixed = \`                    <div className="relative group">
                       <input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={(e) => handleAiScan(e.target.files[0])}
                          disabled={scanning}
                       />
                       <button className={\\\`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all \\\${scanning ? 'bg-indigo-100 text-indigo-400 animate-pulse' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 group-hover:scale-105'}\\\`}>
                          <Sparkles className={\\\`w-4 h-4 \\\${scanning ? 'animate-spin' : ''}\\\`} /> {scanning ? 'AI Scanning...' : 'Import from Photo'}
                       </button>
                    </div>\`;

// We use a simpler search since backticks are hard
const searchStr = 'disabled={scanning}\\n                       <input';
if (content.includes(searchStr)) {
    content = content.replace('disabled={scanning}\\n                       <input', 'disabled={scanning}\\n                       />\\n                       <input');
    // Then remove the second input
    // This is getting complex, let's just use line index
    const lines = content.split('\\n');
    for(let i=0; i<lines.length; i++) {
        if (lines[i].includes('disabled={scanning}') && lines[i+1] && lines[i+1].includes('<input')) {
            lines[i] = lines[i].replace('disabled={scanning}', 'disabled={scanning} />');
            lines.splice(i+1, 6); // Remove the next 6 lines which are the redundant input
            break;
        }
    }
    fs.writeFileSync(path, lines.join('\\n'));
    console.log("Fixed DigitalCatalog UI!");
} else {
    console.log("Could not find problematic string");
}
