import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Save, Search, Filter, Trash2, RefreshCw, 
  ChevronRight, ChevronLeft, MoreVertical, Plus,
  Monitor, Smartphone, Rocket, CheckCircle2, AlertCircle,
  Clock, Tag, Info, Layers, ChefHat, Database, Percent, X
} from "lucide-react";
import API_BASE from "../config";

const MenuDesigner = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [menu, setMenu] = useState(null);
    const [items, setItems] = useState([]);
    const [catalogItems, setCatalogItems] = useState([]);
    const [taxGroups, setTaxGroups] = useState([]);
    const [kitchenDepts, setKitchenDepts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");

    const fetchData = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const [menuRes, itemsRes, catalogRes, taxRes, kitchenRes, catRes] = await Promise.all([
                fetch(`${API_BASE}/api/brand/outlet-menus`, { headers: { "Authorization": `Bearer ${token}` } }),
                fetch(`${API_BASE}/api/brand/outlet-menus/${id}/items`, { headers: { "Authorization": `Bearer ${token}` } }),
                fetch(`${API_BASE}/api/business/catalog`, { headers: { "Authorization": `Bearer ${token}` } }),
                fetch(`${API_BASE}/api/brand/tax-groups`, { headers: { "Authorization": `Bearer ${token}` } }),
                fetch(`${API_BASE}/api/brand/kitchen-depts`, { headers: { "Authorization": `Bearer ${token}` } }),
                fetch(`${API_BASE}/api/business/catalog/categories`, { headers: { "Authorization": `Bearer ${token}` } })
            ]);

            const menus = await menuRes.json();
            setMenu(menus.find(m => m.id === parseInt(id)));
            setItems(await itemsRes.json());
            setCatalogItems(await catalogRes.json());
            setTaxGroups(await taxRes.json());
            setKitchenDepts(await kitchenRes.json());
            setCategories(await catRes.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, [id]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleUpdateItem = async (itemId, field, value) => {
        const updatedItems = items.map(it => it.id === itemId ? { ...it, [field]: value } : it);
        setItems(updatedItems);
        
        try {
            const token = localStorage.getItem("token");
            await fetch(`${API_BASE}/api/brand/outlet-menus/items/${itemId}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ [field]: value })
            });
        } catch (e) { console.error(e); }
    };

    const handleAddItem = async (catalogId) => {
        const sourceItem = catalogItems.find(i => i.id === catalogId);
        if (!sourceItem) return;

        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/api/brand/outlet-menus/${id}/items`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    item_id: sourceItem.id,
                    short_code: sourceItem.sku || "",
                    base_price: sourceItem.price,
                    description: sourceItem.description || "",
                    category_id: sourceItem.category_id,
                    food_type: sourceItem.is_veg ? 'veg' : 'non-veg'
                })
            });
            if (res.ok) fetchData();
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm("Remove item from this menu?")) return;
        try {
            const res = await fetch(`${API_BASE}/api/brand/outlet-menus/items/${itemId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.ok) fetchData();
        } catch (e) { console.error(e); }
    };

    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
    const [quickAddData, setQuickAddData] = useState({
        item_name: "", short_code: "", hsn_code: "", stock: 0,
        price: 0, item_type: "Menu Item", category_id: "",
        sub_category: "", food_type: "veg", tax_group_id: "",
        kitchen_dept_id: "", is_active: true, is_recommended: false,
        description: ""
    });

    const handleQuickAdd = async () => {
        if (!quickAddData.item_name || !quickAddData.price) {
            alert("Name and Price are required.");
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            // 1. Create in master catalog
            const catalogRes = await fetch(`${API_BASE}/api/catalog`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    product_name: quickAddData.item_name,
                    code: quickAddData.short_code,
                    hsn_code: quickAddData.hsn_code,
                    stock_count: quickAddData.stock,
                    price: quickAddData.price,
                    category: categories.find(c => c.id === parseInt(quickAddData.category_id))?.name || "Uncategorized",
                    sub_category: quickAddData.sub_category,
                    is_veg: quickAddData.food_type === 'veg',
                    description: quickAddData.description,
                    tax_applicable: 1
                })
            });
            const newCatalogItem = await catalogRes.json();

            // 2. Link to this menu
            await fetch(`${API_BASE}/api/brand/outlet-menus/${id}/items`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    item_id: newCatalogItem.id,
                    short_code: quickAddData.short_code,
                    base_price: quickAddData.price,
                    description: quickAddData.description,
                    category_id: quickAddData.category_id,
                    tax_group_id: quickAddData.tax_group_id,
                    kitchen_dept_id: quickAddData.kitchen_dept_id,
                    stock_qty: quickAddData.stock,
                    food_type: quickAddData.food_type,
                    is_recommended: quickAddData.is_recommended,
                    hsn_code: quickAddData.hsn_code,
                    pos_status: true,
                    platform_status: true
                })
            });

            setIsQuickAddOpen(false);
            fetchData();
        } catch (e) { 
            console.error(e); 
            alert("Failed to add item.");
        } finally { 
            setSaving(false); 
        }
    };

    if (loading) return <div className="h-[calc(100vh-140px)] flex items-center justify-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] animate-pulse">Initializing Menu Architect...</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-112px)] bg-slate-50 -m-6 overflow-hidden">
            
            {/* STICKY CONTROL BAR */}
            <div className="flex flex-col lg:flex-row items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-sm shrink-0 gap-4 z-30">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate("/outlet-menus")} className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 transition-all active:scale-95">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-[16px] font-bold text-slate-800 uppercase tracking-tight flex items-center gap-3">
                            Designer <ChevronRight className="w-4 h-4 text-slate-300" /> <span className="text-indigo-600 font-black">{menu?.menu_name}</span>
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{menu?.outlet_name} • {items.length} ACTIVE OVERRIDES</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            placeholder="Filter by name..." 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-12 pr-4 py-2 text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all shadow-inner"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select 
                        onChange={(e) => e.target.value && handleAddItem(parseInt(e.target.value))}
                        className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all outline-none h-10 min-w-[200px]"
                    >
                        <option value="">+ Add From Catalog</option>
                        {catalogItems.filter(ci => !items.find(mi => mi.item_id === ci.id)).map(ci => (
                            <option key={ci.id} value={ci.id}>{ci.product_name || ci.name}</option>
                        ))}
                    </select>
                    <button 
                        onClick={() => setIsQuickAddOpen(true)}
                        className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-md shadow-emerald-600/10 hover:bg-emerald-500 transition-all h-10 flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" /> Quick Add Item
                    </button>
                </div>
            </div>

            {/* MAIN ARCHITECT TABLE */}
            <div className="flex-1 overflow-hidden flex flex-col relative">
                <div className="flex-1 overflow-auto custom-scrollbar relative">
                    <table className="w-full text-left border-separate border-spacing-0 min-w-[2500px]">
                        <thead className="sticky top-0 z-20">
                            <tr className="bg-white">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 sticky left-0 bg-white shadow-[1px_0_4px_rgba(0,0,0,0.05)]">Sr. & Identity</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Short Code</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">POS / PLATFORM</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Base Price</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Digital Promo</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Category</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Tax Group</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Kitchen Dept</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Stock & Time</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Food Type</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Recommended</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">HSN & Sort</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.filter(it => (it.original_name || it.product_name || "").toLowerCase().includes(search.toLowerCase()) || it.short_code?.toLowerCase().includes(search.toLowerCase())).map((it, idx) => (
                                <tr key={it.id} className="group hover:bg-white transition-colors">
                                    
                                    {/* IDENTITY (STICKY) */}
                                    <td className="px-6 py-4 sticky left-0 bg-slate-50 group-hover:bg-white transition-colors shadow-[1px_0_4px_rgba(0,0,0,0.05)]">
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-bold text-slate-300">{(idx + 1).toString().padStart(2, '0')}</span>
                                            <div className="max-w-[200px]">
                                                <p className="text-[12px] font-bold text-slate-800 uppercase tracking-tight truncate" title={it.original_name || it.product_name}>{it.original_name || it.product_name}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60">ID: {it.item_id}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* SHORT CODE */}
                                    <td className="px-6 py-4">
                                        <input 
                                            className="w-24 bg-white border border-slate-200 rounded-md px-3 py-1.5 text-[10px] font-bold text-slate-700 focus:border-indigo-500 outline-none uppercase shadow-sm" 
                                            value={it.short_code || ""} 
                                            onChange={(e) => handleUpdateItem(it.id, 'short_code', e.target.value)} 
                                        />
                                    </td>

                                    {/* STATUS TOGGLES */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-4">
                                            <button 
                                                onClick={() => handleUpdateItem(it.id, 'pos_status', !it.pos_status)}
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all shadow-sm ${it.pos_status ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-300'}`}
                                                title="POS Visibility"
                                            >
                                                <Monitor className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateItem(it.id, 'platform_status', !it.platform_status)}
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all shadow-sm ${it.platform_status ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-300'}`}
                                                title="Platform Visibility"
                                            >
                                                <Rocket className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>

                                    {/* PRICE OVERRIDE */}
                                    <td className="px-6 py-4">
                                        <div className="relative group/price w-32">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[10px]">₹</span>
                                            <input 
                                                type="number" 
                                                className="w-full bg-white border border-slate-200 rounded-md pl-6 pr-3 py-2 text-[12px] font-bold text-slate-800 focus:border-indigo-500 transition-all outline-none shadow-sm"
                                                value={it.base_price || 0}
                                                onChange={(e) => handleUpdateItem(it.id, 'base_price', e.target.value)}
                                            />
                                        </div>
                                    </td>

                                    {/* DIGITAL DISCOUNT */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 w-48">
                                            <button 
                                                onClick={() => handleUpdateItem(it.id, 'digital_discount', !it.digital_discount)}
                                                className={`p-2 rounded-md transition-all shadow-sm ${it.digital_discount ? 'bg-rose-500 text-white' : 'bg-white border border-slate-200 text-slate-300'}`}
                                            >
                                                <Percent className="w-3.5 h-3.5" />
                                            </button>
                                            {it.digital_discount && (
                                                <div className="flex-1 flex gap-2 animate-in slide-in-from-left-2 duration-300">
                                                    <select 
                                                        className="bg-white border border-slate-200 rounded-md px-1 py-1.5 text-[9px] font-bold text-slate-700 outline-none"
                                                        value={it.discount_type}
                                                        onChange={(e) => handleUpdateItem(it.id, 'discount_type', e.target.value)}
                                                    >
                                                        <option value="percentage">%</option>
                                                        <option value="fixed">Amt</option>
                                                    </select>
                                                    <input 
                                                        type="number" 
                                                        className="w-16 bg-white border border-slate-200 rounded-md px-2 py-1.5 text-[10px] font-bold text-slate-800 outline-none"
                                                        value={it.discount_value || 0}
                                                        onChange={(e) => handleUpdateItem(it.id, 'discount_value', e.target.value)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* CATEGORY */}
                                    <td className="px-6 py-4">
                                        <select 
                                            className="w-48 bg-white border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-700 outline-none focus:border-indigo-500 shadow-sm"
                                            value={it.category_id || ""}
                                            onChange={(e) => handleUpdateItem(it.id, 'category_id', e.target.value)}
                                        >
                                            <option value="">Uncategorized</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
                                        </select>
                                    </td>

                                    {/* TAX GROUP */}
                                    <td className="px-6 py-4">
                                        <select 
                                            className="w-40 bg-white border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-700 outline-none focus:border-indigo-500 shadow-sm"
                                            value={it.tax_group_id || ""}
                                            onChange={(e) => handleUpdateItem(it.id, 'tax_group_id', e.target.value)}
                                        >
                                            <option value="">No Tax Group</option>
                                            {taxGroups.map(tg => <option key={tg.id} value={tg.id}>{tg.name.toUpperCase()}</option>)}
                                        </select>
                                    </td>

                                    {/* KITCHEN DEPT */}
                                    <td className="px-6 py-4">
                                        <select 
                                            className="w-44 bg-white border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-700 outline-none focus:border-indigo-500 shadow-sm"
                                            value={it.kitchen_dept_id || ""}
                                            onChange={(e) => handleUpdateItem(it.id, 'kitchen_dept_id', e.target.value)}
                                        >
                                            <option value="">Direct Dispatch</option>
                                            {kitchenDepts.map(kd => <option key={kd.id} value={kd.id}>{kd.name.toUpperCase()}</option>)}
                                        </select>
                                    </td>

                                    {/* STOCK & PREP TIME */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 w-48">
                                            <div className="flex-1 space-y-1">
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">STOCK</p>
                                                <input 
                                                    type="number" 
                                                    className="w-full bg-white border border-slate-200 rounded-md px-2 py-1.5 text-[10px] font-bold text-slate-800 outline-none shadow-sm"
                                                    value={it.stock_qty || 0}
                                                    onChange={(e) => handleUpdateItem(it.id, 'stock_qty', e.target.value)}
                                                />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">MINS</p>
                                                <input 
                                                    type="number" 
                                                    className="w-full bg-white border border-slate-200 rounded-md px-2 py-1.5 text-[10px] font-bold text-slate-800 outline-none shadow-sm"
                                                    value={it.prep_time || 15}
                                                    onChange={(e) => handleUpdateItem(it.id, 'prep_time', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </td>

                                    {/* FOOD TYPE */}
                                    <td className="px-6 py-4">
                                        <select 
                                            className="w-32 bg-white border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-700 outline-none focus:border-indigo-500 shadow-sm"
                                            value={it.food_type || 'veg'}
                                            onChange={(e) => handleUpdateItem(it.id, 'food_type', e.target.value)}
                                        >
                                            <option value="veg">🌿 VEG</option>
                                            <option value="non-veg">🥩 NON-VEG</option>
                                            <option value="egg">🥚 EGG</option>
                                        </select>
                                    </td>

                                    {/* RECOMMENDED */}
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => handleUpdateItem(it.id, 'is_recommended', !it.is_recommended)}
                                            className={`mx-auto w-10 h-5 rounded-full transition-all relative shadow-inner ${it.is_recommended ? 'bg-amber-500' : 'bg-slate-200'}`}
                                        >
                                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${it.is_recommended ? 'right-0.5' : 'left-0.5'}`} />
                                        </button>
                                    </td>

                                    {/* HSN & SORT */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 w-40">
                                            <input 
                                                className="flex-1 bg-white border border-slate-200 rounded-md px-2 py-1.5 text-[10px] font-bold text-slate-700 outline-none shadow-sm placeholder:text-slate-200"
                                                placeholder="HSN"
                                                value={it.hsn_code || ""}
                                                onChange={(e) => handleUpdateItem(it.id, 'hsn_code', e.target.value)}
                                            />
                                            <input 
                                                type="number"
                                                className="w-16 bg-white border border-slate-200 rounded-md px-2 py-1.5 text-[10px] font-bold text-slate-800 outline-none shadow-sm"
                                                value={it.sort_order || 0}
                                                onChange={(e) => handleUpdateItem(it.id, 'sort_order', e.target.value)}
                                            />
                                        </div>
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleDeleteItem(it.id)}
                                            className="p-2.5 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-all active:scale-90"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* QUICK ADD MODAL */}
            {isQuickAddOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pro-in">
                    <div className="w-full max-w-5xl bg-[#1e2129] text-white rounded-lg shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[95vh]">
                        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/40">
                            <h3 className="text-[12px] font-black uppercase tracking-[0.2em]">Quick Add New Item</h3>
                            <button onClick={() => setIsQuickAddOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-all text-slate-400"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-8 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Short Code *</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-800 border border-white/10 rounded h-11 px-4 text-[13px] font-bold outline-none focus:border-emerald-500 transition-all" 
                                        placeholder="Enter Short Code" 
                                        value={quickAddData.short_code}
                                        onChange={e => setQuickAddData({...quickAddData, short_code: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Name *</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-800 border border-white/10 rounded h-11 px-4 text-[13px] font-bold outline-none focus:border-emerald-500 transition-all" 
                                        placeholder="Enter Item Name" 
                                        value={quickAddData.item_name}
                                        onChange={e => setQuickAddData({...quickAddData, item_name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HSN Code</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-800 border border-white/10 rounded h-11 px-4 text-[13px] font-bold outline-none focus:border-emerald-500 transition-all" 
                                        placeholder="Enter HSN Code" 
                                        value={quickAddData.hsn_code}
                                        onChange={e => setQuickAddData({...quickAddData, hsn_code: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Stock</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-slate-800 border border-white/10 rounded h-11 px-4 text-[13px] font-bold outline-none focus:border-emerald-500 transition-all" 
                                        placeholder="Enter Stock" 
                                        value={quickAddData.stock}
                                        onChange={e => setQuickAddData({...quickAddData, stock: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Item Price *</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-slate-800 border border-white/10 rounded h-11 px-4 text-[13px] font-bold outline-none focus:border-emerald-500 transition-all" 
                                        placeholder="Enter Sale Price" 
                                        value={quickAddData.price}
                                        onChange={e => setQuickAddData({...quickAddData, price: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Type</label>
                                    <select 
                                        className="w-full bg-slate-800 border border-white/10 rounded h-11 px-4 text-[13px] font-bold outline-none focus:border-emerald-500 transition-all appearance-none"
                                        value={quickAddData.item_type}
                                        onChange={e => setQuickAddData({...quickAddData, item_type: e.target.value})}
                                    >
                                        <option value="Menu Item">Menu Item</option>
                                        <option value="Combo Item">Combo Item</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category *</label>
                                    <div className="flex gap-2">
                                        <select 
                                            className="flex-1 bg-slate-800 border border-white/10 rounded h-11 px-4 text-[13px] font-bold outline-none focus:border-emerald-500 transition-all appearance-none"
                                            value={quickAddData.category_id}
                                            onChange={e => setQuickAddData({...quickAddData, category_id: e.target.value})}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        <button className="px-4 bg-slate-700 hover:bg-slate-600 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap border border-white/5">Add New Category</button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sub Category</label>
                                    <div className="flex gap-2">
                                        <select 
                                            className="flex-1 bg-slate-800 border border-white/10 rounded h-11 px-4 text-[13px] font-bold outline-none focus:border-emerald-500 transition-all appearance-none"
                                            value={quickAddData.sub_category}
                                            onChange={e => setQuickAddData({...quickAddData, sub_category: e.target.value})}
                                        >
                                            <option value="">Select Sub Category</option>
                                        </select>
                                        <button className="px-4 bg-slate-700 hover:bg-slate-600 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap border border-white/5">Add New Subcategory</button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Food Type *</label>
                                    <select 
                                        className="w-full bg-slate-800 border border-white/10 rounded h-11 px-4 text-[13px] font-bold outline-none focus:border-emerald-500 transition-all appearance-none"
                                        value={quickAddData.food_type}
                                        onChange={e => setQuickAddData({...quickAddData, food_type: e.target.value})}
                                    >
                                        <option value="veg">Veg</option>
                                        <option value="non-veg">Non-Veg</option>
                                        <option value="egg">Egg</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tax Product Group *</label>
                                    <select 
                                        className="w-full bg-slate-800 border border-white/10 rounded h-11 px-4 text-[13px] font-bold outline-none focus:border-emerald-500 transition-all appearance-none"
                                        value={quickAddData.tax_group_id}
                                        onChange={e => setQuickAddData({...quickAddData, tax_group_id: e.target.value})}
                                    >
                                        <option value="">Select Tax Group</option>
                                        {taxGroups.map(tg => <option key={tg.id} value={tg.id}>{tg.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kitchen Department *</label>
                                    <div className="flex gap-2">
                                        <select 
                                            className="flex-1 bg-slate-800 border border-white/10 rounded h-11 px-4 text-[13px] font-bold outline-none focus:border-emerald-500 transition-all appearance-none"
                                            value={quickAddData.kitchen_dept_id}
                                            onChange={e => setQuickAddData({...quickAddData, kitchen_dept_id: e.target.value})}
                                        >
                                            <option value="">Select Kitchen Dept</option>
                                            {kitchenDepts.map(kd => <option key={kd.id} value={kd.id}>{kd.name}</option>)}
                                        </select>
                                        <button className="px-4 bg-slate-700 hover:bg-slate-600 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap border border-white/5">Add Kitchen Dept</button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 pt-6">
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="checkbox" 
                                            className="w-5 h-5 accent-emerald-500" 
                                            checked={quickAddData.is_active}
                                            onChange={e => setQuickAddData({...quickAddData, is_active: e.target.checked})}
                                        />
                                        <label className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Is Active</label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="checkbox" 
                                            className="w-5 h-5 accent-emerald-500" 
                                            checked={quickAddData.is_recommended}
                                            onChange={e => setQuickAddData({...quickAddData, is_recommended: e.target.checked})}
                                        />
                                        <label className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Recommended</label>
                                    </div>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                                    <textarea 
                                        className="w-full bg-slate-800 border border-white/10 rounded p-4 text-[13px] font-bold outline-none focus:border-emerald-500 transition-all min-h-[100px] resize-none" 
                                        placeholder="Enter Item Description"
                                        value={quickAddData.description}
                                        onChange={e => setQuickAddData({...quickAddData, description: e.target.value})}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-white/5 bg-black/40 flex justify-end gap-3">
                            <button 
                                onClick={handleQuickAdd}
                                disabled={saving}
                                className="px-10 h-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                            >
                                {saving ? 'Processing...' : 'Create'}
                            </button>
                            <button onClick={() => setIsQuickAddOpen(false)} className="px-10 h-10 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-600/20">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* BOTTOM NAV / FOOTER */}
            <div className="px-8 py-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] z-30">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Sync Active</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider opacity-60">Use Tab to navigate rapidly through matrix fields.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => navigate("/outlet-menus")} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-widest rounded-lg hover:bg-slate-50 transition-all">Close Editor</button>
                    <button className="px-8 py-2.5 bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-widest rounded-lg shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-95 transition-all flex items-center gap-2">
                        <Save className="w-4 h-4" /> Commit All Changes
                    </button>
                </div>
            </div>

        </div>
    );
};

export default MenuDesigner;
