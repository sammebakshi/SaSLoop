const fs = require('fs');

const matchesPath = 'c:/Users/Sajad/Desktop/SaSLoop/scratch/matches.txt';
if (!fs.existsSync(matchesPath)) {
  console.log("matches.txt does not exist");
  process.exit(1);
}

const buffer = fs.readFileSync(matchesPath);
let content = '';
if (buffer[0] === 0xff && buffer[1] === 0xfe) {
  content = buffer.toString('utf16le');
} else {
  content = buffer.toString('utf8');
}

console.log("matches.txt total length (decoded):", content.length);

// Let's find "metallicSteel" in matches.txt
let idx = 0;
let occurrences = [];
while (true) {
  idx = content.indexOf('metallicSteel', idx);
  if (idx === -1) break;
  occurrences.push(idx);
  idx += 'metallicSteel'.length;
}

console.log("Number of occurrences of metallicSteel in matches.txt:", occurrences.length);

occurrences.forEach((pos, index) => {
  console.log(`Occurrence ${index + 1} at position ${pos}`);
  // Let's look backward for "const TransitionSplashScreen"
  let startIdx = content.lastIndexOf('const TransitionSplashScreen =', pos);
  if (startIdx === -1) startIdx = content.lastIndexOf('TransitionSplashScreen =', pos);
  
  // Let's look forward for the end of the JSON or function (e.g. next tool call or ReplacementContent end)
  // Let's look for "ReplacementContent" or "AllowMultiple" or next chunk or similar
  let endIdx = content.indexOf('","StartLine":', pos);
  if (endIdx === -1) endIdx = pos + 5000;
  
  console.log(`Guessed start: ${startIdx}, end: ${endIdx}`);
  if (startIdx !== -1) {
    const chunk = content.slice(startIdx, endIdx);
    console.log(`Chunk length: ${chunk.length}`);
    console.log("Chunk contains '<truncated'?", chunk.includes('<truncated'));
    fs.writeFileSync(`c:/Users/Sajad/Desktop/SaSLoop/scratch/recovered_chunk_${index + 1}.txt`, chunk, 'utf8');
    console.log(`Saved recovered_chunk_${index + 1}.txt`);
  }
});
