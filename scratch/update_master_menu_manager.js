const fs = require('fs');

const path = 'c:/Users/Sajad/Desktop/SaSLoop/SaSLoop-dashboard/src/pages/MasterMenuManager.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add states for menus and filters
const oldStateAnchor = `const [categories, setCategories] = useState([]);`;
const newStateAnchor = `const [categories, setCategories] = useState([]);
    const [menus, setMenus] = useState([]);
    const [selectedMenuFilter, setSelectedMenuFilter] = useState('all');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');`;

content = content.replace(oldStateAnchor, newStateAnchor);

// 2. Update fetchData and fetchMenus
const oldFetchData = `    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const freshId = getOutletId();
            const isValidId = freshId && !isNaN(freshId) && freshId !== "global";
            const url = \`\${API_BASE}/api/brand/outlet-all-items\${isValidId ? \`?outlet_id=\${freshId}\` : ''}\`;

            const res = await fetch(url, {
                headers: { "Authorization": \`Bearer \${token}\` }
            });
            const d = await res.json();
            setData(Array.isArray(d) ? d : []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };`;

const newFetchData = `    const fetchMenus = async () => {
        try {
            const token = localStorage.getItem("token");
            const freshId = getOutletId();
            const isValidId = freshId && !isNaN(freshId) && freshId !== "global";
            const url = \`\${API_BASE}/api/brand/outlet-menus\${isValidId ? \`?outlet_id=\${freshId}\` : ''}\`;
            const res = await fetch(url, {
                headers: { "Authorization": \`Bearer \${token}\` }
            });
            if (res.ok) {
                setMenus(await res.json());
            }
        } catch (e) { console.error(e); }
    };

    const fetchData = async (menuFilterOverride) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const freshId = getOutletId();
            const isValidId = freshId && !isNaN(freshId) && freshId !== "global";
            const targetMenu = menuFilterOverride !== undefined ? menuFilterOverride : selectedMenuFilter;
            let url = \`\${API_BASE}/api/brand/outlet-all-items?include_all=true\${isValidId ? \`&outlet_id=\${freshId}\` : ''}\`;
            if (targetMenu && targetMenu !== 'all') {
                url += \`&menu_id=\${targetMenu}\`;
            }

            const res = await fetch(url, {
                headers: { "Authorization": \`Bearer \${token}\` }
            });
            const d = await res.json();
            setData(Array.isArray(d) ? d : []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };`;

content = content.replace(oldFetchData, newFetchData);

// 3. Update useEffect
content = content.replace(
  `useEffect(() => { fetchData(); fetchCategories(); }, []);`,
  `useEffect(() => { fetchData(); fetchCategories(); fetchMenus(); }, []);`
);

// 4. Update Toolbar with Menu Dropdown, Category Dropdown, Status Dropdown and Search Input
const oldToolbarRegex = /<div className="px-5 py-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50\/30">[\s\S]*?<\/div>\r?\n\s*<\/div>/;

const newToolbar = `<div className="px-5 py-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/30">
                    <div className="flex items-center gap-3 flex-1 bg-white border border-slate-200 rounded-md px-3 py-2">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search items by name or code..."
                            className="bg-transparent text-[11px] font-bold text-slate-600 outline-none w-full uppercase placeholder:text-slate-300"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-3 py-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-100 pr-3">Menu</span>
                            <select
                                value={selectedMenuFilter}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSelectedMenuFilter(val);
                                    fetchData(val);
                                }}
                                className="bg-transparent text-[10px] font-bold text-indigo-600 uppercase outline-none min-w-[130px]"
                            >
                                <option value="all">All Menus (POS + Digital)</option>
                                {menus.map(m => (
                                    <option key={m.id} value={m.id}>
                                        {m.menu_name} {m.is_pos_default ? '[POS]' : m.is_digital_default || m.is_digital ? '[Digital]' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-3 py-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-100 pr-3">Category</span>
                            <select
                                value={selectedCategoryFilter}
                                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                                className="bg-transparent text-[10px] font-bold text-slate-600 uppercase outline-none min-w-[120px]"
                            >
                                <option value="all">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-3 py-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-100 pr-3">Status</span>
                            <select
                                value={selectedStatusFilter}
                                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                                className="bg-transparent text-[10px] font-bold text-slate-600 uppercase outline-none min-w-[100px]"
                            >
                                <option value="all">Status: All</option>
                                <option value="active">Active Only</option>
                                <option value="inactive">Inactive Only</option>
                            </select>
                        </div>
                        <button onClick={() => { fetchData(); fetchMenus(); }} className="p-2 hover:bg-white rounded-md text-slate-400 border border-transparent hover:border-slate-200 transition-all"><RefreshCw className={\`w-4 h-4 \${loading ? 'animate-spin' : ''}\`} /></button>
                    </div>
                </div>`;

content = content.replace(oldToolbarRegex, newToolbar);

// 5. Update data filtering in table rendering
const oldTableFilterAnchor = `) : data.length === 0 ? (`;
const newTableFilterAnchor = `) : data.filter(item => {
                                const matchesSearch = !searchTerm || (item.product_name && item.product_name.toLowerCase().includes(searchTerm.toLowerCase())) || (item.code && item.code.toLowerCase().includes(searchTerm.toLowerCase()));
                                const matchesCategory = selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;
                                const matchesStatus = selectedStatusFilter === 'all' || (selectedStatusFilter === 'active' ? item.availability : !item.availability);
                                return matchesSearch && matchesCategory && matchesStatus;
                            }).length === 0 ? (`;

content = content.replace(oldTableFilterAnchor, newTableFilterAnchor);

// 6. Update data mapping to filtered items
const oldMapAnchor = `) : data.map((item, index) => {`;
const newMapAnchor = `) : data.filter(item => {
                                const matchesSearch = !searchTerm || (item.product_name && item.product_name.toLowerCase().includes(searchTerm.toLowerCase())) || (item.code && item.code.toLowerCase().includes(searchTerm.toLowerCase()));
                                const matchesCategory = selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;
                                const matchesStatus = selectedStatusFilter === 'all' || (selectedStatusFilter === 'active' ? item.availability : !item.availability);
                                return matchesSearch && matchesCategory && matchesStatus;
                            }).map((item, index) => {`;

content = content.replace(oldMapAnchor, newMapAnchor);

// 7. Add Menu Name column header and row cell
content = content.replace(
  `<th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Outlet Name</th>`,
  `<th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Menu Source</th>`
);

content = content.replace(
  `<td className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase">-</td>`,
  `<td className="px-4 py-4 text-[11px] font-bold text-indigo-600 uppercase">
       <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[9px]">
           {item.menu_name || 'Standard Menu'}
       </span>
   </td>`
);

fs.writeFileSync(path, content, 'utf8');
console.log("SUCCESS: Updated MasterMenuManager.jsx with Menu Dropdown and filtering!");
