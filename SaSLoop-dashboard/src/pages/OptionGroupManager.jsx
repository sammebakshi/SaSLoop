import React, { useState, useEffect } from "react";
import { Plus, ListTree, Trash2, Search, RefreshCw, Filter, Edit3, Settings2, XCircle, ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft, Minus } from "lucide-react";
import { createPortal } from "react-dom";
import API_BASE from "../config";

const OptionGroupManager = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentGroupId, setCurrentGroupId] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        min_selectable: 1,
        max_selectable: 1,
        is_addon: false,
        is_active: true,
        menu_id: '',
        category_ids: [],
        sorting: 0,
        description: '',
        select_all_items: false,
        linked_main_items: [] // To store selected main items (Type 0)
    });

    // Dual List Box states (For Options - Type 1)
    const [availableOptions, setAvailableOptions] = useState([]);
    const [associatedOptions, setAssociatedOptions] = useState([]);
    const [selectedAvailable, setSelectedAvailable] = useState([]);
    const [selectedAssociated, setSelectedAssociated] = useState([]);

    // Search states for transfer lists
    const [availableSearch, setAvailableSearch] = useState('');
    const [associatedSearch, setAssociatedSearch] = useState('');

    // Data for dropdowns
    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allItems, setAllItems] = useState([]);
    
    // Filtered lists for the flow
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [filteredMainItems, setFilteredMainItems] = useState([]); // For the "Search Item" field

    const getOutletId = () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const freshId = sessionStorage.getItem("impersonate_id");
        if (user.role === 'user' && (!freshId || freshId === 'global')) {
            return user.id;
        }
        return freshId;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const freshId = getOutletId();
            const url = `${API_BASE}/api/option-groups${freshId ? `?outlet_id=${freshId}` : ''}`;
            const res = await fetch(url, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            const d = await res.json();
            setData(Array.isArray(d) ? d : []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const fetchAuxiliaryData = async () => {
        try {
            const token = localStorage.getItem("token");
            const freshId = getOutletId();
            
            // Fetch Menus
            const menuRes = await fetch(`${API_BASE}/api/brand/outlet-menus${freshId ? `?outlet_id=${freshId}` : ''}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const menusData = await menuRes.json();
            
            // Deduplicate menus by name
            const uniqueMenus = Array.isArray(menusData) 
                ? menusData.filter((v, i, a) => a.findIndex(t => t.menu_name === v.menu_name) === i)
                : [];
            setMenus(uniqueMenus);

            // Fetch Items (Main items and options)
            const itemRes = await fetch(`${API_BASE}/api/brand/outlet-all-items${freshId ? `?outlet_id=${freshId}` : ''}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const itemsData = await itemRes.json();
            setAllItems(Array.isArray(itemsData) ? itemsData : []);

            // Fetch Categories
            const catUrl = `${API_BASE}/api/brand/categories${freshId ? `?outlet_id=${freshId}` : ''}`;
            const catRes = await fetch(catUrl, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const catData = await catRes.json();
            setCategories(Array.isArray(catData) ? catData : []);

        } catch (e) { console.error(e); }
    };

    useEffect(() => { 
        fetchData(); 
        fetchAuxiliaryData();
    }, []);

    // Step 2: Load categories according to selected menu
    useEffect(() => {
        if (formData.menu_id) {
            const catsInMenu = categories.filter(cat => 
                allItems.some(item => item.menu_id === parseInt(formData.menu_id) && item.category_id === cat.id)
            );
            setFilteredCategories(catsInMenu);
            // Don't reset if we are editing and just loaded the data
            if (!isEditing || formData.category_ids.length === 0) {
                setFormData(prev => ({ ...prev, category_ids: [] }));
            }
        } else {
            setFilteredCategories([]);
        }
    }, [formData.menu_id, categories, allItems, isEditing]);

    // Step 3: When category is selected, load Main Items and Options
    const linkedMainItemsStr = (formData.linked_main_items || []).map(i => i.item_id || i.id).join(',');

    useEffect(() => {
        if (formData.menu_id && formData.category_ids.length > 0) {
            const selectedCatId = parseInt(formData.category_ids[0]);
            
            // 1. Load Main Items (Type 0) for the selected category
            const mainItems = allItems.filter(item => {
                const isMain = item.item_type === 0 || item.item_type === '0' || String(item.item_type).toLowerCase() === 'main';
                const isInMenu = parseInt(item.menu_id) === parseInt(formData.menu_id);
                const isInCategory = parseInt(item.category_id) === parseInt(selectedCatId);
                return isMain && isInMenu && isInCategory;
            });
            setFilteredMainItems(mainItems);

            // 2. Load Options (Type 1) ONLY for the selected main items in Search Item
            const options = [];
            if (formData.linked_main_items && formData.linked_main_items.length > 0) {
                const sortedItems = [...allItems].sort((a, b) => parseInt(a.id) - parseInt(b.id));
                formData.linked_main_items.forEach(mainItem => {
                    const mainItemId = parseInt(mainItem.item_id || mainItem.id);
                    const nextMainItem = sortedItems.find(item => 
                        (item.item_type === 0 || item.item_type === '0' || String(item.item_type).toLowerCase() === 'main') &&
                        parseInt(item.menu_id) === parseInt(mainItem.menu_id) &&
                        parseInt(item.id) > mainItemId
                    );
                    const nextMainId = nextMainItem ? parseInt(nextMainItem.id) : Infinity;
                    
                    const mainItemOptions = sortedItems.filter(item => 
                        (item.item_type === 1 || item.item_type === '1' || String(item.item_type).toLowerCase() === 'option') &&
                        parseInt(item.menu_id) === parseInt(mainItem.menu_id) &&
                        parseInt(item.id) > mainItemId &&
                        parseInt(item.id) < nextMainId &&
                        !associatedOptions.some(ao => String(ao.name) === String(item.product_name) || parseInt(ao.id) === parseInt(item.id))
                    );
                    
                    mainItemOptions.forEach(opt => {
                        if (!options.some(o => parseInt(o.id) === parseInt(opt.id))) {
                            options.push(opt);
                        }
                    });
                });
            }
            setAvailableOptions(options);
        } else {
            setFilteredMainItems([]);
            setAvailableOptions([]);
        }
    }, [formData.menu_id, formData.category_ids, allItems, associatedOptions, linkedMainItemsStr]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = isEditing 
                ? `${API_BASE}/api/option-groups/${currentGroupId}`
                : `${API_BASE}/api/option-groups`;
            
            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    outlet_id: getOutletId(),
                    associated_options: associatedOptions, // Send full objects or names
                    linked_main_items: formData.linked_main_items
                })
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchData();
            } else {
                alert("Failed to save option group");
            }
        } catch (e) { console.error(e); }
    };

    const handleEditClick = (item) => {
        // Derive Menu and Category from linked main items if available
        const firstLinkedItem = item.linked_main_items && item.linked_main_items[0];
        const derivedMenuId = firstLinkedItem ? firstLinkedItem.menu_id : '';
        const derivedCatId = firstLinkedItem ? firstLinkedItem.category_id : '';

        setFormData({
            name: item.name,
            min_selectable: item.min_selectable || 1,
            max_selectable: item.max_selectable || 1,
            is_addon: item.is_chargeable, 
            is_active: item.is_active,
            menu_id: derivedMenuId || '',
            category_ids: derivedCatId ? [derivedCatId.toString()] : [],
            sorting: item.sorting_order || 0,
            description: item.description || '',
            select_all_items: false,
            linked_main_items: item.linked_main_items || []
        });
        setIsEditing(true);
        setCurrentGroupId(item.id);
        setIsModalOpen(true);
        setAssociatedOptions(item.associated_options || []);
        setAvailableSearch('');
        setAssociatedSearch('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this option group?")) return;
        try {
            const res = await fetch(`${API_BASE}/api/option-groups/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.ok) {
                fetchData();
            }
        } catch (e) { console.error(e); }
    };

    // Transfer List Handlers
    const moveRight = () => {
        setAssociatedOptions([...associatedOptions, ...selectedAvailable]);
        setAvailableOptions(availableOptions.filter(item => !selectedAvailable.includes(item)));
        setSelectedAvailable([]);
    };

    const moveLeft = () => {
        setAvailableOptions([...availableOptions, ...selectedAssociated]);
        setAssociatedOptions(associatedOptions.filter(item => !selectedAssociated.includes(item)));
        setSelectedAssociated([]);
    };

    const moveAllRight = () => {
        setAssociatedOptions([...associatedOptions, ...availableOptions]);
        setAvailableOptions([]);
        setSelectedAvailable([]);
    };

    const moveAllLeft = () => {
        setAvailableOptions([...availableOptions, ...associatedOptions]);
        setAssociatedOptions([]);
        setSelectedAssociated([]);
    };

    const handleMainItemSelect = (itemId) => {
        if (!itemId) return;
        const item = allItems.find(i => i.id === parseInt(itemId));
        if (item && !formData.linked_main_items.some(i => i.item_id === item.id || i.id === item.id)) {
            setFormData({
                ...formData,
                linked_main_items: [...formData.linked_main_items, { ...item, item_id: item.id }]
            });
        }
    };

    const removeMainItem = (itemId) => {
        setFormData({
            ...formData,
            linked_main_items: formData.linked_main_items.filter(i => (i.item_id || i.id) !== itemId)
        });
    };

    // Filtered lists for rendering based on search
    const renderedAvailableOptions = availableOptions.filter(item => 
        (item.code || '').toLowerCase().includes(availableSearch.toLowerCase()) ||
        (item.product_name || '').toLowerCase().includes(availableSearch.toLowerCase())
    );

    const renderedAssociatedOptions = associatedOptions.filter(item => 
        (item.name || '').toLowerCase().includes(associatedSearch.toLowerCase()) ||
        (item.code || '').toLowerCase().includes(associatedSearch.toLowerCase())
    );

    return (
        <div className="space-y-3 animate-pro-in">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <h2 className="pro-heading">Selection Protocols</h2>
                    <p className="pro-subheading">Product option groups and selection logic configurations</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <button onClick={fetchData} className="pro-btn-secondary h-7 px-2"><RefreshCw className="w-3 h-3" /> Sync</button>
                    <button onClick={() => {
                        setFormData({ name: '', min_selectable: 1, max_selectable: 1, is_addon: false, is_active: true, menu_id: '', category_ids: [], sorting: 0, description: '', select_all_items: false, linked_main_items: [] });
                        setIsEditing(false);
                        setIsModalOpen(true);
                        setAssociatedOptions([]);
                        setAvailableOptions([]);
                        setAvailableSearch('');
                        setAssociatedSearch('');
                    }} className="pro-btn-primary h-7 px-3"><Plus className="w-3 h-3" /> New Group</button>
                </div>
            </div>

            <div className="pro-card p-2 flex items-center justify-between bg-white/50">
                <div className="flex items-center gap-2 flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input type="text" placeholder="Search selection groups..." className="bg-transparent text-[12px] font-medium outline-none w-full" />
                </div>
                <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400"><Filter className="w-3.5 h-3.5" /></button>
            </div>

            {loading ? (
                <div className="py-20 text-center pro-subheading animate-pulse">Syncing Logic Vaults...</div>
            ) : (
                <div className="pro-card overflow-hidden">
                    <table className="pro-table">
                        <thead>
                            <tr>
                                <th>Group Identity</th>
                                <th>Selection Logic</th>
                                <th>Price Protocol</th>
                                <th>Status</th>
                                <th className="text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="font-bold text-slate-900 flex items-center gap-2 uppercase">
                                        <ListTree className="w-3.5 h-3.5 text-slate-400" /> {item.name}
                                    </td>
                                    <td>
                                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-black uppercase">
                                            {item.is_multiple ? 'Multiple Selection' : 'Single Choice'}
                                        </span>
                                        <span className="text-[10px] text-slate-400 ml-1">({item.min_selectable}-{item.max_selectable})</span>
                                    </td>
                                    <td>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {item.is_chargeable ? 'Paid Options' : 'Free Selection'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${item.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                            {item.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => handleEditClick(item)} className="p-1.5 hover:bg-slate-100 rounded text-slate-400" title="Edit Settings"><Edit3 className="w-3 h-3" /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-rose-50 rounded text-rose-400" title="Delete"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <form onSubmit={handleSubmit} className="w-full max-w-5xl bg-white rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col text-slate-800 border border-slate-200">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
                            <div>
                                <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
                                    {isEditing ? 'Update Option Group' : 'Add Option Group'}
                                </h3>
                            </div>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                                <XCircle className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Content (Scrollable) */}
                        <div className="p-4 space-y-4 overflow-y-auto flex-1 bg-white">
                            {/* Top Fields (2 Columns) */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Left Column */}
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-600">Option Group Name: <span className="text-red-500">*</span></label>
                                        <input required type="text" className="pro-input h-9 bg-white border border-slate-300 rounded px-3 text-[12px] text-slate-800 outline-none focus:border-emerald-500" placeholder="Enter Option Group Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-slate-600">Min Selectable:</label>
                                            <div className="flex items-center border border-slate-300 rounded bg-white overflow-hidden h-9">
                                                <button type="button" onClick={() => setFormData({ ...formData, min_selectable: Math.max(0, formData.min_selectable - 1) })} className="px-3 h-full bg-emerald-600 hover:bg-emerald-700 text-white"><Minus className="w-3 h-3" /></button>
                                                <input type="number" className="bg-transparent text-[12px] font-bold text-center w-full outline-none text-slate-800" value={formData.min_selectable} onChange={e => setFormData({ ...formData, min_selectable: parseInt(e.target.value) || 0 })} />
                                                <button type="button" onClick={() => setFormData({ ...formData, min_selectable: formData.min_selectable + 1 })} className="px-3 h-full bg-emerald-600 hover:bg-emerald-700 text-white"><Plus className="w-3 h-3" /></button>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-slate-600">Max Selectable:</label>
                                            <div className="flex items-center border border-slate-300 rounded bg-white overflow-hidden h-9">
                                                <button type="button" onClick={() => setFormData({ ...formData, max_selectable: Math.max(1, formData.max_selectable - 1) })} className="px-3 h-full bg-emerald-600 hover:bg-emerald-700 text-white"><Minus className="w-3 h-3" /></button>
                                                <input type="number" className="bg-transparent text-[12px] font-bold text-center w-full outline-none text-slate-800" value={formData.max_selectable} onChange={e => setFormData({ ...formData, max_selectable: parseInt(e.target.value) || 1 })} />
                                                <button type="button" onClick={() => setFormData({ ...formData, max_selectable: formData.max_selectable + 1 })} className="px-3 h-full bg-emerald-600 hover:bg-emerald-700 text-white"><Plus className="w-3 h-3" /></button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-1">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={formData.is_addon} onChange={e => setFormData({ ...formData, is_addon: e.target.checked })} className="w-4 h-4 accent-emerald-600" />
                                            <span className="text-[11px] font-bold text-slate-600">Is Addon</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4 accent-emerald-600" />
                                            <span className="text-[11px] font-bold text-slate-600">Active</span>
                                        </label>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-600">Select Menu:</label>
                                        <select className="pro-input h-9 bg-white border border-slate-300 rounded px-3 text-[12px] text-slate-800 outline-none focus:border-emerald-500" value={formData.menu_id} onChange={e => setFormData({ ...formData, menu_id: e.target.value })}>
                                            <option value="">Search Menu</option>
                                            {menus.map(m => <option key={m.id} value={m.id}>{m.menu_name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-600">Item Category List:</label>
                                        <select className="pro-input h-9 bg-white border border-slate-300 rounded px-3 text-[12px] text-slate-800 outline-none focus:border-emerald-500" value={formData.category_ids[0] || ''} onChange={e => setFormData({ ...formData, category_ids: [e.target.value] })}>
                                            <option value="">Search Category</option>
                                            {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-600">Sorting:</label>
                                        <input type="number" className="pro-input h-9 bg-white border border-slate-300 rounded px-3 text-[12px] text-slate-800 outline-none focus:border-emerald-500" value={formData.sorting} onChange={e => setFormData({ ...formData, sorting: parseInt(e.target.value) || 0 })} />
                                    </div>

                                    <div className="flex items-center gap-3 pt-1">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={formData.select_all_items} onChange={e => setFormData({ ...formData, select_all_items: e.target.checked })} className="w-4 h-4 accent-emerald-600" />
                                            <span className="text-[11px] font-bold text-slate-600">Select All Items</span>
                                        </label>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-600">Search Item (Loads Main Items):</label>
                                        <select className="pro-input h-9 bg-white border border-slate-300 rounded px-3 text-[12px] text-slate-800 outline-none focus:border-emerald-500" onChange={e => handleMainItemSelect(e.target.value)}>
                                            <option value="">Search item</option>
                                            {filteredMainItems.map(i => <option key={i.id} value={i.id}>{i.code} — {i.product_name}</option>)}
                                        </select>
                                        
                                        {/* Display selected main items as tags */}
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {formData.linked_main_items.map(item => (
                                                <span key={item.item_id || item.id} className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded flex items-center gap-1 border border-emerald-100">
                                                    {item.product_name} — [{item.code}]
                                                    <button type="button" onClick={() => removeMainItem(item.item_id || item.id)} className="text-emerald-400 hover:text-emerald-600"><XCircle className="w-3 h-3" /></button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-600">Description</label>
                                <textarea className="pro-input min-h-[50px] bg-white border border-slate-300 rounded p-2 text-[12px] text-slate-800 outline-none focus:border-emerald-500" placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>

                            <div className="border-t border-slate-100 my-2" />

                            {/* Dual List Box (Transfer List for Options) */}
                            <div className="space-y-2">
                                <div className="grid grid-cols-[1fr_50px_1fr] gap-3 items-center">
                                    {/* Available Options */}
                                    <div>
                                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Available Options</label>
                                        <div className="border border-slate-300 rounded overflow-hidden bg-white">
                                            <div className="p-1.5 border-b border-slate-300">
                                                {/* FIX 1: Bind search input to state */}
                                                <input type="text" placeholder="Search Short Code" className="w-full h-8 bg-transparent text-[12px] outline-none text-slate-800" value={availableSearch} onChange={e => setAvailableSearch(e.target.value)} />
                                            </div>
                                            <div className="h-[120px] overflow-y-auto p-1 space-y-0.5">
                                                {/* FIX 1: Filter by search */}
                                                {[...renderedAvailableOptions].sort((a, b) => (a.code || '').localeCompare(b.code || '')).map(item => (
                                                    <div key={item.id} onClick={() => {
                                                        if (selectedAvailable.includes(item)) {
                                                            setSelectedAvailable(selectedAvailable.filter(i => i !== item));
                                                        } else {
                                                            setSelectedAvailable([...selectedAvailable, item]);
                                                        }
                                                    }} className={`px-2 py-1.5 text-[11px] font-bold cursor-pointer rounded ${selectedAvailable.includes(item) ? 'bg-emerald-100 text-emerald-800' : 'text-slate-800 hover:bg-slate-50'}`}>
                                                        {item.code} — {item.product_name}
                                                    </div>
                                                ))}
                                                {renderedAvailableOptions.length === 0 && (
                                                    <div className="text-[10px] text-slate-400 text-center py-10">No items found</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Controls */}
                                    <div className="flex flex-col gap-1.5 items-center pt-5">
                                        <button type="button" onClick={moveAllRight} className="w-full p-1.5 bg-emerald-600 hover:bg-emerald-700 rounded text-white flex justify-center"><ChevronsRight className="w-4 h-4" /></button>
                                        <button type="button" onClick={moveRight} disabled={selectedAvailable.length === 0} className={`w-full p-1.5 bg-emerald-600 hover:bg-emerald-700 rounded text-white flex justify-center ${selectedAvailable.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}><ChevronRight className="w-4 h-4" /></button>
                                        <button type="button" onClick={moveLeft} disabled={selectedAssociated.length === 0} className={`w-full p-1.5 bg-emerald-600 hover:bg-emerald-700 rounded text-white flex justify-center ${selectedAssociated.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}><ChevronLeft className="w-4 h-4" /></button>
                                        <button type="button" onClick={moveAllLeft} className="w-full p-1.5 bg-emerald-600 hover:bg-emerald-700 rounded text-white flex justify-center"><ChevronsLeft className="w-4 h-4" /></button>
                                    </div>

                                    {/* Associated Options */}
                                    <div>
                                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Associated Options</label>
                                        <div className="border border-slate-300 rounded overflow-hidden bg-white">
                                            <div className="p-1.5 border-b border-slate-300">
                                                {/* FIX 1: Bind search input to state */}
                                                <input type="text" placeholder="Search Short Code" className="w-full h-8 bg-transparent text-[12px] outline-none text-slate-800" value={associatedSearch} onChange={e => setAssociatedSearch(e.target.value)} />
                                            </div>
                                            <div className="h-[120px] overflow-y-auto p-1 space-y-0.5">
                                                {/* FIX 1: Filter by search and FIX 2: Render item.name if code/product_name missing */}
                                                {[...renderedAssociatedOptions].sort((a, b) => (a.code || '').localeCompare(b.code || '')).map(item => (
                                                    <div key={item.id} onClick={() => {
                                                        if (selectedAssociated.includes(item)) {
                                                            setSelectedAssociated(selectedAssociated.filter(i => i !== item));
                                                        } else {
                                                            setSelectedAssociated([...selectedAssociated, item]);
                                                        }
                                                    }} className={`px-2 py-1.5 text-[11px] font-bold cursor-pointer rounded ${selectedAssociated.includes(item) ? 'bg-emerald-100 text-emerald-800' : 'text-slate-800 hover:bg-slate-50'}`}>
                                                        {item.code ? `${item.code} — ${item.product_name}` : item.name}
                                                    </div>
                                                ))}
                                                {renderedAssociatedOptions.length === 0 && (
                                                    <div className="text-[10px] text-slate-400 text-center py-10">No items found</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                            <button type="submit" className="px-5 py-1.5 bg-emerald-600 text-white rounded text-[11px] font-bold hover:bg-emerald-700">{isEditing ? 'Update' : 'Create'}</button>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-1.5 bg-rose-600 text-white rounded text-[11px] font-bold hover:bg-rose-700">Cancel</button>
                        </div>
                    </form>
                </div>
                , document.body)}
        </div>
    );
};

export default OptionGroupManager;
