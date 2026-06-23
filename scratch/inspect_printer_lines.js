const fs = require('fs');
const path = require('path');

const targetLines = [1027, 1056, 1094, 1148, 1450, 1604, 3816, 3823, 3920];

targetLines.forEach(lineNum => {
  const file = `transcript_printer_line_${lineNum}.json`;
  const filePath = path.join('c:/Users/Sajad/Desktop/SaSLoop/scratch', file);
  if (!fs.existsSync(filePath)) return;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`\n================= LINE ${lineNum} (Type: ${data.type}) =================`);
  if (data.content) {
    console.log(data.content.slice(0, 1000));
  } else if (data.tool_calls) {
    console.log("Tool Calls:", JSON.stringify(data.tool_calls, null, 2).slice(0, 1500));
  }
});
