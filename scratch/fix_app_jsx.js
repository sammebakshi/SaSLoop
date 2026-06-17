const fs = require('fs');
const path = require('path');

const appJsxPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
let content = fs.readFileSync(appJsxPath, 'utf8');

// Target the specific area after "Right Margin" settings inside "5. Print Margins & Width"
const target = `                                             <button
                                                type="button"
                                                onClick={() => setPosSettings(prev => ({ ...prev, printMarginRight: Math.min(30, (prev.printMarginRight || 0) + 1) }))}
                                                className={\`w-7 h-7 rounded-lg flex items-center justify-center font-black transition-colors \${isDark ? 'hover:bg-slate-800 text-white' : 'hover:bg-slate-100 text-slate-800'}\`}
                                             >
                                                +
                                             </button>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                          </div>
                                       </>
                                    )}
                                 </div>
                              </div>

                              {/* Right Column: Live Receipt Layout Preview */}`;

const replacement = `                                             <button
                                                type="button"
                                                onClick={() => setPosSettings(prev => ({ ...prev, printMarginRight: Math.min(30, (prev.printMarginRight || 0) + 1) }))}
                                                className={\`w-7 h-7 rounded-lg flex items-center justify-center font-black transition-colors \${isDark ? 'hover:bg-slate-800 text-white' : 'hover:bg-slate-100 text-slate-800'}\`}
                                             >
                                                +
                                             </button>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              {/* Right Column: Live Receipt Layout Preview */}`;

// Let's do a normalization of line endings to find it
const normalizedContent = content.replace(/\r\n/g, '\n');
const normalizedTarget = target.replace(/\r\n/g, '\n');
const normalizedReplacement = replacement.replace(/\r\n/g, '\n');

if (normalizedContent.includes(normalizedTarget)) {
    const updated = normalizedContent.replace(normalizedTarget, normalizedReplacement);
    // Keep original line endings if there are any, otherwise use LF
    const finalContent = content.includes('\r\n') ? updated.replace(/\n/g, '\r\n') : updated;
    fs.writeFileSync(appJsxPath, finalContent, 'utf8');
    console.log("Successfully replaced the leftover JSX tags!");
} else {
    console.error("Target content not found in App.jsx!");
}
