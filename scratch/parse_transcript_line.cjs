const fs = require('fs');

const lineFile = 'c:/Users/Sajad/Desktop/SaSLoop/scratch/transcript_line_1189.json';
if (!fs.existsSync(lineFile)) {
  console.log("File does not exist");
  process.exit(1);
}

const lineContent = fs.readFileSync(lineFile, 'utf8');
console.log("Line file length:", lineContent.length);

try {
  const data = JSON.parse(lineContent);
  console.log("Keys in JSON line:", Object.keys(data));
  console.log("Type:", data.type, "Status:", data.status);
  
  // If it contains tool calls, let's extract the tool call
  if (data.tool_calls) {
    console.log("Number of tool calls:", data.tool_calls.length);
    const tc = data.tool_calls[0];
    console.log("Tool call name:", tc.name);
    if (tc.args && tc.args.ReplacementContent) {
      console.log("Found ReplacementContent!");
      const code = tc.args.ReplacementContent;
      console.log("Code length:", code.length);
      fs.writeFileSync('c:/Users/Sajad/Desktop/SaSLoop/scratch/recovered_dial_final.jsx', code, 'utf8');
      console.log("Saved recovered_dial_final.jsx!");
    } else if (tc.args && tc.args.ReplacementChunks) {
      console.log("Found ReplacementChunks!");
      // Let's parse the chunks if it's a string, or it is already an object
      const chunks = typeof tc.args.ReplacementChunks === 'string' ? JSON.parse(tc.args.ReplacementChunks) : tc.args.ReplacementChunks;
      console.log("Number of chunks:", chunks.length);
      chunks.forEach((chunk, i) => {
        console.log(`Chunk ${i+1} TargetContent length:`, chunk.TargetContent ? chunk.TargetContent.length : 0);
        console.log(`Chunk ${i+1} ReplacementContent length:`, chunk.ReplacementContent ? chunk.ReplacementContent.length : 0);
        fs.writeFileSync(`c:/Users/Sajad/Desktop/SaSLoop/scratch/recovered_dial_chunk_${i+1}.jsx`, chunk.ReplacementContent, 'utf8');
        console.log(`Saved recovered_dial_chunk_${i+1}.jsx`);
      });
    } else {
      console.log("No ReplacementContent or ReplacementChunks in tool call args.");
    }
  } else if (data.content) {
    console.log("No tool calls, but has content. Let's see if it contains the code.");
    // search for code blocks
    const match = data.content.match(/```(jsx|javascript)?([\s\S]*?)```/);
    if (match) {
      console.log("Found markdown code block!");
      fs.writeFileSync('c:/Users/Sajad/Desktop/SaSLoop/scratch/recovered_dial_markdown.jsx', match[2], 'utf8');
      console.log("Saved recovered_dial_markdown.jsx!");
    } else {
      console.log("No markdown code block found.");
    }
  }
} catch (e) {
  console.error("JSON parse failed:", e);
}
