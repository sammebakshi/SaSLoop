const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt');
let content = fs.readFileSync(filePath, 'utf8');

// Let's parse the bottom of the file where the helper functions are.
// We can locate them by looking for:
// @Composable\nfun MenuSubTab(
// @Composable\nfun KotSubTab(
// @Composable\nfun BillingSubTab(

function extractBody(content, functionHeader) {
    const idx = content.indexOf(functionHeader);
    if (idx === -1) return null;
    
    // Find the first opening brace '{' after the header
    let openBraceIdx = content.indexOf('{', idx);
    if (openBraceIdx === -1) return null;
    
    // Find matching closing brace
    let braceCount = 1;
    let i = openBraceIdx + 1;
    while (braceCount > 0 && i < content.length) {
        if (content[i] === '{') braceCount++;
        else if (content[i] === '}') braceCount--;
        i++;
    }
    
    if (braceCount === 0) {
        // Return body content (excluding the outer braces)
        return content.slice(openBraceIdx + 1, i - 1);
    }
    return null;
}

const menuHeader = '@Composable\nfun MenuSubTab(';
const kotHeader = '@Composable\nfun KotSubTab(';
const billingHeader = '@Composable\nfun BillingSubTab(';

const menuBody = extractBody(content, menuHeader);
const kotBody = extractBody(content, kotHeader);
const billingBody = extractBody(content, billingHeader);

if (!menuBody || !kotBody || !billingBody) {
    console.error('Failed to extract helper bodies');
    process.exit(1);
}

// Now let's indent the bodies back by 28 spaces (since they were nested inside when branch)
function indent28(bodyText) {
    return bodyText.split('\n').map(line => {
        if (line.trim() === '') return '';
        return '                            ' + line;
    }).join('\n');
}

const menuCall = `                            "MENU" -> {
${indent28(menuBody.trim())}
                            }`;

const kotCall = `                            "KOT" -> {
${indent28(kotBody.trim())}
                            }`;

const billingCall = `                            "BILLING" -> {
${indent28(billingBody.trim())}
                            }`;

// Replace the calls with the original bodies in the content
// We need to find the calls first. They are:
// "MENU" -> { ... MenuSubTab( ... ) ... }
// Let's do string replacement.
content = content.replace(/ {28}"MENU" -> \{[\s\S]*?MenuSubTab\([\s\S]*?\} {28}\}/, menuCall);
content = content.replace(/ {28}"KOT" -> \{[\s\S]*?KotSubTab\([\s\S]*?\} {28}\}/, kotCall);
content = content.replace(/ {28}"BILLING" -> \{[\s\S]*?BillingSubTab\([\s\S]*?\} {28}\}/, billingCall);

// Remove the helper functions from the end of the file
const helpersStart = content.indexOf(menuHeader);
if (helpersStart !== -1) {
    content = content.slice(0, helpersStart);
}

// Remove Context import
content = content.replace('import android.content.Context\n', '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully restored BillingScreen.kt to its original state!');
