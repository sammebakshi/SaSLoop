const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add Shield to imports
const importTarget = `  ShoppingCart, History,`;
const importReplacement = `  Shield, ShoppingCart, History,`;

if (!content.includes(importTarget)) {
  // Try clean strings
  const cleanContent = content.replace(/\r\n/g, '\n');
  const cleanImportTarget = `  ShoppingCart, History,`;
  if (cleanContent.includes(cleanImportTarget)) {
    content = cleanContent.replace(cleanImportTarget, `  Shield, ShoppingCart, History,`).replace(/\n/g, '\r\n');
    console.log("Shield imported successfully via clean replace.");
  } else {
    console.error("Could not find ShoppingCart import in App.jsx!");
    process.exit(1);
  }
} else {
  content = content.replace(importTarget, importReplacement);
  console.log("Shield imported successfully.");
}

// 2. Replace Logo
const logoTarget = `<SaSLoopLogo />
                 SaSTech <span className="text-[#18ba60]">POS</span>`;
const logoReplacement = `<img src="/logo.png" alt="SaSLoop Logo" className="w-9 h-9 object-contain mr-1 bg-white rounded-full p-1" />
                 SaSLoop <span className="text-[#18ba60]">POS</span>`;

const cleanContent2 = content.replace(/\r\n/g, '\n');
const cleanLogoTarget = logoTarget.replace(/\r\n/g, '\n');

if (!cleanContent2.includes(cleanLogoTarget)) {
  console.error("SaSLoopLogo target not found!");
  process.exit(1);
} else {
  content = cleanContent2.replace(cleanLogoTarget, logoReplacement.replace(/\r\n/g, '\n')).replace(/\n/g, '\r\n');
  console.log("Logo replaced successfully.");
}

// 3. Replace the form titles
const formTitleTarget = `<h2 className="text-xl font-bold text-slate-800">Terminal Access</h2>
              <p className="text-[11px] text-slate-500 mt-1 font-semibold uppercase tracking-widest">Authorized Personnel Only</p>`;
const formTitleReplacement = `<h2 className="text-xl font-bold text-slate-800">SaSLoop POS</h2>
              <p className="text-[11px] text-slate-500 mt-1 font-semibold uppercase tracking-widest">Terminal Access</p>`;

const cleanTitleTarget = formTitleTarget.replace(/\r\n/g, '\n');
const cleanContent3 = content.replace(/\r\n/g, '\n');

if (!cleanContent3.includes(cleanTitleTarget)) {
  console.error("Form title target not found!");
  process.exit(1);
} else {
  content = cleanContent3.replace(cleanTitleTarget, formTitleReplacement.replace(/\r\n/g, '\n')).replace(/\n/g, '\r\n');
  console.log("Form titles replaced successfully.");
}

// 4. Replace placeholders
const userPlaceholderTarget = `placeholder="Operator ID or Username"`;
const userPlaceholderReplacement = `placeholder="Email or Username"`;
content = content.replace(userPlaceholderTarget, userPlaceholderReplacement);

const passPlaceholderTarget = `placeholder="Passcode"`;
const passPlaceholderReplacement = `placeholder="Password"`;
content = content.replace(passPlaceholderTarget, passPlaceholderReplacement);
console.log("Placeholders replaced successfully.");

// 5. Replace Submit Button Text
const buttonTarget = `START TERMINAL`;
const buttonReplacement = `SIGN IN`;
content = content.replace(buttonTarget, buttonReplacement);
console.log("Button text replaced successfully.");

// 6. Replace Footer
const footerTarget = `<div className="bg-slate-50 border-t border-slate-100 text-center flex justify-between items-center px-6 py-4">
              <p className="text-[10px] text-slate-500 font-bold">
                SaSTech POS v7.3.128
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold">
                 <WifiOff size={10} className="rotate-180"/> Offline-First Ready
              </div>
          </div>`;

const footerReplacement = `<div className="bg-slate-50 border-t border-slate-100 text-center flex justify-between items-center px-6 py-4">
              <p className="text-[10px] text-slate-500 font-bold">
                SaSLoop POS v1.0.1
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold">
                 <Shield size={10} /> Secure Connection
              </div>
          </div>`;

const cleanFooterTarget = footerTarget.replace(/\r\n/g, '\n');
const cleanContent4 = content.replace(/\r\n/g, '\n');

if (!cleanContent4.includes(cleanFooterTarget)) {
  console.error("Footer target not found!");
  process.exit(1);
} else {
  content = cleanContent4.replace(cleanFooterTarget, footerReplacement.replace(/\r\n/g, '\n')).replace(/\n/g, '\r\n');
  console.log("Footer replaced successfully.");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("POS Login UI successfully updated to match Backoffice style.");
