import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
    Globe, Trash2, Search, RefreshCw,
    Filter, Edit3, Plus, DollarSign,
    Layers, CheckCircle2, ChevronDown,
    Monitor, Smartphone, MoreVertical, Upload
} from "lucide-react";
import API_BASE from "../config";

const MasterMenuManager = () => {
    const getOutletId = () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const freshId = sessionStorage.getItem("impersonate_id");
        if (user.role === 'user' && (!freshId || freshId === 'global')) {
            return user.id;
        }
        return freshId;
    };

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const fileInputRef = React.useRef(null);
    const [currentEditingId, setCurrentEditingId] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({
        code: '',
        product_name: '',
        price: '',
        stock_qty: '',
        category: '',
        item_type: 'Standard',
        description: '',
        availability: true
    });

    const [categories, setCategories] = useState([]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const freshId = getOutletId();
            const isValidId = freshId && !isNaN(freshId) && freshId !== "global";
            const url = `${API_BASE}/api/brand/outlet-all-items${isValidId ? `?outlet_id=${freshId}` : ''}`;

            const res = await fetch(url, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const d = await res.json();
            setData(Array.isArray(d) ? d : []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("token");
            const freshId = getOutletId();
            const isValidId = freshId && !isNaN(freshId) && freshId !== "global";
            const url = `${API_BASE}/api/brand/categories${isValidId ? `?outlet_id=${freshId}` : ''}`;
            const res = await fetch(url, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setCategories(await res.json());
            }
        } catch (e) { console.error(e); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            const res = await fetch(`${API_BASE}/api/brand/outlet-menu-items/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.ok) {
                fetchData();
            } else {
                alert("Failed to delete item");
            }
        } catch (e) { console.error(e); }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setEditModalOpen(true);
    };

    const handleUpdateItem = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/api/brand/outlet-menu-items/${editingItem.id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    code: editingItem.code,
                    product_name: editingItem.product_name,
                    price: editingItem.price,
                    sale_price_2: editingItem.sale_price_2,
                    sale_price_3: editingItem.sale_price_3,
                    availability: editingItem.availability,
                    item_type: editingItem.item_type,
                    description: editingItem.description,
                    current_stock: editingItem.stock_qty,
                    category_id: editingItem.category_id,
                    food_type: editingItem.food_type,
                    recommended: editingItem.recommended
                })
            });
            if (res.ok) {
                setEditModalOpen(false);
                fetchData();
            } else {
                alert("Failed to update item");
            }
        } catch (e) { console.error(e); }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const freshId = getOutletId();

            const menusRes = await fetch(`${API_BASE}/api/brand/outlet-menus?outlet_id=${freshId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const menus = await menusRes.json();
            let menuId = menus[0]?.id;

            if (!menuId) {
                const createMenuRes = await fetch(`${API_BASE}/api/brand/outlet-menus`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ menu_name: "Default Menu", outlet_id: freshId })
                });
                const newMenu = await createMenuRes.json();
                menuId = newMenu.id;
            }

            const res = await fetch(`${API_BASE}/api/brand/outlet-menu-items`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    menu_id: menuId,
                    short_code: newItem.code,
                    item_name: newItem.product_name,
                    price: newItem.price,
                    current_stock: newItem.stock_qty,
                    category_id: null,
                    food_type: 'Veg',
                    description: newItem.description
                })
            });
            if (res.ok) {
                setAddModalOpen(false);
                setNewItem({ code: '', product_name: '', price: '', stock_qty: '', category: '', item_type: 'Standard', description: '', availability: true });
                fetchData();
            } else {
                alert("Failed to add item");
            }
        } catch (e) { console.error(e); }
    };

    const handleUploadClick = (id) => {
        setCurrentEditingId(id);
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !currentEditingId) return;

        const formData = new FormData();
        formData.append("image", file);
        try {
            const uploadRes = await fetch(`${API_BASE}/api/catalog/upload`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
                body: formData
            });
            const uploadData = await uploadRes.json();
            if (uploadData.url) {
                const res = await fetch(`${API_BASE}/api/brand/outlet-menu-items/${currentEditingId}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ image_url: uploadData.url })
                });
                if (res.ok) {
                    fetchData();
                }
            }
        } catch (e) { console.error(e); }
        finally {
            e.target.value = '';
            setCurrentEditingId(null);
        }
    };

    useEffect(() => { fetchData(); fetchCategories(); }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Globe className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Unified Master Menu</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Global catalog & multi-pricing command center</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                        <Upload className="w-3.5 h-3.5" /> Multi-Pricing Upload
                    </button>
                    <button onClick={() => setAddModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-md shadow-indigo-600/10">
                        <Plus className="w-3.5 h-3.5" /> Provision Item
                    </button>
                </div>
            </div>

            {/* High-Density Grid */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[400px]">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/30">
                    <div className="flex items-center gap-3 flex-1 bg-white border border-slate-200 rounded-md px-3 py-2">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Search items by name or code..." className="bg-transparent text-[11px] font-bold text-slate-600 outline-none w-full uppercase placeholder:text-slate-300" />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-3 py-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-100 pr-3">Category</span>
                            <select className="bg-transparent text-[10px] font-bold text-slate-600 uppercase outline-none min-w-[120px]">
                                <option>All Categories</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-3 py-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-100 pr-3">Status</span>
                            <select className="bg-transparent text-[10px] font-bold text-slate-600 uppercase outline-none min-w-[100px]">
                                <option>Status: All</option>
                            </select>
                        </div>
                        <button className="p-2 hover:bg-white rounded-md text-slate-400 border border-transparent hover:border-slate-200 transition-all"><Filter className="w-4 h-4" /></button>
                        <button onClick={fetchData} className="p-2 hover:bg-white rounded-md text-slate-400 border border-transparent hover:border-slate-200 transition-all"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Action</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Sr. No.</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Image</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Short Code</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Item Name</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Base Item Price</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Sale Price 2</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-blue-500 uppercase tracking-wider">Sale Price 3</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Parent Category</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Active</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Item Type</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Outlet Name</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="13" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Syncing Global Catalog Hub...</td></tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="13" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-20">
                                            <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                <Globe className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No Master Records Provisioned</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.map((item, index) => {
                                const isOption = item.item_type === 1 || item.item_type === '1' || item.item_type === 'option';
                                return (
                                    <tr key={item.id} className={`group hover:bg-slate-50/50 transition-colors ${isOption ? 'bg-slate-50/30' : ''}`}>
                                        <td className="px-4 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <button onClick={() => handleEdit(item)} title="Edit Item" className="p-1.5 hover:bg-white rounded-md text-slate-400 border border-transparent hover:border-slate-200 transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => handleUploadClick(item.id)} title="Upload Image" className="p-1.5 hover:bg-white rounded-md text-slate-400 border border-transparent hover:border-slate-200 transition-all"><Upload className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => handleDelete(item.id)} title="Delete Item" className="p-1.5 hover:bg-rose-50 rounded-md text-rose-400 border border-transparent hover:border-rose-200 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center text-[11px] font-bold text-slate-400">{index + 1}</td>
                                        <td className="px-4 py-4 text-center">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.product_name} className={`${isOption ? 'w-10 h-10' : 'w-16 h-16'} rounded-full object-cover mx-auto border border-slate-100`} />
                                            ) : (
                                                <div className={`${isOption ? 'w-10 h-10 text-[10px]' : 'w-16 h-16 text-[14px]'} rounded-full bg-slate-100 flex items-center justify-center mx-auto font-bold text-slate-400 uppercase`}>
                                                    {item.product_name?.substring(0, 2) || 'NA'}
                                                </div>
                                            )}
                                        </td>
                                        <td className={`px-4 py-4 text-[11px] font-bold text-slate-600 uppercase ${isOption ? 'pl-6' : ''}`}>
                                            {isOption && <span className="text-slate-400 mr-1">↳</span>}
                                            {item.code || 'NA'}
                                        </td>
                                        <td className={`px-4 py-4 text-[12px] font-bold uppercase ${isOption ? 'text-slate-500 pl-8' : 'text-slate-800'}`}>
                                            {isOption && <span className="text-slate-400 mr-2">↳</span>}
                                            {item.product_name}
                                        </td>
                                        <td className="px-4 py-4 text-[12px] font-bold text-slate-900">₹{item.price || '0'}</td>
                                        <td className="px-4 py-4 text-[12px] font-bold text-emerald-600">{item.sale_price_2 ? `₹${item.sale_price_2}` : '-'}</td>
                                        <td className="px-4 py-4 text-[12px] font-bold text-blue-600">{item.sale_price_3 ? `₹${item.sale_price_3}` : '-'}</td>
                                        <td className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase">{item.parent_category || '-'}</td>
                                        <td className="px-4 py-4 text-[11px] font-bold text-indigo-600 uppercase">{item.category || 'NA'}</td>
                                        <td className="px-4 py-4 text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${item.availability ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                                {item.availability ? 'YES' : 'NO'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-[11px] font-bold uppercase">
                                            {isOption ? (
                                                <span className="text-amber-600">Option</span>
                                            ) : (
                                                <span className="text-slate-500">{item.item_type === 0 || item.item_type === '0' ? 'Main Item' : (item.item_type || 'Standard')}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase">-</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

            {editModalOpen && editingItem && createPortal(
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Edit Item</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Update item details</p>
                            </div>
                            <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleUpdateItem} className="p-6 grid grid-cols-2 gap-5">
                            {/* Short Code */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Short Code *</label>
                                <input type="text" value={editingItem.code || ''} disabled className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-500 outline-none uppercase cursor-not-allowed" />
                            </div>

                            {/* Item Name */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Item Name *</label>
                                <input type="text" value={editingItem.product_name || ''} onChange={(e) => setEditingItem({ ...editingItem, product_name: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors uppercase" placeholder="Enter Item Name" required />
                            </div>

                            {/* Base Item Price */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Base Item Price *</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[12px]">₹</span>
                                    <input type="number" step="0.01" value={editingItem.price || ''} onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md pl-7 pr-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors" placeholder="Enter Sale Price" required />
                                </div>
                            </div>

                            {/* Sale Price 2 */}
                            <div>
                                <label className="block text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Sale Price 2</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[12px]">₹</span>
                                    <input type="number" step="0.01" value={editingItem.sale_price_2 || ''} onChange={(e) => setEditingItem({ ...editingItem, sale_price_2: e.target.value })} className="w-full bg-white border border-emerald-200 rounded-md pl-7 pr-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-emerald-500 transition-colors" placeholder="Optional" />
                                </div>
                            </div>

                            {/* Sale Price 3 */}
                            <div>
                                <label className="block text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">Sale Price 3</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[12px]">₹</span>
                                    <input type="number" step="0.01" value={editingItem.sale_price_3 || ''} onChange={(e) => setEditingItem({ ...editingItem, sale_price_3: e.target.value })} className="w-full bg-white border border-blue-200 rounded-md pl-7 pr-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors" placeholder="Optional" />
                                </div>
                            </div>

                            {/* Current Stock */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Stock</label>
                                <input type="number" value={editingItem.stock_qty || ''} onChange={(e) => setEditingItem({ ...editingItem, stock_qty: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors" placeholder="Enter Stock" />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category *</label>
                                <select value={editingItem.category || ''} onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors uppercase">
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Sub Category */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sub Category</label>
                                <select value={editingItem.sub_category || ''} onChange={(e) => setEditingItem({ ...editingItem, sub_category: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors uppercase">
                                    <option value="">Select Sub Category</option>
                                </select>
                            </div>

                            {/* Food Type */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Food Type *</label>
                                <select value={editingItem.food_type || 'Veg'} onChange={(e) => setEditingItem({ ...editingItem, food_type: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors uppercase">
                                    <option value="Veg">Veg</option>
                                    <option value="Non Veg">Non Veg</option>
                                    <option value="Egg">Egg</option>
                                </select>
                            </div>

                            {/* Item Type */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Item Type</label>
                                <select value={editingItem.item_type || 'Standard'} onChange={(e) => setEditingItem({ ...editingItem, item_type: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors uppercase">
                                    <option value="Standard">Menu Item</option>
                                    <option value="Combo">Combo</option>
                                </select>
                            </div>

                            {/* Recommended */}
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={editingItem.recommended || false} onChange={(e) => setEditingItem({ ...editingItem, recommended: e.target.checked })} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Recommended</label>
                            </div>

                            {/* Active */}
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={editingItem.availability || false} onChange={(e) => setEditingItem({ ...editingItem, availability: e.target.checked })} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Is Active</label>
                            </div>

                            {/* Description */}
                            <div className="col-span-1">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</label>
                                <textarea value={editingItem.description || ''} onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors h-20" placeholder="Enter Description"></textarea>
                            </div>

                            {/* Image Upload */}
                            <div className="col-span-1">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Image</label>
                                <div className="border-2 border-dashed border-slate-200 rounded-md p-4 flex flex-col items-center justify-center gap-2 hover:border-indigo-500 transition-colors cursor-pointer" onClick={() => handleUploadClick(editingItem.id)}>
                                    <Upload className="w-5 h-5 text-slate-400" />
                                    <p className="text-[11px] font-bold text-slate-500 uppercase">Choose a File or Drop it Here</p>
                                    <span className="text-[10px] text-slate-400">Browse</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="col-span-2 flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                <button type="button" onClick={() => setEditModalOpen(false)} className="px-4 py-2 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-colors shadow-md shadow-emerald-600/10">Update</button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {addModalOpen && createPortal(
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Add Item</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Create a new item in the menu</p>
                            </div>
                            <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleAddItem} className="p-6 grid grid-cols-2 gap-5">
                            {/* Short Code */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Short Code *</label>
                                <input type="text" value={newItem.code} onChange={(e) => setNewItem({ ...newItem, code: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors uppercase" placeholder="Enter Short Code" required />
                            </div>

                            {/* Item Name */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Item Name *</label>
                                <input type="text" value={newItem.product_name} onChange={(e) => setNewItem({ ...newItem, product_name: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors uppercase" placeholder="Enter Item Name" required />
                            </div>

                            {/* Base Item Price */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Base Item Price *</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[12px]">₹</span>
                                    <input type="number" step="0.01" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md pl-7 pr-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors" placeholder="Enter Sale Price" required />
                                </div>
                            </div>

                            {/* Current Stock */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Stock</label>
                                <input type="number" value={newItem.stock_qty} onChange={(e) => setNewItem({ ...newItem, stock_qty: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors" placeholder="Enter Stock" />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category *</label>
                                <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors uppercase">
                                    <option value="">Select Category</option>
                                </select>
                            </div>

                            {/* Item Type */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Item Type</label>
                                <select value={newItem.item_type} onChange={(e) => setNewItem({ ...newItem, item_type: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors uppercase">
                                    <option value="Standard">Menu Item</option>
                                    <option value="Combo">Combo</option>
                                </select>
                            </div>

                            {/* Active */}
                            <div className="flex items-center gap-2 col-span-2">
                                <input type="checkbox" checked={newItem.availability} onChange={(e) => setNewItem({ ...newItem, availability: e.target.checked })} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Is Active</label>
                            </div>

                            {/* Actions */}
                            <div className="col-span-2 flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                <button type="button" onClick={() => setAddModalOpen(false)} className="px-4 py-2 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-colors shadow-md shadow-emerald-600/10">Create</button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default MasterMenuManager;
