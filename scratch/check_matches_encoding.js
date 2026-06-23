const fs = require('fs');
const matchesPath = 'c:/Users/Sajad/Desktop/SaSLoop/scratch/matches.txt';

if (!fs.existsSync(matchesPath)) {
  console.log("Not found");
  process.exit(1);
}

const buffer = fs.readFileSync(matchesPath);
console.log(`Buffer length: ${buffer.length}`);
console.log(`BOM check: ${buffer[0].toString(16)} ${buffer[1].toString(16)}`);

const contentUtf16 = buffer.toString('utf16le');
if (contentUtf16.includes('dial-spin-sequence')) {
  console.log("Found in utf16le string!");
  fs.writeFileSync('c:/Users/Sajad/Desktop/SaSLoop/scratch/matches_utf8.txt', contentUtf16, 'utf8');
} else {
  const contentUtf8 = buffer.toString('utf8');
  if (contentUtf8.includes('dial-spin-sequence')) {
    console.log("Found in utf8 string!");
  } else {
    console.log("Not found in either encoding!");
  }
}
