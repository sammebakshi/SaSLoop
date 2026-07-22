const fs = require('fs');
const path = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const targetRegex = /\{\/\* Totals Section \*\/\}[\r\n\s]+<\/div>[\r\n\s]+<\/div>[\r\n\s]+\{\/\* Amount in Words \*\/\}[\r\n\s]+<div className="text-\[7\.5px\] italic text-\[#8b949e\] lowercase text-left mt-2">[\r\n\s]+\{numberToWords\(3040\)\} only[\r\n\s]+<\/div>/;

const replacementStr = `{/* Totals Section */}
                                  {(() => {
                                     const previewSubtotal = 3040;
                                     const previewTaxRate = parseFloat(posSettings.taxRate !== undefined ? posSettings.taxRate : 5);
                                     const previewIsInclusive = !!posSettings.isTaxInclusive;
                                     let previewTax = 0;
                                     if (previewIsInclusive) {
                                        previewTax = previewSubtotal * (previewTaxRate / (100 + previewTaxRate));
                                     } else {
                                        previewTax = previewSubtotal * (previewTaxRate / 100);
                                     }
                                     const previewCgst = previewTax / 2;
                                     const previewSgst = previewTax / 2;
                                     const previewGrandTotal = previewIsInclusive ? previewSubtotal : (previewSubtotal + previewTax);
                                     const dec = posSettings.decimalPlaces || 2;
                                     const curr = posSettings.currency || 'Rs';

                                     return (
                                        <>
                                           <div className="flex flex-col items-end text-[8.5px] space-y-0.5">
                                              <div className="flex justify-between w-full font-bold">
                                                 <span className="text-right flex-1 pr-2">Amount:</span>
                                                 <span className="w-24 text-right">{curr} {previewSubtotal.toFixed(dec)}</span>
                                              </div>
                                              {!posSettings.hideTaxOnBill && previewTaxRate > 0 && (
                                                 <>
                                                    <div className="flex justify-between w-full text-[#8b949e]">
                                                       <span className="text-right flex-1 pr-2">{posSettings.taxName || 'GST'}:</span>
                                                       <span className="w-24 text-right">({previewTaxRate.toFixed(1)}%)</span>
                                                    </div>
                                                    <div className="flex justify-between w-full font-bold">
                                                       <span className="text-right flex-1 pr-2">CGST({(previewTaxRate / 2).toFixed(1)}%):</span>
                                                       <span className="w-24 text-right">{curr} {previewCgst.toFixed(dec)}</span>
                                                    </div>
                                                    <div className="flex justify-between w-full font-bold">
                                                       <span className="text-right flex-1 pr-2">SGST({(previewTaxRate / 2).toFixed(1)}%):</span>
                                                       <span className="w-24 text-right">{curr} {previewSgst.toFixed(dec)}</span>
                                                    </div>
                                                 </>
                                              )}
                                              <div className="flex justify-between w-full font-black text-[10px] text-inherit border-t border-dotted border-gray-400/30 pt-1 mt-1">
                                                 <span className="text-right flex-1 pr-2">Grand Total:</span>
                                                 <span className="w-24 text-right">{curr} {previewGrandTotal.toFixed(dec)}</span>
                                              </div>
                                           </div>

                                           {/* Amount in Words */}
                                           <div className="text-[7.5px] italic text-[#8b949e] lowercase text-left mt-2">
                                              {numberToWords(previewGrandTotal)} only
                                           </div>
                                        </>
                                     );
                                  })()}`;

if (!targetRegex.test(content)) {
  console.log("Regex match failed!");
} else {
  content = content.replace(targetRegex, replacementStr);
  fs.writeFileSync(path, content, 'utf8');
  console.log("SUCCESSFULLY REPLACED!");
}
