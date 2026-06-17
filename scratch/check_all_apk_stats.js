const fs = require('fs');
const paths = [
    'SaSLoop-dashboard/build/sasloop-android.apk',
    'SaSLoop-dashboard/public/sasloop-android.apk',
    'sasloop-android.apk'
];

paths.forEach(p => {
    try {
        if (fs.existsSync(p)) {
            const stats = fs.statSync(p);
            console.log(`APK: ${p}`);
            console.log(`  Size: ${stats.size} bytes`);
            console.log(`  Modified: ${stats.mtime}`);
        } else {
            console.log(`APK: ${p} does not exist`);
        }
    } catch (e) {
        console.error(`Error checking ${p}:`, e.message);
    }
});
