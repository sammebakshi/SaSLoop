const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

// We verify that lines[19609] matches "<span className=\"text-[9px] text-gray-500 font-mono\">"
const line19609 = lines[19609].trim();
if (line19609 === '<span className="text-[9px] text-gray-500 font-mono">') {
  console.log("Verified lines at indices! Applying replacement...");
  
  const replacement = `                           <span className="text-[9px] text-gray-500 font-mono block">
                              Est. Points: {previewReceipt.points_earned !== undefined ? previewReceipt.points_earned : Math.floor((previewReceipt.total_price || 0) * 0.05)} PTS
                           </span>
                           {previewReceipt.points_redeemed > 0 && (
                              <span className="text-[9px] text-amber-500 font-bold font-mono block">
                                 Redeemed: {previewReceipt.points_redeemed} PTS
                              </span>
                           )}`;
                           
  // Replace from index 19609 to 19616 (inclusive, which is 8 elements)
  lines.splice(19609, 8, replacement);
  fs.writeFileSync(filePath, lines.join('\r\n'), 'utf8');
  console.log("Successfully patched App.jsx!");
} else {
  console.log("Failed verification! Found:", line19609);
}
