const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/\r\n/g, '\n');

const findTarget = `                  <button
                     onClick={() => setShift(prev => ({ ...prev, status: 'STARTED', startTime: new Date().toISOString() }))}
                     className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase text-sm tracking-widest shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                     Start Day Operation`;

const replaceTarget = `                  <button
                     onClick={() => {
                        if (!checkMasterPermission('MasterManagement.AccountOld', 'close_day')) {
                           toast.error("You do not have permission to close/start day.");
                           return;
                        }
                        setShift(prev => ({ ...prev, status: 'STARTED', startTime: new Date().toISOString() }));
                     }}
                     className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase text-sm tracking-widest shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                     Start Day Operation`;

if (content.includes(findTarget)) {
  content = content.replace(findTarget, replaceTarget);
  console.log("Success replacing start day button!");
} else {
  console.error("Failed to find target start day button!");
}

const findReportClick = `                                  <button
                                     key={item.name}
                                     onClick={() => setSelectedReport(item.name)}
                                     className={\`w-full flex items-center gap-3 px-4 py-3.5 text-xs font-bold uppercase rounded-xl transition-all \${`;

const replaceReportClick = `                                  <button
                                     key={item.name}
                                     onClick={() => handleSelectReport(item.name)}
                                     className={\`w-full flex items-center gap-3 px-4 py-3.5 text-xs font-bold uppercase rounded-xl transition-all \${`;

// Let's do exact search for report button click
const findReportClickSimple = `                                     onClick={() => setSelectedReport(item.name)}`;
const replaceReportClickSimple = `                                     onClick={() => handleSelectReport(item.name)}`;

if (content.includes(findReportClickSimple)) {
  content = content.replace(findReportClickSimple, replaceReportClickSimple);
  console.log("Success replacing report click callback!");
} else {
  console.error("Failed to find report click callback!");
}

fs.writeFileSync(filePath, content, 'utf8');
