const fs = require('fs');

const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/scratch/extracted_step_1171.txt';
if (!fs.existsSync(filePath)) {
  console.log("File does not exist");
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');
console.log("File length:", content.length);
console.log("Contains '<truncated'?", content.includes('<truncated'));

// Let's try parsing it as JSON to see if it's complete
try {
  const jsonObj = JSON.parse(content);
  console.log("Successfully parsed JSON!");
  
  // If it's a tool call JSON, let's find the replacement content
  if (jsonObj.tool_calls) {
    const chunk = jsonObj.tool_calls[0].args.ReplacementChunks;
    const parsedChunks = JSON.parse(chunk);
    const replacement = parsedChunks[0].ReplacementContent;
    console.log("Replacement length:", replacement.length);
    fs.writeFileSync('c:/Users/Sajad/Desktop/SaSLoop/scratch/recovered_dial_1171.jsx', replacement, 'utf8');
    console.log("Saved recovered code from 1171!");
  } else {
    // maybe it has a different structure
    console.log("Keys:", Object.keys(jsonObj));
  }
} catch (e) {
  console.log("JSON parsing failed:", e.message);
  // Let's print around the error or search for matching lines
}
