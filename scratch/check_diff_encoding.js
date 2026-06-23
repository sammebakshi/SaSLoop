const fs = require('fs');
const diffPath = 'c:/Users/Sajad/Desktop/SaSLoop/scratch/diff_checkpoints.diff';

if (!fs.existsSync(diffPath)) {
  console.log("Not found");
  process.exit(1);
}

const buffer = fs.readFileSync(diffPath);
console.log(`Buffer length: ${buffer.length}`);
console.log(`BOM check: ${buffer[0].toString(16)} ${buffer[1].toString(16)}`);

// Let's check the first 200 characters in string format
const content = buffer.toString('utf16le');
if (content.includes('TransitionSplashScreen')) {
  console.log("Found in utf16le string!");
  // Write a UTF-8 version of the file
  fs.writeFileSync('c:/Users/Sajad/Desktop/SaSLoop/scratch/diff_checkpoints_utf8.diff', content, 'utf8');
  console.log("Wrote UTF-8 diff file.");
} else {
  const contentUtf8 = buffer.toString('utf8');
  if (contentUtf8.includes('TransitionSplashScreen')) {
    console.log("Found in utf8 string!");
  } else {
    console.log("Not found in either encoding!");
  }
}
