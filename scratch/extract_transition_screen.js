const fs = require('fs');

const content = fs.readFileSync("scratch/App_e217906.jsx", "utf-8");
const lines = content.split(/\r?\n/);
const selectedLines = lines.slice(269, 410).join("\n");
fs.writeFileSync("scratch/TransitionSplashScreen_e217906.txt", selectedLines, "utf-8");
console.log("Wrote TransitionSplashScreen code to scratch/TransitionSplashScreen_e217906.txt");
