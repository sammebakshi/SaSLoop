const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');
const isCRLF = content.includes('\r\n');
let n = content.replace(/\r\n/g, '\n');

// 1. Update outer container of Login Page
n = n.replace(
  '<div className="h-screen flex flex-col font-sans bg-slate-50 relative select-none">',
  '<div className={`h-screen flex flex-col font-sans relative select-none transition-colors duration-300 ${isDark ? \'bg-[#0d1117] text-white\' : \'bg-slate-50 text-slate-800\'}`}>'
);

// 2. Update Split Screen container
n = n.replace(
  '<div className="flex-1 flex flex-row relative overflow-hidden bg-slate-50">',
  '<div className={`flex-1 flex flex-row relative overflow-hidden transition-colors duration-300 ${isDark ? \'bg-[#0d1117]\' : \'bg-slate-50\'}`}>'
);

// 3. Update Left Panel container
n = n.replace(
  '<div className="hidden lg:flex lg:w-1/2 h-full flex-col items-center justify-between p-10 bg-transparent relative overflow-y-auto border-r border-slate-100 select-none z-10">',
  '<div className={`hidden lg:flex lg:w-1/2 h-full flex-col items-center justify-between p-10 bg-transparent relative overflow-y-auto border-r select-none z-10 transition-colors duration-300 ${isDark ? \'border-[#30363d] text-white\' : \'border-slate-100 text-slate-800\'}`}>'
);

// 4. Update Intro Header & Paragraph
n = n.replace(
  'className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5 text-outline-white"',
  'className={`text-[11px] font-black uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5 ${isDark ? \'text-white\' : \'text-slate-800\'}`}'
);

n = n.replace(
  'className="text-[11.5px] text-slate-600 font-semibold leading-relaxed text-outline-white-sm"',
  'className={`text-[11.5px] font-semibold leading-relaxed ${isDark ? \'text-gray-300\' : \'text-slate-600\'}`}'
);

// 5. Update Login Card container
n = n.replace(
  '<div className="w-full max-w-[400px] sm:max-w-[420px] bg-white rounded-[2rem] login-card-shadow border border-slate-200/80 relative z-10 overflow-hidden mx-2">',
  '<div className={`w-full max-w-[400px] sm:max-w-[420px] rounded-[2rem] login-card-shadow border relative z-10 overflow-hidden mx-2 transition-all duration-300 ${isDark ? \'bg-[#161b22] border-[#30363d] text-white shadow-black/50\' : \'bg-white border-slate-200/80 text-slate-800 shadow-xl\'}`}>'
);

// 6. Update Form Title
n = n.replace(
  '<h2 className="text-xl font-bold text-slate-800">',
  '<h2 className={`text-xl font-bold ${isDark ? \'text-white\' : \'text-slate-800\'}`}>'
);

// 7. Update Username & Password inputs
n = n.replace(
  'className="w-full py-4 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 outline-none text-sm font-bold focus:border-[#18ba60] focus:ring-1 focus:ring-[#18ba60] transition-all placeholder:text-slate-400 shadow-inner"',
  'className={`w-full py-4 pl-12 pr-4 border rounded-2xl outline-none text-sm font-bold focus:border-[#18ba60] focus:ring-1 focus:ring-[#18ba60] transition-all shadow-inner ${isDark ? \'bg-[#0d1117] border-[#30363d] text-white placeholder:text-gray-500\' : \'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400\'}`}'
);

n = n.replace(
  'className="w-full py-4 pl-12 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 outline-none text-sm font-bold focus:border-[#18ba60] focus:ring-1 focus:ring-[#18ba60] transition-all placeholder:text-slate-400 shadow-inner"',
  'className={`w-full py-4 pl-12 pr-12 border rounded-2xl outline-none text-sm font-bold focus:border-[#18ba60] focus:ring-1 focus:ring-[#18ba60] transition-all shadow-inner ${isDark ? \'bg-[#0d1117] border-[#30363d] text-white placeholder:text-gray-500\' : \'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400\'}`}'
);

// 8. Update Terminal IP box & input
n = n.replace(
  '<div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-left">',
  '<div className={`p-4 border rounded-2xl space-y-2 text-left ${isDark ? \'bg-[#0d1117] border-[#30363d]\' : \'bg-slate-50 border-slate-200\'}`}>'
);

n = n.replace(
  'className="w-full py-2.5 pl-10 pr-3 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none text-xs font-bold focus:border-[#18ba60] focus:ring-1 focus:ring-[#18ba60] transition-all placeholder:text-slate-400"',
  'className={`w-full py-2.5 pl-10 pr-3 border rounded-xl outline-none text-xs font-bold focus:border-[#18ba60] focus:ring-1 focus:ring-[#18ba60] transition-all ${isDark ? \'bg-[#161b22] border-[#30363d] text-white placeholder:text-gray-500\' : \'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400\'}`}'
);

// 9. Update Login Card Footer
n = n.replace(
  '<div className="bg-slate-50 border-t border-slate-100 text-center flex flex-col gap-2 px-6 py-4">',
  '<div className={`border-t text-center flex flex-col gap-2 px-6 py-4 transition-colors ${isDark ? \'bg-[#0d1117] border-[#30363d]\' : \'bg-slate-50 border-slate-100\'}`}>'
);

// 10. Add iPhone Toggle Switch at bottom right of Login Page
const toggleSnippet = `
        {/* iPhone Style Theme Toggle Switch in Bottom Right */}
        <div className="fixed bottom-5 right-6 z-50 flex items-center gap-2 select-none" style={{ WebkitAppRegion: 'no-drag' }}>
          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={\`w-16 h-8 rounded-full p-1 transition-all duration-300 flex items-center relative cursor-pointer border shadow-lg \${
              isDark 
                ? 'bg-[#161b22] border-[#30363d] shadow-black/60' 
                : 'bg-slate-200 border-slate-300 shadow-slate-300/50'
            }\`}
            title={\`Switch to \${isDark ? 'Light' : 'Dark'} Mode\`}
          >
            <div className="w-full flex justify-between items-center px-1 pointer-events-none">
              <Sun size={13} className={\`transition-all duration-300 \${!isDark ? 'text-amber-500 opacity-100 scale-100' : 'opacity-30 scale-75'}\`} />
              <Moon size={13} className={\`transition-all duration-300 \${isDark ? 'text-blue-400 opacity-100 scale-100' : 'opacity-30 scale-75'}\`} />
            </div>
            <div
              className={\`absolute top-0.5 w-7 h-7 rounded-full shadow-md flex items-center justify-center transition-all duration-300 ease-out transform \${
                isDark ? 'translate-x-8 bg-[#21262d] text-blue-400 border border-[#30363d]' : 'translate-x-0 bg-white text-amber-500 border border-slate-200'
              }\`}
            >
              {isDark ? (
                <Moon size={12} strokeWidth={2.5} className="text-blue-400 fill-blue-400/20" />
              ) : (
                <Sun size={12} strokeWidth={2.5} className="text-amber-500 fill-amber-500/20" />
              )}
            </div>
          </button>
        </div>
      {renderCloseConfirmModal()}`;

n = n.replace('{renderCloseConfirmModal()}', toggleSnippet);

if (isCRLF) n = n.replace(/\n/g, '\r\n');
fs.writeFileSync(appPath, n, 'utf8');
console.log("🎉 Successfully added iPhone theme toggle switch and dark mode support to Login Page!");
