const fs = require('fs');

const appPath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
let content = fs.readFileSync(appPath, 'utf8');

const regex = /let rawOptImg = o\.image_url \|\| o\.image;[\r\n\s]+if \(!rawOptImg && \(o\.item_id \|\| o\.id\)\) \{[\r\n\s]+const targetOptId = String\(o\.item_id \|\| o\.id\);[\r\n\s]+const matchedById = allCatItems\.find\(ci => String\(ci\.id\) === targetOptId\) \|\|[\r\n\s]+allMgItems\.find\(mi => String\(mi\.id\) === targetOptId\);[\r\n\s]+rawOptImg = matchedById\?\.image_url \|\| matchedById\?\.image;[\r\n\s]+\}/;

const replacement = `let rawOptImg = o.image_url || o.image;

                                    if (!rawOptImg && o.item_id) {
                                       const targetOptId = String(o.item_id);
                                       const matchedById = allCatItems.find(ci => String(ci.id) === targetOptId || String(ci.item_id) === targetOptId) ||
                                                           allMgItems.find(mi => String(mi.id) === targetOptId || String(mi.item_id) === targetOptId);
                                       rawOptImg = matchedById?.image_url || matchedById?.image;
                                    }`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(appPath, content, 'utf8');
    console.log("SUCCESS: Replaced rawOptImg matching logic in App.jsx via Regex!");
} else {
    console.log("ERROR: Regex did not match!");
}
