const fs = require('fs');
const path = require('path');

const fileA = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const fileB = path.join(__dirname, 'App_reconstructed.jsx');

if (!fs.existsSync(fileA) || !fs.existsSync(fileB)) {
  console.log('One of the files does not exist');
  process.exit(1);
}

const read = (p) => {
  const buf = fs.readFileSync(p);
  let content = buf.toString('utf16le');
  if (!content.includes('import') && !content.includes('function')) {
    content = buf.toString('utf8');
  }
  return content;
};

const contentA = read(fileA);
const contentB = read(fileB);

console.log('App.jsx size:', contentA.length, 'chars');
console.log('App_reconstructed.jsx size:', contentB.length, 'chars');

// Compare mergeCartItems function
console.log('\n--- mergeCartItems function ---');
console.log('Current has mergeCartItems:', contentA.includes('mergeCartItems'));
console.log('Yesterday has mergeCartItems:', contentB.includes('mergeCartItems'));

// Compare support phone number
console.log('\n--- Support Phone Number ---');
console.log('Current phone number occurrences:');
console.log('  8484089744:', contentA.includes('8484089744'));
console.log('  8494089744:', contentA.includes('8494089744'));
console.log('Yesterday phone number occurrences:');
console.log('  8484089744:', contentB.includes('8484089744'));
console.log('  8494089744:', contentB.includes('8494089744'));

// Compare Sidebar Logo
console.log('\n--- Sidebar Logo ---');
console.log('Current has logo.png in nav:', contentA.includes('logo.png') && contentA.indexOf('<nav') > -1 && contentA.substring(contentA.indexOf('<nav'), contentA.indexOf('<nav') + 500).includes('logo.png'));
console.log('Yesterday has logo.png in nav:', contentB.includes('logo.png') && contentB.indexOf('<nav') > -1 && contentB.substring(contentB.indexOf('<nav'), contentB.indexOf('<nav') + 500).includes('logo.png'));

// Compare FilePlus icon in Customer Info Header
console.log('\n--- FilePlus in Customer Info Header ---');
console.log('Current has FilePlus:', contentA.includes('FilePlus'));
console.log('Yesterday has FilePlus:', contentB.includes('FilePlus'));

// Compare sub-tabs visibility logic
console.log('\n--- Sub-tabs rendering block ---');
const getSubtabs = (content) => {
  const idx = content.indexOf('Order/KOT');
  if (idx === -1) return 'Not found';
  return content.substring(idx - 150, idx + 600);
};
console.log('Current subtabs block:\n', getSubtabs(contentA));
console.log('\nYesterday subtabs block:\n', getSubtabs(contentB));
