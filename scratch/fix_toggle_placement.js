const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');
const isCRLF = content.includes('\r\n');
let n = content.replace(/\r\n/g, '\n');

// 1. Remove misplaced toggle from showInitialSplash
const oldSplashBlock = `  if (showInitialSplash) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0d1117] select-none relative overflow-hidden">
        <ChatAnimationBackground />
        <InitialSplashScreen />
        
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
      {renderCloseConfirmModal()}
      </div>
    );
  }`;

const cleanSplashBlock = `  if (showInitialSplash) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0d1117] select-none relative overflow-hidden">
        <ChatAnimationBackground />
        <InitialSplashScreen />
        {renderCloseConfirmModal()}
      </div>
    );
  }`;

n = n.replace(oldSplashBlock, cleanSplashBlock);

// 2. Insert toggle switch inside Login Page block right before {renderCloseConfirmModal()}
const loginModalTarget = `      {/* Transparent Locker Dial Overlay */}
      {isTransitioningToDashboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md animate-fade-in">
          <TransitionSplashScreen username={username} />
        </div>
      )}
      {renderCloseConfirmModal()}`;

const toggleSnippet = `      {/* Transparent Locker Dial Overlay */}
      {isTransitioningToDashboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md animate-fade-in">
          <TransitionSplashScreen username={username} />
        </div>
      )}

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

if (n.includes(loginModalTarget)) {
  n = n.replace(loginModalTarget, toggleSnippet);
  console.log("✓ Successfully moved iPhone theme toggle switch to Login Page!");
} else {
  console.error("❌ Target loginModalTarget not found!");
  process.exit(1);
}

if (isCRLF) n = n.replace(/\n/g, '\r\n');
fs.writeFileSync(appPath, n, 'utf8');
console.log("🎉 Saved App.jsx!");
