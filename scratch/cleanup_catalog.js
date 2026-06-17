const fs = require('fs');
const path = 'pos-app/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

let lines = content.split(/\r?\n/);
let modified = false;

// Let's find each instance of "catRes = await posService.getCatalog();"
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("catRes = await posService.getCatalog();")) {
        // Look ahead for setCatalog and setCategories
        let setCatalogIdx = -1;
        let setCategoriesIdx = -1;
        
        for (let j = i + 1; j < i + 25 && j < lines.length; j++) {
            if (lines[j].includes("setCatalog(catalogData);")) {
                setCatalogIdx = j;
            }
            if (lines[j].includes("setCategories(['All', ...new Set(catalogData.map(i => i.category).filter(Boolean))]);")) {
                setCategoriesIdx = j;
            }
        }
        
        if (setCatalogIdx !== -1 && setCategoriesIdx !== -1) {
            console.log(`Found target block starting at line ${i+1}`);
            // Let's replace from line i+1 (the mapping of catalogData) to setCategoriesIdx
            // Since catalogData is on i+1
            const countToReplace = setCategoriesIdx - (i + 1) + 1;
            
            // Check if it's the refreshBillingCatalog block (needs to close try/catch correctly)
            const isRefreshBlock = lines[i-2].includes("const refreshBillingCatalog");
            
            let replacement = [];
            if (isRefreshBlock) {
                replacement = [
                    "      const catalogData = (catRes.data || []).map(i => ({ ",
                    "        ...i, ",
                    "        stock: i.stock_count !== null ? parseInt(i.stock_count) : undefined,",
                    "        tax_applicable: !!i.tax_applicable,",
                    "        kot_category: i.kot_category || \"Main Kitchen\"",
                    "      }));",
                    "      const filteredCatalog = catalogData.filter((item, idx, self) => {",
                    "        if (item.category === 'Uncategorized') {",
                    "          const hasCategorized = self.some(other => other.product_name === item.product_name && other.category !== 'Uncategorized');",
                    "          if (hasCategorized) return false;",
                    "        }",
                    "        return true;",
                    "      });",
                    "      setCatalog(filteredCatalog);",
                    "      window.catalog = filteredCatalog;",
                    "      setCategories(['All', ...new Set(filteredCatalog.map(i => i.category).filter(c => c && c !== 'Uncategorized'))]);"
                ];
            } else {
                replacement = [
                    "      const catalogData = (catRes.data || []).map(i => ({ ",
                    "        ...i, ",
                    "        stock: i.stock_count !== null ? parseInt(i.stock_count) : undefined,",
                    "        tax_applicable: !!i.tax_applicable,",
                    "        kot_category: i.kot_category || \"Main Kitchen\"",
                    "      }));",
                    "      const filteredCatalog = catalogData.filter((item, idx, self) => {",
                    "        if (item.category === 'Uncategorized') {",
                    "          const hasCategorized = self.some(other => other.product_name === item.product_name && other.category !== 'Uncategorized');",
                    "          if (hasCategorized) return false;",
                    "        }",
                    "        return true;",
                    "      });",
                    "      setCatalog(filteredCatalog);",
                    "      window.catalog = filteredCatalog;",
                    "      setCategories(['All', ...new Set(filteredCatalog.map(i => i.category).filter(c => c && c !== 'Uncategorized'))]);",
                    "      localStorage.setItem('pos_catalog_cache', JSON.stringify(filteredCatalog));"
                ];
            }
            
            lines.splice(i + 1, countToReplace, ...replacement);
            modified = true;
            
            // Re-join and re-split to update indices since size changed
            content = lines.join('\r\n');
            lines = content.split(/\r?\n/);
            
            // Re-start search from next index
            i = i + replacement.length;
        }
    }
}

if (modified) {
    fs.writeFileSync(path, lines.join('\r\n'), 'utf8');
    console.log("App.jsx has been successfully updated!");
} else {
    console.log("No modifications were applied.");
}
