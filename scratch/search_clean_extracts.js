const fs = require('fs');
const content = fs.readFileSync('scratch/clean_extracts_output.txt', 'utf16le');
const query = process.argv[2] || '';
console.log(`Searching for: ${query}`);
if (!query) {
  console.log('Provide a query as an argument.');
  process.exit(1);
}

// Split content by search term headers or matches
const matches = content.split(/={5,}\s+SEARCH TERM:\s+/i);
for (const match of matches) {
  if (match.toLowerCase().includes(query.toLowerCase())) {
    console.log('=========================================');
    console.log(match.substring(0, 4000));
  }
}
