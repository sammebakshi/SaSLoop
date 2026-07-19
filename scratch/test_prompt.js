const { execSync } = require('child_process');

try {
  const message = "Enter Manager PIN to authorize table transfer:";
  const defaultValue = "";
  const escapedMessage = (message || "").replace(/'/g, "''");
  const escapedDefault = (defaultValue || "").replace(/'/g, "''");
  
  const psCommand = `[void][System.Reflection.Assembly]::LoadWithPartialName('Microsoft.VisualBasic'); [Microsoft.VisualBasic.Interaction]::InputBox('${escapedMessage}', 'SaSLoop POS Authorization', '${escapedDefault}')`;
  
  console.log("Launching prompt...");
  const result = execSync(`powershell -Command "${psCommand}"`, { encoding: 'utf8', windowsHide: true }).trim();
  console.log("Result received:", result);
} catch (e) {
  console.error("Error launching prompt:", e);
}
