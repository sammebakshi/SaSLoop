const fs = require('fs');

const posAppPath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
let posContent = fs.readFileSync(posAppPath, 'utf8');

const optImgRegex = /if \(!rawOptImg && \(o\.item_id \|\| o\.id\)\) \{[\r\n\s]+const targetOptId = String\(o\.item_id \|\| o\.id\);[\r\n\s]+const matchedById = allCatItems\.find\(ci => String\(ci\.id\) === targetOptId\) \|\|[\r\n\s]+allMgItems\.find\(mi => String\(mi\.id\) === targetOptId\);[\r\n\s]+rawOptImg = matchedById\?\.image_url \|\| matchedById\?\.image;[\r\n\s]+\}/;

const newOptImgBlock = `if (!rawOptImg && o.item_id) {
                                        const targetOptId = String(o.item_id);
                                        const matchedById = allCatItems.find(ci => String(ci.id) === targetOptId) ||
                                                            allMgItems.find(mi => String(mi.id) === targetOptId);
                                        rawOptImg = matchedById?.image_url || matchedById?.image;
                                     }`;

if (optImgRegex.test(posContent)) {
  posContent = posContent.replace(optImgRegex, newOptImgBlock);
  fs.writeFileSync(posAppPath, posContent, 'utf8');
  console.log("SUCCESS: Replaced option image matching logic in App.jsx!");
} else {
  console.log("WARNING: Regex for App.jsx failed to match!");
}
