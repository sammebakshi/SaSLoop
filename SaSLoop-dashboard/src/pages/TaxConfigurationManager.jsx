import React, { useState, useEffect } from "react";
import { Plus, Percent, Trash2, Search, RefreshCw, Filter, Edit3, ShieldAlert, X, Check, Save } from "lucide-react";
import API_BASE from "../config";

const TaxConfigurationManager = () => {
    const [data, setData] = useState([]);
    const [taxGroups, setTaxGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        tax_name: "",
        display_name: "",
        tax_value: "",
        tax_product_group_id: "",
        is_inclusive: false,
        is_dividable: false,
        hide_on_bill: false,
        is_active: true
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const targetId = sessionStorage.getItem("impersonate_id");
            const headers = { "Authorization": `Bearer ${token}` };
            
            // Standardize on outlet_id for consistency across modules
            const queryParams = (targetId && targetId !== "null") ? `?outlet_id=${targetId}` : "";

            // Fetch Taxes
            const res = await fetch(`${API_BASE}/api/brand/taxes${queryParams}`, { headers });
            const taxes = await res.json();
            setData(Array.isArray(taxes) ? taxes : []);

            // Fetch Tax Groups for dropdown
            const groupRes = await fetch(`${API_BASE}/api/brand/tax-groups${queryParams}`, { headers });
            const groups = await groupRes.json();
            setTaxGroups(Array.isArray(groups) ? groups : []);
        } catch (e) {
            console.error("Fetch Error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        
        // Listen for impersonation changes (context switching)
        const handleContextChange = () => fetchData();
        window.addEventListener("storage", handleContextChange);
        return () => window.removeEventListener("storage", handleContextChange);
    }, []);

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                tax_name: item.tax_name,
                display_name: item.display_name,
                tax_value: item.tax_value,
                tax_product_group_id: item.tax_product_group_id,
                is_inclusive: item.is_inclusive,
                is_dividable: item.is_dividable,
                hide_on_bill: item.hide_on_bill,
                is_active: item.is_active
            });
        } else {
            setEditingItem(null);
            setFormData({
                tax_name: "",
                display_name: "",
                tax_value: "",
                tax_product_group_id: "",
                is_inclusive: false,
                is_dividable: false,
                hide_on_bill: false,
                is_active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const targetId = sessionStorage.getItem("impersonate_id");
            const url = editingItem 
                ? `${API_BASE}/api/brand/taxes/${editingItem.id}` 
                : `${API_BASE}/api/brand/taxes`;
            const method = editingItem ? "PUT" : "POST";

            const payload = { 
                ...formData,
                outlet_id: targetId === "global" ? null : targetId
            };

            const res = await fetch(url, {
                method,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchData();
            } else {
                let errorMsg = "Failed to save tax configuration";
                try {
                    const err = await res.json();
                    errorMsg = err.error || errorMsg;
                } catch (parseError) {
                    errorMsg = `Error ${res.status}: ${res.statusText}`;
                }
                alert(errorMsg);
            }
        } catch (e) {
            console.error("Save Error:", e);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this tax rule?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/brand/taxes/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) fetchData();
        } catch (e) {
            console.error("Delete Error:", e);
        }
    };

    const filteredData = data.filter(item => 
        item.tax_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Header Matrix */}
            <div className="flex items-center justify-between bg-white dark:bg-[#1e2129] p-3 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                        <Percent className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="pro-heading">Tax Settings</h2>
                        <p className="pro-subheading">Configure tax rates and calculation rules</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => handleOpenModal()}
                        className="h-9 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md font-bold text-[10px] uppercase tracking-widest shadow-md shadow-indigo-600/10 transition-all"
                    >
                        Add Tax
                    </button>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="bg-white dark:bg-[#1e2129] p-2 px-3 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search tax settings..." 
                        className="bg-transparent text-[11px] font-bold text-slate-600 dark:text-slate-400 outline-none w-full uppercase placeholder:text-slate-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 border-l border-slate-100 dark:border-white/5 pl-3 ml-3">
                    <button onClick={fetchData} className="p-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded text-slate-400 transition-all"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
                </div>
            </div>

            {/* Data Grid */}
            {loading ? (
                <div className="bg-white dark:bg-[#1e2129] p-20 flex flex-col items-center justify-center gap-4 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
                    <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing Taxation Protocols...</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-[#1e2129] rounded-lg border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
                    <table className="pro-table">
                        <thead>
                            <tr>
                                <th className="text-center w-24">Action</th>
                                <th className="text-center w-20">Sr. No.</th>
                                <th>Tax Name</th>
                                <th>Display Protocol</th>
                                <th>Product Group</th>
                                <th className="text-center">Value (%)</th>
                                <th className="text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {filteredData.map((item, idx) => (
                                <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenModal(item)} className="p-1.5 bg-slate-100 dark:bg-white/5 hover:bg-indigo-600 hover:text-white rounded text-slate-400 transition-all border border-slate-200 dark:border-white/10 shadow-sm active:scale-90"><Edit3 className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-slate-100 dark:bg-white/5 hover:bg-rose-600 hover:text-white rounded text-slate-400 transition-all border border-slate-200 dark:border-white/10 shadow-sm active:scale-90"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-slate-400 text-[11px]">{idx + 1}</td>
                                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight text-[12px]">{item.tax_name}</td>
                                    <td className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">{item.display_name}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase border border-slate-200 dark:border-white/5">
                                            {item.group_name || "Uncategorized"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[12px]">{item.tax_value}%</span>
                                    </td>
                                    <td className="px-4 py-2.5 text-center">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                                            item.is_active 
                                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-500/20' 
                                            : 'bg-slate-50 text-slate-400 border border-slate-200'
                                        }`}>
                                            {item.is_active ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="py-32 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-20">
                                            <ShieldAlert className="w-12 h-12" />
                                            <p className="pro-subheading">No taxation records found in this cluster</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
        
        {/* Modal Architecture Moved Outside Animated Container to fix positioning */}
        {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <form onSubmit={handleSave} className="bg-white dark:bg-[#1e2129] w-full max-w-xl rounded-xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
                        <div className="p-4 bg-slate-50 dark:bg-black/20 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                            <h3 className="text-[12px] font-bold text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                <Percent className="w-4 h-4 text-emerald-600" />
                                {editingItem ? "Edit Tax Protocol" : "Add Tax Protocol"}
                            </h3>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tax Name</label>
                                    <input 
                                        type="text" required
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all font-bold text-[12px] uppercase"
                                        placeholder="E.G. VAT, GST, SALES TAX"
                                        value={formData.tax_name}
                                        onChange={(e) => setFormData({...formData, tax_name: e.target.value.toUpperCase()})}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tax Value (%)</label>
                                    <input 
                                        type="number" step="0.01" required
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-emerald-600 dark:text-emerald-400 outline-none focus:border-emerald-500 transition-all font-bold text-[12px]"
                                        placeholder="0.00"
                                        value={formData.tax_value}
                                        onChange={(e) => setFormData({...formData, tax_value: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Display Name</label>
                                    <input 
                                        type="text" required
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all font-bold text-[12px] uppercase"
                                        placeholder="DISPLAY NAME ON BILL"
                                        value={formData.display_name}
                                        onChange={(e) => setFormData({...formData, display_name: e.target.value.toUpperCase()})}
                                    />
                                </div>
                                <div className="space-y-1.5 relative">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tax Product Group</label>
                                    <select 
                                        required
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all font-bold text-[12px] appearance-none cursor-pointer"
                                        value={formData.tax_product_group_id}
                                        onChange={(e) => setFormData({...formData, tax_product_group_id: e.target.value})}
                                    >
                                        <option value="" className="bg-white dark:bg-[#1e2129]">SELECT GROUP</option>
                                        {taxGroups.map((g, index) => (
                                            <option key={g.id || index} value={g.id} className="bg-white dark:bg-[#1e2129]">{g.group_name || g.name || `Group ${g.id}`}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-4 pt-2">
                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-black/20 rounded-lg border border-slate-100 dark:border-white/5 mr-2">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Include In Rate</span>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" className="hidden" checked={formData.is_inclusive} onChange={(e) => setFormData({...formData, is_inclusive: e.target.checked})} />
                                        <div className={`w-10 h-5 rounded-full relative transition-all ${formData.is_inclusive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-white/10'}`}>
                                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.is_inclusive ? 'right-1' : 'left-1'}`} />
                                        </div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-black/20 rounded-lg border border-slate-100 dark:border-white/5 ml-2">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Status</span>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" className="hidden" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} />
                                        <div className={`w-10 h-5 rounded-full relative transition-all ${formData.is_active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-white/10'}`}>
                                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.is_active ? 'right-1' : 'left-1'}`} />
                                        </div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-black/20 rounded-lg border border-slate-100 dark:border-white/5 mr-2">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dividable Tax</span>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" className="hidden" checked={formData.is_dividable} onChange={(e) => setFormData({...formData, is_dividable: e.target.checked})} />
                                        <div className={`w-10 h-5 rounded-full relative transition-all ${formData.is_dividable ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-white/10'}`}>
                                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.is_dividable ? 'right-1' : 'left-1'}`} />
                                        </div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-black/20 rounded-lg border border-slate-100 dark:border-white/5 ml-2">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hide On Bill</span>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" className="hidden" checked={formData.hide_on_bill} onChange={(e) => setFormData({...formData, hide_on_bill: e.target.checked})} />
                                        <div className={`w-10 h-5 rounded-full relative transition-all ${formData.hide_on_bill ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-white/10'}`}>
                                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.hide_on_bill ? 'right-1' : 'left-1'}`} />
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-black/20 border-t border-slate-200 dark:border-white/5 flex gap-3">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white uppercase tracking-widest transition-all">Cancel</button>
                            <button type="submit" className="flex-[2] py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20">
                                {editingItem ? "Update Protocol" : "Create Protocol"}
                            </button>
                        </div>
                    </form>
                </div>
        )}
        </>
    );
};

export default TaxConfigurationManager;
