const fs = require('fs');
const path = require('path');

const target = 'c:/Users/Sajad/Desktop/SaSLoop/scratch/recovered_dial_final.jsx';
if (!fs.existsSync(target)) {
  console.error("File does not exist!");
  process.exit(1);
}

let code = fs.readFileSync(target, 'utf8');

// If the code is enclosed in double quotes (as a JS string literal)
if (code.trim().startsWith('"')) {
  const firstQuote = code.indexOf('"');
  const lastQuote = code.lastIndexOf('"');
  if (firstQuote !== -1 && lastQuote > firstQuote) {
    let raw = code.substring(firstQuote + 1, lastQuote);
    // Unescape escapes properly by using JSON.parse on the quoted portion
    try {
      // JSON requires double quotes. If there are unescaped double quotes, let's wrap it in JSON format safely.
      // But since it is a JS string representation, we can parse it by writing a temp JSON file or using eval.
      // Eval is safe here since we are local.
      const evaluated = eval('(' + code + ')');
      fs.writeFileSync('c:/Users/Sajad/Desktop/SaSLoop/scratch/dial_clean.jsx', evaluated, 'utf8');
      console.log("Successfully wrote dial_clean.jsx using eval");
      process.exit(0);
    } catch (e) {
      console.error("Eval failed, trying manual replacement:", e);
      raw = raw.replace(/\\n/g, '\n')
               .replace(/\\"/g, '"')
               .replace(/\\'/g, "'")
               .replace(/\\\\/g, '\\')
               .replace(/\\t/g, '\t');
      fs.writeFileSync('c:/Users/Sajad/Desktop/SaSLoop/scratch/dial_clean.jsx', raw, 'utf8');
      console.log("Successfully wrote dial_clean.jsx using manual replace");
      process.exit(0);
    }
  }
}

fs.writeFileSync('c:/Users/Sajad/Desktop/SaSLoop/scratch/dial_clean.jsx', code, 'utf8');
console.log("Wrote code directly.");
