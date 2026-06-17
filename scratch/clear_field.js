const { execSync } = require('child_process');

try {
  console.log("Tapping field...");
  execSync('adb shell input tap 300 1378');
  
  console.log("Sending delete keys...");
  for (let i = 0; i < 200; i++) {
    execSync('adb shell input keyevent 67');
  }
  
  console.log("Typing number...");
  execSync('adb shell input text 9999999999');
  
  console.log("Tapping customer name to trigger match...");
  execSync('adb shell input tap 626 1378');
  
  console.log("Done!");
} catch (e) {
  console.error(e);
}
