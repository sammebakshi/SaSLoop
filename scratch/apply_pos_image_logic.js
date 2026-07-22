const fs = require('fs');

const appPath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
let content = fs.readFileSync(appPath, 'utf8');

const targetOld = `                                    let rawOptImg = o.image_url || o.image;

                                    if (!rawOptImg && (o.item_id || o.id)) {
                                       const targetOptId = String(o.item_id || o.id);
                                       const matchedById = allCatItems.find(ci => String(ci.id) === targetOptId) ||
                                                           allMgItems.find(mi => String(mi.id) === targetOptId);
                                       rawOptImg = matchedById?.image_url || matchedById?.image;
                                    }`;

const targetNew = `                                    let rawOptImg = o.image_url || o.image;

                                    if (!rawOptImg && o.item_id) {
                                       const targetOptId = String(o.item_id);
                                       const matchedById = allCatItems.find(ci => String(ci.id) === targetOptId || String(ci.item_id) === targetOptId) ||
                                                           allMgItems.find(mi => String(mi.id) === targetOptId || String(mi.item_id) === targetOptId);
                                       rawOptImg = matchedById?.image_url || matchedById?.image;
                                    }`;

if (content.includes(targetOld)) {
    content = content.replace(targetOld, targetNew);
    fs.writeFileSync(appPath, content, 'utf8');
    console.log("SUCCESS: Replaced rawOptImg matching logic in App.jsx!");
} else {
    console.log("WARNING: Could not match exact block in App.jsx!");
}
