const fs = require('fs');
const path = require('path');

const searchPaths = [
    'C:\\Users\\Sajad\\Desktop\\18 may 6pm\\SaSLoop\\sasloop-android\\app\\src\\main\\java\\com\\example\\sasloopmanager\\ui\\BillingScreen.kt',
    'C:\\Users\\Sajad\\Desktop\\zestloop\\sasloop-android\\app\\src\\main\\java\\com\\example\\sasloopmanager\\ui\\BillingScreen.kt',
    'C:\\Users\\Sajad\\Desktop\\Zestloop old\\sasloop-android\\app\\src\\main\\java\\com\\example\\sasloopmanager\\ui\\BillingScreen.kt',
    'C:\\Users\\Sajad\\Desktop\\POS\\sasloop-android\\app\\src\\main\\java\\com\\example\\sasloopmanager\\ui\\BillingScreen.kt',
    'C:\\Users\\Sajad\\Desktop\\RestoBill\\sasloop-android\\app\\src\\main\\java\\com\\example\\sasloopmanager\\ui\\BillingScreen.kt'
];

searchPaths.forEach(p => {
    try {
        if (fs.existsSync(p)) {
            const stat = fs.statSync(p);
            console.log(`Found alternative file: ${p}`);
            console.log(`  Size: ${stat.size} bytes`);
            console.log(`  Modified: ${stat.mtime}`);
        } else {
            console.log(`Not found: ${p}`);
        }
    } catch (e) {
        console.error(`Error checking ${p}:`, e.message);
    }
});
