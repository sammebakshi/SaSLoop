const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');
const isCRLF = content.includes('\r\n');
let n = content.replace(/\r\n/g, '\n');

// 1. Elevate z-index of renderCloseConfirmModal to z-[99999]
n = n.replace(
  '<div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">',
  '<div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">'
);

// 2. Remove isolated {renderCloseConfirmModal()} calls from inner returns
n = n.replace('<InitialSplashScreen />\n        {renderCloseConfirmModal()}', '<InitialSplashScreen />');
n = n.replace('</AnimatePresence>\n            {renderCloseConfirmModal()}', '</AnimatePresence>');
n = n.replace('{renderCloseConfirmModal()}\n\n        {logoutModalStep === \'confirm\'', '{logoutModalStep === \'confirm\'');

// 3. Transform 3 separate if returns into 1 single Fragment return
const oldSplashStart = '  if (showInitialSplash) {\n    return (';
const oldLoginStart = '  if (!isAuthenticated) {\n    return (';
const oldMainStart = '  return (\n    <div className={`h-screen w-full flex font-sans overflow-hidden ${theme} ${t.bg} ${t.textPrimary}`}>';

if (n.includes(oldSplashStart) && n.includes(oldLoginStart) && n.includes(oldMainStart)) {
  // Replace splash return
  n = n.replace(
    '  if (showInitialSplash) {\n    return (\n      <div className="h-screen w-screen flex items-center justify-center bg-[#0d1117] select-none relative overflow-hidden">\n        <ChatAnimationBackground />\n        <InitialSplashScreen />\n      </div>\n    );\n  }',
    '  /* Splash View */'
  );

  // Replace login return start and main return start
  n = n.replace(
    '  if (!isAuthenticated) {\n    return (\n      <div className="h-screen flex flex-col font-sans bg-slate-50 relative select-none">',
    '  return (\n    <>\n      {renderCloseConfirmModal()}\n      {showInitialSplash ? (\n        <div className="h-screen w-screen flex items-center justify-center bg-[#0d1117] select-none relative overflow-hidden">\n          <ChatAnimationBackground />\n          <InitialSplashScreen />\n        </div>\n      ) : !isAuthenticated ? (\n        <div className="h-screen flex flex-col font-sans bg-slate-50 relative select-none">'
  );

  n = n.replace(
    '         </div>\n      );\n   }\n\n   return (\n     <div className={`h-screen w-full flex font-sans overflow-hidden ${theme} ${t.bg} ${t.textPrimary}`}>',
    '         </div>\n      ) : ('
  );

  // Close the fragment at the end of App component
  const endMarker = '    </div>\n  );\n}\n\nexport default App;';
  n = n.replace(endMarker, '    </div>\n      )}\n    </>\n  );\n}\n\nexport default App;');

  console.log("✓ Successfully unified App component returns into top-level Fragment!");
} else {
  console.error("❌ Mismatch in App return targets:", {
    splash: n.includes(oldSplashStart),
    login: n.includes(oldLoginStart),
    main: n.includes(oldMainStart)
  });
  process.exit(1);
}

if (isCRLF) n = n.replace(/\n/g, '\r\n');
fs.writeFileSync(appPath, n, 'utf8');
console.log("🎉 File saved successfully!");
