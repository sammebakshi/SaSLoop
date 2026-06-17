const fs = require('fs');
const filePath = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\sasloop-android\\app\\src\\main\\java\\com\\example\\sasloopmanager\\ui\\BillingScreen.kt';
const buffer = fs.readFileSync(filePath);
console.log('First 10 bytes:', buffer.slice(0, 10));
// Check if UTF-16 LE
if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
    console.log('UTF-16 LE detected');
    const content = buffer.toString('utf16le');
    console.log('Converted content length:', content.length);
    console.log('Does it contain MenuItemCard?', content.includes('MenuItemCard'));
    console.log('Does it contain @Composable?', content.includes('@Composable'));
} else {
    console.log('Not UTF-16 LE BOM');
    const content = buffer.toString('utf8');
    console.log('Does it contain MenuItemCard?', content.includes('MenuItemCard'));
    console.log('Does it contain @Composable?', content.includes('@Composable'));
}
