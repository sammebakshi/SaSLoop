import React, { useState, useEffect } from "react";
import { Search, Plus, Filter, ShoppingBag, Settings, Trash2, X, Upload, Activity, RefreshCw, Smartphone, Package, CheckCircle2, Globe, MessageCircle, MoreVertical, Sparkles, Wand2 } from 'lucide-react';
import API_BASE, { isMobileDevice } from "../config";

function DigitalCatalog() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [apiConnected, setApiConnected] = useState(null);
  const isMobile = isMobileDevice();
  
  const [formData, setFormData] = useState({
     businessType: "other",
     settings: {
        menuLink: ""
     }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const [newItem, setNewItem] = useState({
      code: "",
      product_name: "",
      category: "",
      sub_category: "",
      price: "",
      availability: true,
      image_url: "",
      description: "",
      tax_applicable: 1,
      is_veg: false,
      track_stock: false,
      stock_count: "",
      ai_pricing: false
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  // Professional Dialogs
  const [notice, setNotice] = useState(null); // { type: 'success'|'error', message: '' }
  const [confirmAction, setConfirmAction] = useState(null); // { message: '', onConfirm: () => {} }
  const [scanning, setScanning] = useState(false);

  const handleAiScan = async (file) => {
    if (!file) return;
    setScanning(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        const res = await fetch(`${API_BASE}/api/analytics/scan-menu`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ imageBase64: base64 })
        });
        const data = await res.json();
        if (res.ok && data.items) {
           // Bulk add items to the state (or save to DB)
           for (const item of data.items) {
              const saveRes = await fetch(`${API_BASE}/api/catalog`, {
                 method: "POST",
                 headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                 },
                 body: JSON.stringify({
                    product_name: item.name,
                    price: item.price,
                    category: item.category,
                    description: item.description,
                    availability: true,
                    is_veg: true
                 })
              });
              if (saveRes.ok) {
                 const newItem = await saveRes.json();
                 setItems(prev => [newItem, ...prev]);
              }
           }
           showNotice("success", `AI successfully digitized ${data.items.length} items!`);
        } else {
           showNotice("error", data.error || "AI Scan failed");
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
       showNotice("error", "AI Connection Error");
    } finally {
       setScanning(false);
    }
  };


  const showNotice = (type, message) => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 4000);
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        // Connectivity check
        const statusRes = await fetch(`${API_BASE}/api/business/status`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (statusRes.ok) {
            setApiConnected(true);
            const statusData = await statusRes.json();
            const config = {
                businessType: statusData.business?.business_type || "other",
                settings: statusData.business?.settings || {}
            };
            setFormData(config);

            const itemsRes = await fetch(`${API_BASE}/api/catalog`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const itemsData = await itemsRes.json();
            setItems(Array.isArray(itemsData) ? itemsData : []);
        } else {
            setApiConnected(false);
        }

      } catch (err) {
        console.error("API Connection Failed", err);
        setApiConnected(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleImageUpload = async (file, isEdit = false) => {
    if (!file) return;
    try {
        const formData = new FormData();
        formData.append("image", file);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/catalog/upload`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData
        });
        const data = await res.json();
        if (res.ok) {
            if (isEdit) setEditingItem({ ...editingItem, image_url: data.url });
            else setNewItem({ ...newItem, image_url: data.url });
            showNotice("success", "Image uploaded!");
        }
    } catch (e) { 
        console.error(e); 
        showNotice("error", "Upload failed");
    }
  };

  const handleAddItem = async (e) => {
    if (e) e.preventDefault();
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/catalog`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(newItem)
        });
        if (res.ok) {
            const added = await res.json();
            setItems([added, ...items]);
            setNewItem({ code: "", product_name: "", category: "", sub_category: "", price: "", availability: true, image_url: "", description: "", tax_applicable: 1, is_veg: false, track_stock: false, stock_count: "", ai_pricing: false });
            setShowAddForm(false);
            showNotice("success", "Dish added to catalog!");
        }
    } catch (err) {
        console.error(err);
    }
  };

  const handleUpdateItem = async (e) => {
    if (e) e.preventDefault();
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/catalog/${editingItem.id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(editingItem)
        });
        if (res.ok) {
            const updated = await res.json();
            setItems(items.map(i => i.id === updated.id ? updated : i));
            setEditingItem(null);
            showNotice("success", "Dish updated!");
        }
    } catch (e) { console.error(e); }
  };


  
  const [isEnhancing, setIsEnhancing] = useState(false);
  const handleEnhanceImage = async (item) => {
    if (!item.image_url) return showNotice("error", "Add an image first!");
    setIsEnhancing(true);
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/analytics/enhance-image`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ imageUrl: item.image_url, productName: item.product_name })
        });
        const data = await res.json();
        if (data.url) {
            // Automatically update the item image
            const upRes = await fetch(`${API_BASE}/api/catalog/${item.id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ ...item, image_url: data.url })
            });
            if (upRes.ok) {
                setItems(items.map(i => i.id === item.id ? { ...i, image_url: data.url } : i));
                if (editingItem && editingItem.id === item.id) setEditingItem({ ...editingItem, image_url: data.url });
                showNotice("success", "Magic Touch applied! Studio photo ready.");
            }
        } else {
            showNotice("error", data.error || "Enhancement failed");
        }
    } catch (e) {
        showNotice("error", "AI Connection Error");
    } finally {
        setIsEnhancing(false);
    }
  };

  const handleDelete = async (id) => {
      setConfirmAction({
          message: "Delete this dish?",
          onConfirm: async () => {
              try {
                  const token = localStorage.getItem("token");
                  const res = await fetch(`${API_BASE}/api/catalog/${id}`, {
                      method: "DELETE",
                      headers: { "Authorization": `Bearer ${token}` }
                  });
                  if (res.ok) {
                      setItems(items.filter(i => i.id !== id));
                      showNotice("success", "Deleted");
                  }
              } catch (err) { console.error(err); }
              setConfirmAction(null);
          }
      });
  };

  const handleClearCatalog = async () => {
    setConfirmAction({
        message: "Are you sure you want to delete ALL items from your catalog?",
        onConfirm: async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_BASE}/api/catalog/clear`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    setItems([]);
                    showNotice("success", "Catalog cleared");
                }
            } catch (err) { console.error(err); }
            setConfirmAction(null);
        }
    });
  };

  const handleExport = () => {
    const headers = ["SL", "Product Name", "Category", "Sub Category", "Price", "Description", "Image URL", "Tax Applicable", "Availability"];
    const rows = items.map((i, idx) => [
        i.code || `ITM${String(idx + 1).padStart(3, '0')}`,
        i.product_name,
        i.category,
        i.sub_category || "",
        i.price,
        i.description || "",
        i.image_url || "",
        i.tax_applicable === 1 ? 1 : 0,
        i.availability ? "TRUE" : "FALSE"
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `catalog_export_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCurrencySymbol = () => {
    return '\u20B9';
  };

  const handleDownloadTemplate = () => {
    const headers = ["SL", "Product Name", "Category", "Sub Category", "Price", "Description", "Image URL", "Tax Applicable (1/0)", "Availability (TRUE/FALSE)"];
    const rows = [
        ["ITM001", "Butter Chicken", "Main Course", "Spicy", "450", "Classic buttery tomato gravy with tender chicken", "", "1", "TRUE"],
        ["ITM002", "Garlic Naan", "Breads", "Fresh", "40", "Oven fresh bread with garlic and butter", "", "1", "TRUE"],
    ];
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "menu_import_template.csv");
    link.click();
  };

  const filteredItems = items.filter(item => 
      item && (
          item.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.code?.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  if (!user || isLoading) return <div className="h-full flex items-center justify-center p-20 animate-pulse text-slate-400 font-black uppercase text-xs">Loading Catalog...</div>;

  return (
    <div className={`max-w-[1280px] mx-auto w-full pt-4 pb-20 ${isMobile ? 'px-4' : 'px-6'}`}>
      
      {/* HEADER SECTION */}
      <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-4`}>
        <div>
          <h2 className={`${isMobile ? 'text-2xl' : 'text-5xl'} font-black text-slate-900 tracking-tighter uppercase italic underline decoration-orange-500`}>
             Inventory
          </h2>
          {!isMobile && <p className="text-slate-500 text-sm font-bold opacity-50 uppercase tracking-widest mt-1">Manage dishes, prices and photos</p>}
        </div>
        
        <div className={`flex ${isMobile ? 'flex-col w-full' : 'items-center'} gap-2`}>
            <button 
                onClick={handleExport}
                className="px-6 py-4 bg-white border border-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 flex items-center justify-center gap-2"
            >
                <Download className="w-4 h-4 text-indigo-500" /> Export CSV
            </button>
            <button
                onClick={handleDownloadTemplate}
                className="px-6 py-4 bg-white border border-slate-100 text-indigo-500 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 flex items-center justify-center gap-2"
            >
                <FileDown className="w-4 h-4" /> Template
            </button>
            <button
                onClick={handleClearCatalog}
                className="px-6 py-4 bg-white border border-rose-100 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 flex items-center justify-center gap-2"
            >
                <Trash2 className="w-4 h-4" /> Reset
            </button>
            <label className="flex items-center justify-center gap-2 px-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase cursor-pointer hover:bg-black shadow-xl shadow-slate-100 tracking-widest active:scale-95">
                <FileUp className="w-4 h-4 text-orange-500" /> Bulk Import
                <input type="file" onChange={(e) => {
                    const file = e.target.files[0];
                    if(!file) return;
                    const reader = new FileReader();
                    reader.onload = async (evt) => {
                        try {
                            const text = evt.target.result;
                            const rows = text.split(/\r?\n/).filter(l => l.trim().length > 0).slice(1);
                            
                            // Robust CSV parsing helper
                            const parseCSVLine = (line) => {
                                const result = [];
                                let current = '';
                                let inQuotes = false;
                                for (let i = 0; i < line.length; i++) {
                                    const char = line[i];
                                    if (char === '"') { inQuotes = !inQuotes; }
                                    else if (char === ',' && !inQuotes) {
                                        result.push(current.trim());
                                        current = '';
                                    } else { current += char; }
                                }
                                result.push(current.trim());
                                return result;
                            };

                            const parsedItems = rows.map(r => {
                                const cols = parseCSVLine(r);
                                return { 
                                    code: cols[0]?.replace(/^"|"$/g, '') || "",
                                    product_name: cols[1]?.replace(/^"|"$/g, '') || "", 
                                    category: cols[2]?.replace(/^"|"$/g, '') || "", 
                                    sub_category: cols[3]?.replace(/^"|"$/g, '') || "", 
                                    price: parseFloat(cols[4]?.replace(/^"|"$/g, '')) || 0, 
                                    description: cols[5]?.replace(/^"|"$/g, '') || "",
                                    image_url: cols[6]?.replace(/^"|"$/g, '') || "",
                                    tax_applicable: parseInt(cols[7]?.replace(/^"|"$/g, '')) || 0,
                                    availability: cols[8]?.replace(/^"|"$/g, '').toUpperCase() !== 'FALSE' 
                                };
                            }).filter(i => i.product_name && i.product_name.length > 1);

                            if (parsedItems.length === 0) {
                                showNotice("error", "No valid items found in file!");
                                return;
                            }

                            showNotice("info", `Importing ${parsedItems.length} items...`);
                            const token = localStorage.getItem("token");
                            const res = await fetch(`${API_BASE}/api/catalog/import`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                                body: JSON.stringify({ items: parsedItems })
                            });
                            
                            if (res.ok) {
                                showNotice("success", "Import successful!");
                                setTimeout(() => window.location.reload(), 1000);
                            } else {
                                const errData = await res.json();
                                showNotice("error", "Import failed: " + (errData.error || "Server error"));
                            }
                        } catch (err) { 
                            console.error(err);
                            showNotice("error", "Error processing CSV file");
                        }
                    };
                    reader.readAsText(file);
                }} className="hidden" accept=".csv" />
            </label>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex flex-col gap-6">
         <div className="bg-white rounded-[3rem] border-2 border-slate-50 shadow-2xl shadow-slate-200/40 overflow-hidden">
            
            {/* SEARCH & ACTIONS */}
            <div className={`p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/50 backdrop-blur-md`}>
                <div className="flex-1 w-full max-w-md relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Quick search dishes..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-100/50 border border-transparent rounded-2xl pl-14 pr-4 py-4 text-xs font-bold focus:bg-white focus:border-orange-100 outline-none transition-all shadow-inner"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                   <div className="relative group">
                      <input 
                         type="file" 
                         accept="image/*" 
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                         onChange={(e) => handleAiScan(e.target.files[0])}
                         disabled={scanning} />
                       <button className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${scanning ? 'bg-indigo-100 text-indigo-400 animate-pulse' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 group-hover:scale-105'}`}>
                          <Sparkles className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} /> {scanning ? 'AI Scanning...' : 'Import from Photo'}
                       </button>
                    </div>
                   
                   <button 
                      onClick={() => setShowAddForm(true)}
                      className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-100 hover:scale-105 transition-all"
                   >
                      <Plus className="w-4 h-4" /> Add Item
                   </button>
                </div>
            </div>

            {/* ADD FORM */}
            {showAddForm && (
                <div className="p-8 bg-slate-50/50 border-b border-slate-100 animate-in slide-in-from-top duration-300">
                    <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="col-span-full flex items-center gap-6 mb-2">
                           <div className="w-24 h-24 bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-300 relative overflow-hidden shrink-0">
                               {newItem.image_url ? (
                                   <img src={`${API_BASE}${newItem.image_url}`} alt={newItem.product_name} className="w-full h-full object-cover" />
                               ) : (
                                   <Upload className="w-6 h-6 mb-1" />
                               )}
                               <input type="file" onChange={(e) => handleImageUpload(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                           </div>
                           <div className="flex-1">
                               <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-400">Dish Image</p>
                               <p className="text-[8px] font-bold text-slate-300 uppercase leading-none">Click to upload high quality photo</p>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Dish Name</label>
                           <input type="text" placeholder="e.g. Chicken Biryani" required value={newItem.product_name} onChange={e => setNewItem({...newItem, product_name: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-xs font-bold" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Category</label>
                           <input type="text" placeholder="e.g. Main Course" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-xs font-bold" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Sub-Category</label>
                           <input type="text" placeholder="e.g. Spicy" value={newItem.sub_category} onChange={e => setNewItem({...newItem, sub_category: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-xs font-bold" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Price</label>
                           <input type="number" step="0.01" placeholder="0.00" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-xs font-bold" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Tax Applicable</label>
                           <select value={newItem.tax_applicable} onChange={e => setNewItem({...newItem, tax_applicable: parseInt(e.target.value)})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-xs font-bold">
                               <option value={1}>Yes (Apply GST)</option>
                               <option value={0}>No (Tax Free)</option>
                           </select>
                        </div>
                         <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Type</label>
                           <div className="flex gap-2">
                              <button type="button" onClick={() => setNewItem({...newItem, is_veg: true})} className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${newItem.is_veg ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-100' : 'bg-white border-slate-100 text-slate-400'}`}><div className="w-3 h-3 border border-current rounded-sm p-[1px]"><div className="w-full h-full rounded-full bg-current"></div></div> Veg</button>
                              <button type="button" onClick={() => setNewItem({...newItem, is_veg: false})} className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${!newItem.is_veg ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-100' : 'bg-white border-slate-100 text-slate-400'}`}><div className="w-3 h-3 border border-current rounded-sm p-[1px]"><div className="w-full h-full rounded-full bg-current"></div></div> Non-Veg</button>
                           </div>
                         </div>
                         <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Live Inventory</label>
                           <div className="flex items-center justify-between bg-white border border-slate-100 rounded-xl px-5 py-3">
                              <span className="text-xs font-bold text-slate-600">Track Stock?</span>
                              <button type="button" onClick={() => setNewItem({...newItem, track_stock: !newItem.track_stock, stock_count: newItem.track_stock ? "" : (newItem.stock_count || "")})} className={`w-10 h-6 rounded-full relative transition-colors ${newItem.track_stock ? 'bg-orange-500' : 'bg-slate-200'}`}>
                                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${newItem.track_stock ? 'translate-x-5' : 'translate-x-1'}`}></div>
                              </button>
                           </div>
                         </div>
                         {newItem.track_stock && (
                            <div className="space-y-2">
                               <label className="text-[9px] font-black uppercase text-orange-400 tracking-widest pl-1">Current Stock</label>
                               <input type="number" placeholder="e.g. 50" value={newItem.stock_count} onChange={e => setNewItem({...newItem, stock_count: e.target.value})} className="w-full bg-orange-50 border border-orange-100 rounded-xl px-5 py-4 text-xs font-bold text-orange-600 placeholder-orange-300" />
                            </div>
                         )}
                         <div className="space-y-2 col-span-full">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Short Description</label>
                            <input type="text" placeholder="e.g. Traditional spicy curry with roasted spices..." value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-xs font-bold" />
                         </div>
                         <div className="col-span-full pt-4">
                            <button type="submit" className="w-full py-5 bg-orange-500 text-white rounded-[2rem] font-black text-[12px] uppercase shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95">Save new dish</button>
                         </div>
                    </form>
                </div>
            )}

            {/* DATA VIEW */}
            <div className="p-0">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dish</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Category</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tax</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Stock</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Price</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredItems.map(item => (
                            <tr key={item.id} className="hover:bg-slate-50/30 group transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                                            {item.image_url ? <img src={`${API_BASE}${item.image_url}`} alt={item.product_name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center opacity-10"><ShoppingBag className="w-5 h-5" /></div>}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 leading-none mb-1">{item.product_name}</p>
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{item.sub_category || 'General'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <span className="bg-slate-100/50 text-slate-500 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">{item.category}</span>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    {item.tax_applicable === 1 ? <span className="text-[8px] font-black text-emerald-500 uppercase">GST</span> : <span className="text-[8px] font-black text-slate-300 uppercase">OFF</span>}
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        {item.availability ? (
                                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[8px] font-black uppercase">In Stock</span>
                                        ) : (
                                            <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-lg text-[8px] font-black uppercase">Out of Stock</span>
                                        )}
                                        {item.ai_pricing && (
                                            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[8px] font-black uppercase mt-1">AI Pricing</span>
                                        )}
                                        {item.stock_count !== null && item.stock_count !== undefined && (
                                            <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Qty: {item.stock_count}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center font-black text-slate-900 tracking-tighter text-base">{getCurrencySymbol()}{item.price}</td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button 
                                            onClick={() => handleEnhanceImage(item)} 
                                            disabled={isEnhancing}
                                            className={`w-9 h-9 flex items-center justify-center bg-white border border-slate-100 rounded-xl shadow-sm transition-all ${isEnhancing ? 'animate-pulse text-indigo-400' : 'text-indigo-500 hover:scale-110 hover:bg-indigo-50'}`}
                                            title="AI Magic Touch"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => setEditingItem({...item, track_stock: item.stock_count !== null && item.stock_count !== undefined})} className="w-9 h-9 flex items-center justify-center text-slate-400 bg-white border border-slate-100 rounded-xl hover:text-indigo-600 hover:border-indigo-100 shadow-sm"><Settings className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(item.id)} className="w-9 h-9 flex items-center justify-center text-slate-400 bg-white border border-slate-100 rounded-xl hover:text-rose-500 hover:border-rose-100 shadow-sm"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
         </div>
      </div>

      {/* EDIT MODAL */}
      {editingItem && (
          <div className="fixed inset-0 z-[300] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300 overflow-y-auto">
              <div className="bg-white w-full max-w-2xl rounded-[2.5rem] md:rounded-[3rem] overflow-y-auto max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-300 no-scrollbar">
                  <div className="bg-slate-900 p-10 text-white flex justify-between items-center">
                      <div>
                          <h3 className="text-3xl font-black tracking-tighter uppercase italic underline decoration-orange-500">Edit Dish</h3>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mt-1">Refining: {editingItem.product_name}</p>
                      </div>
                      <button onClick={() => setEditingItem(null)} className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20"><X className="w-6 h-6" /></button>
                  </div>
                  <form onSubmit={handleUpdateItem} className="p-10 space-y-8">
                      <div className="flex items-center gap-8 mb-4">
                         <div className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 relative overflow-hidden shrink-0 group">
                             {editingItem.image_url ? (
                                 <img src={`${API_BASE}${editingItem.image_url}`} alt={editingItem.product_name} className="w-full h-full object-cover" />
                             ) : (
                                 <Upload className="w-8 h-8 opacity-20" />
                             )}
                             <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="w-6 h-6 text-white mb-1" />
                                <span className="text-[8px] text-white font-black uppercase">Change Photo</span>
                             </div>
                             <input type="file" onChange={(e) => handleImageUpload(e.target.files[0], true)} className="absolute inset-0 opacity-0 cursor-pointer" />
                         </div>
                         <div className="flex-1 space-y-2">
                             <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Display Status</label>
                             <div className="flex gap-2">
                                <button type="button" onClick={() => setEditingItem({...editingItem, availability: true})} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${editingItem.availability ? 'bg-emerald-500 border-emerald-400 text-white shadow-xl shadow-emerald-100' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>Available</button>
                                <button type="button" onClick={() => setEditingItem({...editingItem, availability: false})} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${!editingItem.availability ? 'bg-rose-500 border-rose-400 text-white shadow-xl shadow-rose-100' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>Out of Stock</button>
                             </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2 col-span-2">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Name</label>
                            <input type="text" value={editingItem.product_name} onChange={e => setEditingItem({...editingItem, product_name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-bold" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Category</label>
                            <input type="text" value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-bold" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Subcategory</label>
                            <input type="text" value={editingItem.sub_category} onChange={e => setEditingItem({...editingItem, sub_category: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-bold" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Price</label>
                            <div className="relative">
                               <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300">{getCurrencySymbol()}</span>
                               <input type="number" step="0.01" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-xs font-bold" />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Tax Applicable</label>
                            <select value={editingItem.tax_applicable} onChange={e => setEditingItem({...editingItem, tax_applicable: parseInt(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-bold">
                               <option value={1}>Yes (Apply GST)</option>
                               <option value={0}>No (Tax Free)</option>
                            </select>
                         </div>
                         <div className="space-y-2 col-span-2">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Short Description</label>
                            <input type="text" value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} placeholder="Short product bio..." className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-bold" />
                         </div>
                         <div className="space-y-2 col-span-2">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Veg / Non-Veg</label>
                            <div className="flex gap-2">
                               <button type="button" onClick={() => setEditingItem({...editingItem, is_veg: true})} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${editingItem.is_veg ? 'bg-emerald-500 border-emerald-400 text-white shadow-xl shadow-emerald-100' : 'bg-slate-50 border-slate-100 text-slate-400'}`}><div className="w-3 h-3 border border-current rounded-sm p-[1px]"><div className="w-full h-full rounded-full bg-current"></div></div> Vegetarian</button>
                               <button type="button" onClick={() => setEditingItem({...editingItem, is_veg: false})} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${!editingItem.is_veg ? 'bg-rose-500 border-rose-400 text-white shadow-xl shadow-rose-100' : 'bg-slate-50 border-slate-100 text-slate-400'}`}><div className="w-3 h-3 border border-current rounded-sm p-[1px]"><div className="w-full h-full rounded-full bg-current"></div></div> Non-Veg</button>
                            </div>
                         </div>
                         <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Live Inventory</label>
                           <div className="flex items-center justify-between bg-slate-50 border-none rounded-2xl px-6 py-3">
                              <span className="text-xs font-bold text-slate-600">Track Stock?</span>
                              <button type="button" onClick={() => setEditingItem({...editingItem, track_stock: !editingItem.track_stock, stock_count: editingItem.track_stock ? null : (editingItem.stock_count || 0)})} className={`w-10 h-6 rounded-full relative transition-colors ${editingItem.track_stock ? 'bg-orange-500' : 'bg-slate-300'}`}>
                                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${editingItem.track_stock ? 'translate-x-5' : 'translate-x-1'}`}></div>
                              </button>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase text-indigo-400 tracking-widest pl-1">AI Smart Pricing</label>
                           <div className="flex items-center justify-between bg-indigo-50/30 border border-indigo-100 rounded-2xl px-6 py-3">
                              <span className="text-xs font-bold text-indigo-600">Auto Surge/Discount?</span>
                              <button type="button" onClick={() => setEditingItem({...editingItem, ai_pricing: !editingItem.ai_pricing})} className={`w-10 h-6 rounded-full relative transition-colors ${editingItem.ai_pricing ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${editingItem.ai_pricing ? 'translate-x-5' : 'translate-x-1'}`}></div>
                              </button>
                           </div>
                        </div>
                         {editingItem.track_stock && (
                            <div className="space-y-2">
                               <label className="text-[9px] font-black uppercase text-orange-400 tracking-widest pl-1">Current Stock Qty</label>
                               <input type="number" value={editingItem.stock_count === null ? '' : editingItem.stock_count} onChange={e => setEditingItem({...editingItem, stock_count: e.target.value})} className="w-full bg-orange-50/50 border-none rounded-2xl px-6 py-4 text-xs font-bold text-orange-600" />
                            </div>
                         )}
                      </div>

                      <div className="flex gap-4 pt-4">
                         <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-5 bg-slate-100 text-slate-600 font-black text-[11px] uppercase rounded-2xl tracking-widest">Discard Changes</button>
                         <button type="submit" className="flex-2 px-12 py-5 bg-slate-900 text-white font-black text-[11px] uppercase rounded-2xl tracking-widest shadow-2xl shadow-slate-200">Save Updates</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
      {notice && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[500] bg-slate-900 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-3 animate-slide-up">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <span className="font-black text-[10px] uppercase tracking-widest">{notice.message}</span>
        </div>
      )}
      {confirmAction && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm p-12 rounded-[3.5rem] shadow-2xl text-center animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <AlertCircle className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter uppercase italic">Confirm Action</h4>
                <p className="text-slate-400 text-xs font-bold mb-10 uppercase tracking-widest leading-relaxed px-4">{confirmAction.message}</p>
                <div className="flex gap-4">
                    <button onClick={() => setConfirmAction(null)} className="flex-1 py-5 bg-slate-100 text-slate-400 font-black text-[11px] uppercase rounded-2xl transition-all active:scale-95">Cancel</button>
                    <button onClick={confirmAction.onConfirm} className="flex-1 py-5 bg-rose-500 text-white font-black text-[11px] uppercase rounded-2xl shadow-xl shadow-rose-100 transition-all active:scale-95">Yes, Delete</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default DigitalCatalog;
