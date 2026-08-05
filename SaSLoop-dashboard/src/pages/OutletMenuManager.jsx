import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
    MenuSquare, Plus, Edit3, Trash2, Search, Filter,
    Download, Upload, CheckCircle2, XCircle,
    ChevronRight, RefreshCw, Layers, X, Save, AlertTriangle, Settings,
    QrCode, Printer, Copy, Check
} from 'lucide-react';
import * as XLSX from 'xlsx';
import API_BASE from '../config';
import { generateStandee } from '../utils/standeeGenerator';

const OutletMenuManager = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditingMenu, setIsEditingMenu] = useState(false);
    const [isEditingSettings, setIsEditingSettings] = useState(false);
    const [currentMenuId, setCurrentMenuId] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [itemsLoading, setItemsLoading] = useState(false);
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const fileInputRef = React.useRef(null);
    const [currentEditingId, setCurrentEditingId] = useState(null);

    // QR Code Modal State
    const [qrModalMenu, setQrModalMenu] = useState(null);
    const [copiedUrl, setCopiedUrl] = useState(false);
    const [customDomain, setCustomDomain] = useState(
        window.location.hostname.includes("localhost") ? window.location.origin : "https://menu.sasloop.in"
    );

    const triggerPrint = (qrUrl, title) => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print QR Code - ${title}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            margin: 0;
                            text-align: center;
                        }
                        .container {
                            border: 2px solid #ccc;
                            padding: 30px;
                            border-radius: 15px;
                            background: white;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        }
                        h1 {
                            font-size: 28px;
                            margin-bottom: 5px;
                            text-transform: uppercase;
                            letter-spacing: 2px;
                        }
                        p {
                            font-size: 14px;
                            color: #666;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            margin-bottom: 25px;
                        }
                        img {
                            width: 250px;
                            height: 250px;
                        }
                    </style>
                </head>
                <body onload="window.print(); window.close();">
                    <div class="container">
                        <h1>${title}</h1>
                        <p>Scan to view Online Menu & Place Order</p>
                        <img src="${qrUrl}" alt="QR Code" />
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const triggerDownload = (qrUrl, filename) => {
        const link = document.createElement("a");
        link.href = qrUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCopyUrl = (url) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
    };

    // Search filters for matrix
    const [searchShortCode, setSearchShortCode] = useState('');
    const [searchItemName, setSearchItemName] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;

    // Form states
    const [formData, setFormData] = useState({
        menu_name: '',
        short_name: '',
        is_pos_default: false,
        is_digital_default: false,
        is_table_default: false
    });

    const [itemFormData, setItemFormData] = useState({
        short_code: '',
        item_name: '',
        price: '',
        category_id: '',
        sub_category_id: '',
        department_id: '',
        tax_group_id: '',
        food_type: 'Veg',
        item_type: '0',
        is_active: true,
        is_recommended: false,
        hsn_code: '',
        current_stock: 0,
        description: '',
        sale_price_2: '',
        sale_price_3: ''
    });

    // Taxonomy states
    const [categories, setCategories] = useState([]);
    const [taxGroups, setTaxGroups] = useState([]);
    const [kitchenDepts, setKitchenDepts] = useState([]);

    const getOutletId = () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const freshId = sessionStorage.getItem("impersonate_id");
        if (user.role === 'user' && (!freshId || freshId === 'global')) {
            return user.id;
        }
        return freshId;
    };

    const currentOutletId = getOutletId();

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const freshId = getOutletId();
            // Ensure we only send valid numeric IDs, not "global", "null", or "undefined" strings
            const isValidId = freshId && !isNaN(freshId) && freshId !== "global";
            const url = `${API_BASE}/api/brand/outlet-menus${isValidId ? `?outlet_id=${freshId}` : ''}`;

            const res = await fetch(url, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const result = await res.json();
            setData(Array.isArray(result) ? result : []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchMenuItems = async (menuId) => {
        setItemsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/brand/outlet-menus/${menuId}/items`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const result = await res.json();
            setMenuItems(Array.isArray(result) ? result : []);
        } catch (e) {
            console.error(e);
        } finally {
            setItemsLoading(false);
        }
    };

    const handleEditClick = (menu) => {
        setSelectedMenu(menu);
        setIsEditingMenu(true);
        fetchMenuItems(menu.id);
    };

    const handleSettingsClick = (menu) => {
        setFormData({
            menu_name: menu.menu_name,
            short_name: menu.short_name || '',
            is_pos_default: menu.is_pos_default,
            is_digital_default: menu.is_digital_default,
            is_table_default: menu.is_table_default,
            outlet_id: menu.outlet_id
        });
        setIsEditingSettings(true);
        setCurrentMenuId(menu.id);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const freshId = getOutletId();
            
            const url = isEditingSettings 
                ? `${API_BASE}/api/brand/outlet-menus/${currentMenuId}`
                : `${API_BASE}/api/brand/outlet-menus`;
                
            const method = isEditingSettings ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    outlet_id: freshId
                })
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchData();
            } else {
                const errData = await res.json();
                alert(`FAILED TO ${isEditingSettings ? 'UPDATE' : 'REGISTER'} MENU: ${errData.error || 'Unknown Error'}`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDeleteMenu = async (id) => {
        if (!window.confirm("Are you sure you want to delete this menu configuration?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/brand/outlet-menus/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) fetchData();
        } catch (e) { console.error(e); }
    };

    const handleItemUpdate = (itemId, field, value) => {
        setMenuItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, [field]: value } : item
        ));
    };

    const handleUploadClick = (id) => {
        setCurrentEditingId(id);
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !currentEditingId) return;

        const formData = new FormData();
        formData.append("image", file);
        try {
            const token = localStorage.getItem("token");
            const uploadRes = await fetch(`${API_BASE}/api/catalog/upload`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });
            const uploadData = await uploadRes.json();
            if (uploadData.url) {
                const res = await fetch(`${API_BASE}/api/brand/outlet-menu-items/${currentEditingId}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ image_url: uploadData.url })
                });
                if (res.ok) {
                    fetchMenuItems(selectedMenu.id);
                }
            }
        } catch (err) { console.error(err); }
        finally {
            e.target.value = '';
            setCurrentEditingId(null);
        }
    };

    const handleAddItemSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/brand/outlet-menu-items`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...itemFormData,
                    menu_id: selectedMenu.id
                })
            });
            if (res.ok) {
                setIsAddItemModalOpen(false);
                fetchMenuItems(selectedMenu.id);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleUpdateMatrix = async () => {
        // Collect all data from the table (this would normally use a ref or state per row)
        // For simplicity, we'll alert that it's saving. In a real app, you'd gather state.
        setItemsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/brand/outlet-menu-items/bulk-update`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ items: menuItems })
            });

            if (res.ok) {
                alert("Matrix updated successfully!");
                fetchMenuItems(selectedMenu.id);
            }
        } catch (e) {
            console.error(e);
            alert("Update failed");
        } finally {
            setItemsLoading(false);
        }
    };

    const handlePurgeMatrix = async () => {
        if (!window.confirm("CRITICAL ACTION: This will permanently delete ALL items in this menu grid. Are you absolutely sure?")) return;

        setItemsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/brand/outlet-menus/${selectedMenu.id}/items`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                alert("Matrix purged successfully!");
                fetchMenuItems(selectedMenu.id);
            }
        } catch (e) {
            console.error(e);
            alert("Purge failed");
        } finally {
            setItemsLoading(false);
        }
    };

    const handleBulkUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataObj = new FormData();
        formDataObj.append("menuFile", file);
        formDataObj.append("menu_id", selectedMenu.id);
        const freshId = getOutletId();
        if (freshId) formDataObj.append("outlet_id", freshId);

        setItemsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/brand/outlet-menus/bulk-upload`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formDataObj
            });

            if (res.ok) {
                const result = await res.json();
                alert(`Successfully imported ${result.count} items!`);
                fetchMenuItems(selectedMenu.id);
                fetchTaxonomy(); // Refresh Categories, etc.
            } else {
                const err = await res.json();
                alert(err.error || "Bulk upload failed");
            }
        } catch (e) {
            console.error(e);
            alert("Network error during bulk upload");
        } finally {
            setItemsLoading(false);
            e.target.value = null;
        }
    };

    const handleAddNewCategory = async () => {
        const name = prompt("Enter new category name:");
        if (!name) return;
        try {
            const token = localStorage.getItem("token");
            const freshId = getOutletId();
            const res = await fetch(`${API_BASE}/api/brand/categories`, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, outlet_id: freshId })
            });
            if (res.ok) {
                alert("Category added successfully!");
                fetchTaxonomy();
            }
        } catch (e) { console.error(e); }
    };

    const handleAddNewSubCategory = async () => {
        const name = prompt("Enter new sub-category name:");
        if (!name) return;
        if (!itemFormData.category_id) {
            alert("Please select a Category first!");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const freshId = getOutletId();
            const res = await fetch(`${API_BASE}/api/brand/categories`, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    name, 
                    outlet_id: freshId,
                    parent_id: parseInt(itemFormData.category_id),
                    is_active: true
                })
            });
            if (res.ok) {
                alert("Sub-category added successfully!");
                fetchTaxonomy();
            }
        } catch (e) { console.error(e); }
    };

    const fetchTaxonomy = async () => {
        try {
            const token = localStorage.getItem("token");
            const freshId = getOutletId();
            const headers = { "Authorization": `Bearer ${token}` };

            // Ensure we only send valid numeric IDs
            const isValidId = freshId && !isNaN(freshId) && freshId !== "global";
            const query = isValidId ? `?outlet_id=${freshId}` : '';

            // Fetch filtered by outlet if available
            const [catRes, tgRes, deptRes] = await Promise.all([
                fetch(`${API_BASE}/api/brand/categories${query}`, { headers }),
                fetch(`${API_BASE}/api/brand/tax-groups${query}`, { headers }),
                fetch(`${API_BASE}/api/brand/kitchen-departments${query}`, { headers })
            ]);

            if (catRes.ok) setCategories(await catRes.json());
            if (tgRes.ok) setTaxGroups(await tgRes.json());
            if (deptRes.ok) setKitchenDepts(await deptRes.json());
        } catch (e) {
            console.error("Taxonomy fetch failed:", e);
        }
    };

    useEffect(() => {
        console.log("Context changed or mount: ", currentOutletId);
        fetchData();
        fetchTaxonomy();
    }, [currentOutletId]);

    // Matrix Filtering & Pagination Logic
    const filteredItems = useMemo(() => {
        return menuItems.filter(item => {
            const matchesCode = item.short_code?.toLowerCase().includes(searchShortCode.toLowerCase());
            const matchesName = item.item_name?.toLowerCase().includes(searchItemName.toLowerCase());
            return matchesCode && matchesName;
        });
    }, [menuItems, searchShortCode, searchItemName]);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, currentPage]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);


    if (isEditingMenu) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-800 p-4 animate-pro-in">
                {/* Atlantic Matrix Header Matrix */}
                <div className="flex items-center justify-between bg-white dark:bg-[#1e2129] p-3 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm mb-3">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsEditingMenu(false)} className="hover:bg-slate-100 dark:hover:bg-white/5 p-2 rounded-lg transition-all">
                            <XCircle className="w-5 h-5 text-slate-400" />
                        </button>
                        <div>
                            <h2 className="pro-heading">Catalog Matrix: {selectedMenu?.menu_name}</h2>
                            <p className="pro-subheading">Editing menu grid configuration</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={handlePurgeMatrix} className="pro-btn-secondary h-9 px-4 text-rose-600 border-rose-200 hover:bg-rose-50">
                            <Trash2 className="w-4 h-4" /> Purge Matrix
                        </button>
                        <button onClick={() => setIsAddItemModalOpen(true)} className="pro-btn-primary h-9 px-5 bg-slate-900 hover:bg-black">
                            <Plus className="w-4 h-4" /> Add Item
                        </button>
                        <div className="relative group">
                            <input type="file" id="bulkItemInput" className="hidden" accept=".xlsx, .xls" onChange={handleBulkUpload} />
                            <label htmlFor="bulkItemInput" className="pro-btn-secondary h-9 px-4 cursor-pointer">
                                <Upload className="w-4 h-4 text-indigo-500" /> Upload
                            </label>
                        </div>
                        <a href="/samples/atlantic_menu_format.xlsx" download="sastech_menu_format.xlsx" className="pro-btn-secondary h-9 w-9 p-0">
                            <Download className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Industrial Matrix Filters */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 mb-4 flex items-center gap-4 shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by Short Code..."
                            className="w-full pl-9 h-10 bg-slate-50 border border-slate-200 rounded-lg text-[12px] font-bold outline-none focus:ring-2 ring-emerald-500/10"
                            value={searchShortCode}
                            onChange={e => setSearchShortCode(e.target.value)}
                        />
                    </div>
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by Item Name..."
                            className="w-full pl-9 h-10 bg-slate-50 border border-slate-200 rounded-lg text-[12px] font-bold outline-none focus:ring-2 ring-emerald-500/10"
                            value={searchItemName}
                            onChange={e => setSearchItemName(e.target.value)}
                        />
                    </div>
                    <div className="w-px h-8 bg-slate-200 mx-2" />
                    <select className="bg-slate-50 border border-slate-200 h-10 px-4 rounded-lg text-[12px] font-bold text-slate-600 outline-none">
                        <option>Sort: Default</option>
                    </select>
                </div>

                {/* Industrial Matrix Grid (Light) */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto overflow-y-auto max-h-[65vh] atlantic-scrollbar">
                        <table className="w-full border-collapse">
                            <thead className="sticky top-0 z-30">
                                <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 text-left">
                                    <th className="p-4 text-center w-12"><input type="checkbox" className="accent-emerald-500" /></th>
                                    <th className="p-4 text-center w-16">Sr. No.</th>
                                    <th className="p-4 text-center w-24">Image</th>
                                    <th className="p-4 min-w-[150px]">Short Code</th>
                                    <th className="p-4 min-w-[250px]">Item Name</th>
                                    <th className="p-4 text-center">POS Status</th>
                                    <th className="p-4 text-center">Platform Status</th>
                                    <th className="p-4 min-w-[120px]">Base Item Price</th>
                                    <th className="p-4 min-w-[120px]">Sale Price 2</th>
                                    <th className="p-4 min-w-[120px]">Sale Price 3</th>
                                    <th className="p-4 text-center">Digital Discount</th>
                                    <th className="p-4 min-w-[150px]">Discount Type</th>
                                    <th className="p-4 min-w-[120px]">Discounted Price</th>
                                    <th className="p-4 min-w-[200px]">Description</th>
                                    <th className="p-4 min-w-[180px]">Category</th>
                                    <th className="p-4 min-w-[180px]">Tax Product Group</th>
                                    <th className="p-4 min-w-[180px]">Kitchen Department</th>
                                    <th className="p-4 min-w-[100px]">Stock</th>
                                    <th className="p-4 min-w-[100px]">Tax</th>
                                    <th className="p-4 min-w-[100px]">Tax Value</th>
                                    <th className="p-4 min-w-[120px]">Food Type</th>
                                    <th className="p-4 min-w-[180px]">Option Group</th>
                                    <th className="p-4 min-w-[180px]">Addon</th>
                                    <th className="p-4 min-w-[100px]">Prep.Time</th>
                                    <th className="p-4 text-center">Recommended</th>
                                    <th className="p-4 text-center">Open Item</th>
                                    <th className="p-4 text-center">Open Price</th>
                                    <th className="p-4 min-w-[200px]">Tags / Diets</th>
                                    <th className="p-4 text-center">Sync to Aggregator</th>
                                    <th className="p-4 min-w-[180px]">Alternative Title</th>
                                    <th className="p-4 min-w-[180px]">Meat Types</th>
                                    <th className="p-4 min-w-[180px]">Exclude Order Type</th>
                                    <th className="p-4 min-w-[120px]">HSN Code</th>
                                    <th className="p-4 min-w-[100px]">Item Sort</th>
                                    <th className="p-4 text-center">Is Option</th>
                                    <th className="p-4 text-center sticky right-0 bg-slate-50 shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.05)] border-l border-slate-200">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {itemsLoading ? (
                                    Array(10).fill(0).map((_, i) => (
                                        <tr key={i} className="animate-pulse"><td colSpan="34" className="p-4"><div className="h-10 bg-slate-50 rounded-lg" /></td></tr>
                                    ))
                                ) : paginatedItems.length === 0 ? (
                                    <tr><td colSpan="34" className="py-48 text-center text-slate-300 font-black uppercase tracking-widest opacity-40">No Items Found matching criteria</td></tr>
                                ) : paginatedItems.map((item, idx) => (
                                    <tr key={item.id} className="group hover:bg-emerald-50/30 transition-all">
                                        <td className="p-3 text-center"><input type="checkbox" className="accent-emerald-500" /></td>
                                        <td className="p-3 text-center font-mono text-[11px] text-slate-400">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                        <td className="p-3 text-center">
                                            {item.image_url ? (
                                                <div className="relative group/img inline-block">
                                                    <img src={item.image_url.startsWith('http') ? item.image_url : `${API_BASE}${item.image_url}`} alt={item.item_name} className="w-12 h-12 rounded-full object-cover border border-slate-100 mx-auto" />
                                                    <button onClick={() => handleUploadClick(item.id)} className="absolute inset-0 bg-black/45 text-white rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"><Upload className="w-3.5 h-3.5" /></button>
                                                </div>
                                            ) : (
                                                <button onClick={() => handleUploadClick(item.id)} className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 border border-dashed border-slate-300 flex items-center justify-center mx-auto text-slate-400 hover:text-slate-600 transition-all">
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <input
                                                type="text"
                                                value={item.short_code || ''}
                                                onChange={e => handleItemUpdate(item.id, 'short_code', e.target.value)}
                                                className="w-full bg-white border border-slate-200 text-slate-900 h-9 px-3 rounded-md text-[12px] font-bold outline-none focus:border-emerald-500"
                                            />
                                        </td>
                                        <td className="p-3">
                                            <input
                                                type="text"
                                                value={item.item_name || ''}
                                                onChange={e => handleItemUpdate(item.id, 'item_name', e.target.value)}
                                                className="w-full bg-white border border-slate-200 text-slate-900 h-9 px-3 rounded-md text-[12px] font-bold outline-none uppercase focus:border-emerald-500"
                                            />
                                        </td>
                                        <td className="p-3 text-center">
                                            <input
                                                type="checkbox"
                                                checked={!!(item.pos_status ?? item.is_active)}
                                                onChange={e => handleItemUpdate(item.id, 'pos_status', e.target.checked)}
                                                className="accent-emerald-500 w-5 h-5"
                                            />
                                        </td>
                                        <td className="p-3 text-center">
                                            <input
                                                type="checkbox"
                                                checked={!!item.platform_status}
                                                onChange={e => handleItemUpdate(item.id, 'platform_status', e.target.checked)}
                                                className="accent-indigo-500 w-5 h-5"
                                            />
                                        </td>
                                        <td className="p-3">
                                            <input
                                                type="number"
                                                value={item.base_price ?? item.price ?? ''}
                                                onChange={e => handleItemUpdate(item.id, 'base_price', e.target.value)}
                                                className="w-full bg-white border border-slate-200 text-slate-900 h-9 px-3 rounded-md text-[12px] font-bold text-center focus:border-emerald-500"
                                            />
                                        </td>
                                        <td className="p-3">
                                            <input
                                                type="number"
                                                value={item.sale_price_2 ?? ''}
                                                onChange={e => handleItemUpdate(item.id, 'sale_price_2', e.target.value)}
                                                className="w-full bg-white border border-slate-200 text-slate-900 h-9 px-3 rounded-md text-[12px] font-bold text-center focus:border-emerald-500"
                                            />
                                        </td>
                                        <td className="p-3">
                                            <input
                                                type="number"
                                                value={item.sale_price_3 ?? ''}
                                                onChange={e => handleItemUpdate(item.id, 'sale_price_3', e.target.value)}
                                                className="w-full bg-white border border-slate-200 text-slate-900 h-9 px-3 rounded-md text-[12px] font-bold text-center focus:border-emerald-500"
                                            />
                                        </td>
                                        <td className="p-3 text-center">
                                            <input
                                                type="checkbox"
                                                checked={(item.digital_discount || 0) > 0}
                                                onChange={e => handleItemUpdate(item.id, 'digital_discount', e.target.checked ? 10 : 0)}
                                                className="accent-emerald-500 w-5 h-5"
                                            />
                                        </td>
                                        <td className="p-3"><select className="w-full bg-white border border-slate-200 text-slate-900 h-9 px-3 rounded-md text-[12px] font-bold"><option>Perct</option></select></td>
                                        <td className="p-3"><input type="number" value={0} readOnly className="w-full bg-slate-50 border border-slate-200 text-slate-400 h-9 px-3 rounded-md text-[12px] font-bold text-center" /></td>
                                        <td className="p-3">
                                            <input
                                                type="text"
                                                value={item.description || ''}
                                                onChange={e => handleItemUpdate(item.id, 'description', e.target.value)}
                                                className="w-full bg-white border border-slate-200 text-slate-900 h-9 px-3 rounded-md text-[12px] font-bold"
                                            />
                                        </td>
                                        <td className="p-3">
                                            <select
                                                key={`cat-${item.id}-${categories.length}`}
                                                className="w-full bg-white border border-slate-200 text-slate-900 h-9 px-3 rounded-md text-[11px] font-bold uppercase"
                                                value={item.category_id || ""}
                                                onChange={e => handleItemUpdate(item.id, 'category_id', e.target.value)}
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </td>
                                        <td className="p-3">
                                            <select
                                                className="w-full bg-white border border-slate-200 text-slate-900 h-9 px-3 rounded-md text-[11px] font-bold uppercase"
                                                value={item.tax_group_id || ""}
                                                onChange={e => handleItemUpdate(item.id, 'tax_group_id', e.target.value)}
                                            >
                                                <option value="">Select Tax</option>
                                                {taxGroups.map(tg => <option key={tg.id} value={tg.id}>{tg.group_name}</option>)}
                                            </select>
                                        </td>
                                        <td className="p-3">
                                            <select
                                                className="w-full bg-white border border-slate-200 text-slate-900 h-9 px-3 rounded-md text-[11px] font-bold uppercase"
                                                value={item.kitchen_dept_id || ""}
                                                onChange={e => handleItemUpdate(item.id, 'kitchen_dept_id', e.target.value)}
                                            >
                                                <option value="">Select Dept</option>
                                                {kitchenDepts.map(kd => <option key={kd.id} value={kd.id}>{kd.name}</option>)}
                                            </select>
                                        </td>
                                        <td className="p-3">
                                            <input
                                                type="number"
                                                value={item.stock_qty ?? ''}
                                                onChange={e => handleItemUpdate(item.id, 'stock_qty', e.target.value)}
                                                className="w-full bg-white border border-slate-200 text-slate-900 h-9 px-3 rounded-md text-[12px] font-bold text-center"
                                            />
                                        </td>
                                        <td className="p-3 text-center text-slate-400">--</td>
                                        <td className="p-3"><input type="number" value={0} readOnly className="w-full bg-slate-50 border border-slate-200 text-slate-400 h-9 px-3 rounded-md text-[12px] font-bold text-center" /></td>
                                        <td className="p-3">
                                            <select
                                                className="w-full bg-white border border-slate-200 text-slate-900 h-9 px-3 rounded-md text-[11px] font-bold uppercase"
                                                value={item.food_type || "Veg"}
                                                onChange={e => handleItemUpdate(item.id, 'food_type', e.target.value)}
                                            >
                                                <option value="Veg">Veg</option>
                                                <option value="Non-Veg">Non-Veg</option>
                                                <option value="Egg">Egg</option>
                                            </select>
                                        </td>
                                        <td className="p-3"><select className="w-full bg-white border border-slate-200 text-slate-900 h-9 px-3 rounded-md text-[11px] font-bold uppercase"><option>Select Option Group</option></select></td>
                                        <td className="p-3"><select className="w-full bg-white border border-slate-200 text-slate-900 h-9 px-3 rounded-md text-[11px] font-bold uppercase"><option>Addons</option></select></td>
                                        <td className="p-3"><input type="number" defaultValue={30} className="w-full bg-white border border-slate-200 text-slate-900 h-9 px-3 rounded-md text-[12px] font-bold text-center" /></td>
                                        <td className="p-3 text-center"><input type="checkbox" defaultChecked={item.is_recommended} className="accent-emerald-500 w-5 h-5" /></td>
                                        <td className="p-3 text-center"><input type="checkbox" className="accent-emerald-500 w-5 h-5" /></td>
                                        <td className="p-3 text-center"><input type="checkbox" className="accent-emerald-500 w-5 h-5" /></td>
                                        <td className="p-3"><input type="text" className="w-full bg-white border border-slate-200 text-slate-900 h-9 px-3 rounded-md text-[12px] font-bold" defaultValue="services" /></td>
                                        <td className="p-3 text-center"><input type="checkbox" className="accent-emerald-500 w-5 h-5" /></td>
                                        <td className="p-3"><input type="text" className="w-full bg-white border border-slate-200 text-slate-900 h-9 px-3 rounded-md text-[12px] font-bold" /></td>
                                        <td className="p-3"><select className="w-full bg-white border border-slate-200 text-slate-900 h-9 px-3 rounded-md text-[11px] font-bold uppercase"><option>Meat Type</option></select></td>
                                        <td className="p-3"><select className="w-full bg-white border border-slate-200 text-slate-900 h-9 px-3 rounded-md text-[11px] font-bold uppercase"><option>Exclude</option></select></td>
                                        <td className="p-3"><input type="text" defaultValue={item.hsn_code} className="w-full bg-white border border-slate-200 text-slate-900 h-9 px-3 rounded-md text-[12px] font-bold text-center" /></td>
                                        <td className="p-3"><input type="number" defaultValue={0} className="w-full bg-white border border-slate-200 text-slate-900 h-9 px-3 rounded-md text-[12px] font-bold text-center" /></td>
                                        <td className="p-3 text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={item.item_type === '1'} 
                                                onChange={e => handleItemUpdate(item.id, 'item_type', e.target.checked ? '1' : '0')}
                                                className="accent-emerald-500 w-5 h-5" 
                                            />
                                        </td>
                                        <td className="p-3 text-center sticky right-0 bg-white shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.05)] border-l border-slate-200">
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm("Remove this item from menu?")) {
                                                        const token = localStorage.getItem("token");
                                                        await fetch(`${API_BASE}/api/brand/outlet-menus/items/${item.id}`, {
                                                            method: "DELETE",
                                                            headers: { "Authorization": `Bearer ${token}` }
                                                        });
                                                        fetchMenuItems(selectedMenu.id);
                                                    }
                                                }}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Action Bar (Light) */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 border-t border-slate-200">
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 rounded text-[11px] font-black bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-all"
                            >
                                PREV
                            </button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum = i + 1;
                                if (totalPages > 5 && currentPage > 3) {
                                    pageNum = currentPage - 2 + i;
                                    if (pageNum + (4 - i) > totalPages) pageNum = totalPages - 4 + i;
                                }
                                if (pageNum > totalPages || pageNum < 1) return null;

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`px-3 py-1.5 rounded text-[11px] font-black transition-all ${currentPage === pageNum ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 rounded text-[11px] font-black bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-all"
                            >
                                NEXT
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={handleUpdateMatrix} className="bg-emerald-600 hover:bg-emerald-700 text-white h-10 px-8 rounded-lg text-[12px] font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 transition-all active:scale-95">Update Matrix</button>
                            <button onClick={() => setIsEditingMenu(false)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 h-10 px-8 rounded-lg text-[12px] font-black uppercase tracking-widest transition-all active:scale-95">Close</button>
                        </div>
                    </div>
                </div>

                {/* Modals outside main flow (Light) */}
                {isAddItemModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <form onSubmit={handleAddItemSubmit} className="bg-white w-full max-w-4xl rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95 border border-slate-200">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h3 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Add Item</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Create a new item in the menu</p>
                                </div>
                                <button type="button" onClick={() => setIsAddItemModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><Plus className="w-5 h-5 rotate-45" /></button>
                            </div>
                            <div className="p-6 grid grid-cols-2 gap-5 max-h-[70vh] overflow-y-auto atlantic-scrollbar">
                                {/* Short Code */}
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Short Code *</label>
                                    <input required type="text" value={itemFormData.short_code} onChange={e => setItemFormData({ ...itemFormData, short_code: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors uppercase" placeholder="Enter Short Code" />
                                </div>

                                {/* Item Name */}
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Item Name *</label>
                                    <input required type="text" value={itemFormData.item_name} onChange={e => setItemFormData({ ...itemFormData, item_name: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors uppercase" placeholder="Enter Item Name" />
                                </div>

                                {/* HSN Code */}
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">HSN Code</label>
                                    <input type="text" value={itemFormData.hsn_code} onChange={e => setItemFormData({ ...itemFormData, hsn_code: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors uppercase" placeholder="Enter HSN Code" />
                                </div>

                                {/* Current Stock */}
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Stock</label>
                                    <input type="number" value={itemFormData.current_stock} onChange={e => setItemFormData({ ...itemFormData, current_stock: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors" placeholder="Enter Stock" />
                                </div>

                                {/* Base Item Price */}
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Base Item Price *</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[12px]">₹</span>
                                        <input required type="number" step="0.01" value={itemFormData.price} onChange={e => setItemFormData({ ...itemFormData, price: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md pl-7 pr-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors" placeholder="Enter Base Price" />
                                    </div>
                                </div>

                                {/* Sale Price 2 */}
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sale Price 2</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[12px]">₹</span>
                                        <input type="number" step="0.01" value={itemFormData.sale_price_2} onChange={e => setItemFormData({ ...itemFormData, sale_price_2: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md pl-7 pr-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors" placeholder="Enter Sale Price 2" />
                                    </div>
                                </div>

                                {/* Sale Price 3 */}
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sale Price 3</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[12px]">₹</span>
                                        <input type="number" step="0.01" value={itemFormData.sale_price_3} onChange={e => setItemFormData({ ...itemFormData, sale_price_3: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md pl-7 pr-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors" placeholder="Enter Sale Price 3" />
                                    </div>
                                </div>

                                {/* Item Type */}
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Item Type</label>
                                    <select value={itemFormData.item_type || '0'} onChange={e => setItemFormData({ ...itemFormData, item_type: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors uppercase">
                                        <option value="0">Main</option>
                                        <option value="1">Option</option>
                                    </select>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category *</label>
                                    <div className="flex gap-2">
                                        <select required value={itemFormData.category_id} onChange={e => setItemFormData({ ...itemFormData, category_id: e.target.value })} className="flex-1 bg-white border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors uppercase">
                                            <option value="">Select Category</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        <button type="button" onClick={() => handleAddNewCategory()} className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 uppercase hover:bg-slate-200 transition-colors">Add New</button>
                                    </div>
                                </div>

                                {/* Sub Category */}
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sub Category</label>
                                    <div className="flex gap-2">
                                        <select value={itemFormData.sub_category_id} onChange={e => setItemFormData({ ...itemFormData, sub_category_id: e.target.value })} className="flex-1 bg-white border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors uppercase">
                                            <option value="">Select Sub Category</option>
                                            {categories.filter(c => c.parent_id === parseInt(itemFormData.category_id)).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        <button type="button" onClick={() => handleAddNewSubCategory()} className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 uppercase hover:bg-slate-200 transition-colors">Add New</button>
                                    </div>
                                </div>

                                {/* Tax Product Group */}
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tax Product Group</label>
                                    <select value={itemFormData.tax_group_id} onChange={e => setItemFormData({ ...itemFormData, tax_group_id: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors uppercase">
                                        <option value="">Select Tax Group</option>
                                        {taxGroups.map(tg => <option key={tg.id} value={tg.id}>{tg.group_name}</option>)}
                                    </select>
                                </div>

                                {/* Food Type */}
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Food Type</label>
                                    <select value={itemFormData.food_type} onChange={e => setItemFormData({ ...itemFormData, food_type: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors uppercase">
                                        <option value="Veg">Veg</option>
                                        <option value="Non-Veg">Non-Veg</option>
                                        <option value="Egg">Egg</option>
                                    </select>
                                </div>

                                {/* Kitchen Department */}
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kitchen Department</label>
                                    <select value={itemFormData.department_id} onChange={e => setItemFormData({ ...itemFormData, department_id: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors uppercase">
                                        <option value="">Select Department</option>
                                        {kitchenDepts.map(kd => <option key={kd.id} value={kd.id}>{kd.name}</option>)}
                                    </select>
                                </div>

                                {/* Active & Recommended */}
                                <div className="flex items-center gap-4 col-span-2">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" checked={itemFormData.is_active} onChange={e => setItemFormData({ ...itemFormData, is_active: e.target.checked })} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                                        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Is Active</label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" checked={itemFormData.is_recommended} onChange={e => setItemFormData({ ...itemFormData, is_recommended: e.target.checked })} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                                        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Recommended</label>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Item Description</label>
                                    <textarea value={itemFormData.description} onChange={e => setItemFormData({ ...itemFormData, description: e.target.value })} className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors h-20 uppercase" placeholder="Enter ingredients, dietary info..." />
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/50">
                                <button type="button" onClick={() => setIsAddItemModalOpen(false)} className="px-4 py-2 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-colors shadow-md shadow-emerald-600/10">Register Item</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-pro-in">
            {/* Header Matrix Hub */}
            <div className="flex items-center justify-between bg-white dark:bg-[#1e2129] p-3 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                        <MenuSquare className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="pro-heading">Outlet Menu Management</h2>
                        <div className="flex items-center gap-2">
                            <p className="pro-subheading">Catalog Orchestration</p>
                            <span className="w-1 h-1 rounded-full bg-slate-300 mt-1" />
                            <p className="pro-subheading text-emerald-600">{data.length} Active Configurations</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="pro-btn-secondary h-9 px-4" onClick={fetchData}>
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Matrix
                    </button>
                    <button
                        onClick={() => {
                            setFormData({
                                menu_name: '',
                                short_name: '',
                                is_pos_default: false,
                                is_digital_default: false,
                                outlet_id: currentOutletId
                            });
                            setIsEditingSettings(false);
                            setIsModalOpen(true);
                        }}
                        className="pro-btn-primary h-9 px-5"
                    >
                        <Plus className="w-4 h-4" /> Register Menu Grid
                    </button>
                </div>
            </div>

            {/* Industrial Filter Hub (Light) */}
            <div className="bg-white dark:bg-[#1e2129] p-2 px-3 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input type="text" placeholder="Search menu grids by name or ID..." className="bg-transparent text-[11px] font-bold text-slate-600 dark:text-slate-400 outline-none w-full uppercase placeholder:text-slate-300" />
                </div>
                <div className="flex items-center gap-2 border-l border-slate-100 dark:border-white/5 pl-3 ml-3">
                    <button className="p-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded text-slate-400 transition-all"><Filter className="w-4 h-4" /></button>
                </div>
            </div>

            {/* Industrial Data Grid (Light) */}
            <div className="pro-card border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
                <table className="pro-table">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="w-32 text-center">Action</th>
                            <th className="w-16 text-center">Sr. No.</th>
                            <th className="w-24">Menu Id</th>
                            <th>Menu Name</th>
                            <th>Short Name</th>
                            <th>Outlet Name</th>
                            <th className="text-center">POS Default</th>
                            <th className="text-center">Digital Default</th>
                            <th className="text-center">Table Default</th>
                            <th className="text-center">Published</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan="10" className="p-4"><div className="h-10 bg-slate-50 rounded" /></td>
                                </tr>
                            ))
                        ) : data.length === 0 ? (
                            <tr><td colSpan="10" className="py-24 text-center opacity-20"><MenuSquare className="w-12 h-12 mx-auto mb-4" /><p className="text-[11px] font-bold uppercase tracking-widest">No Menu Configurations Detected</p></td></tr>
                        ) : data.map((item, idx) => (
                            <tr key={item.id} className="group hover:bg-emerald-50/50 transition-all">
                                <td className="py-3">
                                    <div className="flex items-center justify-center gap-1.5 px-2">
                                        <button onClick={() => handleEditClick(item)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm" title="Edit Items"><Edit3 className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => handleSettingsClick(item)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm" title="Menu Settings"><Settings className="w-3.5 h-3.5" /></button>
                                        <button onClick={fetchData} className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm" title="Refresh"><RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /></button>
                                        {item.is_digital_default && (
                                            <button 
                                                onClick={() => setQrModalMenu(item)} 
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm" 
                                                title="Online Menu QR Code"
                                            >
                                                <QrCode className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                        <button onClick={() => handleDeleteMenu(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                </td>
                                <td className="text-center font-mono text-[10px] text-slate-400">{idx + 1}</td>
                                <td className="font-bold text-slate-500">#{30000 + item.id}</td>
                                <td className="font-black text-slate-900 group-hover:text-emerald-700 transition-colors uppercase tracking-tight">
                                    {item.menu_name}
                                </td>
                                <td className="text-slate-500 font-bold uppercase">{item.short_name || '--'}</td>
                                <td className="text-slate-600 font-medium">
                                    {item.outlet_name || 'N/A'}
                                    {item._debug && (
                                        <div className="text-[8px] text-slate-400 mt-0.5">
                                            R:{item._debug.received_outlet_id} / T:{item._debug.target_outlet_id} / B:{item._debug.owner_id}
                                        </div>
                                    )}
                                </td>
                                <td className="text-center">
                                    {item.is_pos_default ? (
                                        <div className="flex justify-center"><CheckCircle2 className="w-5 h-5 text-emerald-500" /></div>
                                    ) : (
                                        <div className="flex justify-center"><div className="w-5 h-5 rounded border-2 border-slate-200 bg-slate-50" /></div>
                                    )}
                                </td>
                                <td className="text-center">
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${item.is_digital_default
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            : 'bg-slate-50 text-slate-400 border-slate-100'
                                        }`}>
                                        {item.is_digital_default ? 'Primary' : 'Secondary'}
                                    </span>
                                </td>
                                <td className="text-center">
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${item.is_table_default
                                            ? 'bg-amber-50 text-amber-600 border-amber-200'
                                            : 'bg-slate-50 text-slate-400 border-slate-100'
                                        }`}>
                                        {item.is_table_default ? 'Default Table' : 'Standard'}
                                    </span>
                                </td>
                                <td className="text-center">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Active
                                        </span>
                                        <span className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">{new Date(item.created_at).toLocaleDateString()}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Register Menu Grid Modal (Centered) */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
                            <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                                {isEditingSettings ? <Settings className="w-5 h-5 text-emerald-600" /> : <Plus className="w-5 h-5 text-emerald-600" />}
                                {isEditingSettings ? 'Update Outlet Menu' : 'Register New Outlet Menu'}
                            </h3>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Menu Name *</label>
                                    <input required type="text" className="pro-input h-11 bg-slate-50 border border-slate-200 text-[13px] font-bold" placeholder="e.g. Fine Dine Lunch Menu" value={formData.menu_name} onChange={e => setFormData({ ...formData, menu_name: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Short Name</label>
                                    <input type="text" className="pro-input h-11 bg-slate-50 border border-slate-200 text-[13px] font-bold" placeholder="e.g. FD-LUNCH" value={formData.short_name} onChange={e => setFormData({ ...formData, short_name: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-4 py-4 border-t border-slate-100">
                                <label className="flex items-center gap-2.5 cursor-pointer group">
                                    <input type="checkbox" checked={formData.is_pos_default} onChange={e => setFormData({ ...formData, is_pos_default: e.target.checked })} className="w-4 h-4 accent-emerald-600 rounded" />
                                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">POS Default</span>
                                </label>
                                <label className="flex items-center gap-2.5 cursor-pointer group">
                                    <input type="checkbox" checked={formData.is_digital_default} onChange={e => setFormData({ ...formData, is_digital_default: e.target.checked })} className="w-4 h-4 accent-indigo-600 rounded" />
                                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">Digital Default</span>
                                </label>
                                <label className="flex items-center gap-2.5 cursor-pointer group">
                                    <input type="checkbox" checked={formData.is_table_default} onChange={e => setFormData({ ...formData, is_table_default: e.target.checked })} className="w-4 h-4 accent-amber-600 rounded" />
                                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider group-hover:text-amber-600 transition-colors">Table Order Default</span>
                                </label>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="pro-btn-secondary h-11 px-8 text-slate-500 hover:bg-slate-200">Cancel</button>
                            <button type="submit" className="pro-btn-primary h-11 px-12 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/20">{isEditingSettings ? 'Update Grid' : 'Register Grid'}</button>
                        </div>
                    </form>
                </div>
                , document.body)}

            {/* Online Menu QR Code Modal (Digital Default) */}
            {qrModalMenu && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <QrCode className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-tight">Online Menu QR Code</h3>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{qrModalMenu.menu_name}</p>
                                </div>
                            </div>
                            <button onClick={() => setQrModalMenu(null)} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 flex flex-col items-center gap-4">
                            {(() => {
                                const user = JSON.parse(localStorage.getItem("user") || "{}");
                                const bizId = user.bizId || user.id || 48;
                                const onlineMenuUrl = `${customDomain}/menu/${qrModalMenu.id}`;
                                const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(onlineMenuUrl)}`;

                                return (
                                    <>
                                        <div className="w-56 h-56 bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-center shadow-inner">
                                            <img src={qrImageUrl} alt="Digital Menu QR" className="w-full h-full object-contain" />
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="w-full grid grid-cols-3 gap-2">
                                            <button 
                                                onClick={() => triggerPrint(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(onlineMenuUrl)}`, qrModalMenu.menu_name)}
                                                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                                            >
                                                <Printer className="w-3.5 h-3.5 text-slate-600" /> Print
                                            </button>
                                            <button 
                                                onClick={() => triggerDownload(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(onlineMenuUrl)}`, `${qrModalMenu.menu_name.replace(/\s+/g, '_')}_qr.png`)}
                                                className="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                                            >
                                                <Download className="w-3.5 h-3.5" /> Save PNG
                                            </button>
                                            <button 
                                                onClick={() => generateStandee(qrImageUrl, { name: qrModalMenu.menu_name }, "ORDER")}
                                                className="py-2 px-3 bg-slate-900 hover:bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md"
                                            >
                                                Standee
                                            </button>
                                        </div>

                                        {/* URL Copy Field */}
                                        <div className="w-full space-y-1.5 pt-3 border-t border-slate-100">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Online Menu Direct URL</label>
                                            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1.5">
                                                <input 
                                                    readOnly 
                                                    type="text" 
                                                    value={onlineMenuUrl} 
                                                    className="flex-1 bg-transparent text-[11px] font-mono font-bold text-slate-700 outline-none px-1"
                                                />
                                                <button 
                                                    onClick={() => handleCopyUrl(onlineMenuUrl)}
                                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-all shadow-sm shrink-0"
                                                >
                                                    {copiedUrl ? (
                                                        <>
                                                            <Check className="w-3 h-3" /> Copied!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3 h-3" /> Copy
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>
    );
};

export default OutletMenuManager;
