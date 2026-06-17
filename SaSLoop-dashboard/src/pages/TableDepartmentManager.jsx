import React, { useState, useEffect } from "react";
import { Plus, Table, Trash2, Search, RefreshCw, Filter, Edit3, X, Save, Layers } from "lucide-react";
import API_BASE from "../config";

const TableDepartmentManager = () => {
    const [data, setData] = useState([]);
    const [taxGroups, setTaxGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        department_name: "",
        tax_product_group_id: "",
        is_active: true
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const targetId = sessionStorage.getItem("impersonate_id");
            const queryParams = targetId ? `?target_user_id=${targetId}` : "";
            const headers = { "Authorization": `Bearer ${token}` };

            // Fetch Table Departments
            const res = await fetch(`${API_BASE}/api/brand/table-departments${queryParams}`, { headers });
            const departments = await res.json();
            setData(Array.isArray(departments) ? departments : []);

            // Fetch Tax Product Groups for the dropdown
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
    }, []);

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                department_name: item.department_name,
                tax_product_group_id: item.tax_product_group_id || "",
                is_active: item.is_active
            });
        } else {
            setEditingItem(null);
            setFormData({
                department_name: "",
                tax_product_group_id: "",
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
                ? `${API_BASE}/api/brand/table-departments/${editingItem.id}` 
                : `${API_BASE}/api/brand/table-departments`;
            const method = editingItem ? "PUT" : "POST";

            const payload = { 
                ...formData,
                target_user_id: targetId 
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
                let errorMsg = "Failed to save table department";
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
        if (!window.confirm("Are you sure you want to delete this table department?")) return;
        try {
            const token = localStorage.getItem("token");
            const targetId = sessionStorage.getItem("impersonate_id");
            const queryParams = targetId ? `?target_user_id=${targetId}` : "";

            const res = await fetch(`${API_BASE}/api/brand/table-departments/${id}${queryParams}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) fetchData();
        } catch (e) {
            console.error("Delete Error:", e);
        }
    };

    const filteredData = data.filter(item => 
        item.department_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Header Matrix */}
            <div className="flex items-center justify-between bg-white dark:bg-[#1e2129] p-3 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                        <Table className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="pro-heading">Table Departments</h2>
                        <p className="pro-subheading">Manage seating areas and floor layouts</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => handleOpenModal()}
                        className="h-9 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md font-bold text-[10px] uppercase tracking-widest shadow-md shadow-indigo-600/10 transition-all"
                    >
                        Add Department
                    </button>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="bg-white dark:bg-[#1e2129] p-2 px-3 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search departments..." 
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
            {/* Data Grid */}
            {loading ? (
                <div className="bg-white dark:bg-[#1e2129] p-20 flex flex-col items-center justify-center gap-4 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
                    <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Mapping Floor Plan...</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-[#1e2129] rounded-lg border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
                    <table className="pro-table">
                        <thead>
                            <tr>
                                <th className="text-center w-24">Action</th>
                                <th className="text-center w-20">Sr. No.</th>
                                <th>Department Name</th>
                                <th>Tax Product Group</th>
                                <th>Outlet Context</th>
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
                                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight text-[12px]">{item.department_name}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            {item.tax_group_name || "No Tax Group"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase border border-slate-200 dark:border-white/5">
                                            {item.outlet_name || "Global Cluster"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                                            item.is_active 
                                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 shadow-sm' 
                                            : 'bg-slate-50 text-slate-400 border border-slate-200'
                                        }`}>
                                            {item.is_active ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

        {/* Modal Architecture Moved Outside Animated Container to fix positioning */}
        {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <form onSubmit={handleSave} className="bg-white dark:bg-[#1e2129] w-full max-w-md rounded-xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
                        <div className="p-4 bg-slate-50 dark:bg-black/20 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                            <h3 className="text-[12px] font-bold text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                <Table className="w-4 h-4 text-emerald-600" />
                                {editingItem ? "Edit Table Area" : "Add Table Area"}
                            </h3>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department Name</label>
                                <input 
                                    type="text" required
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all font-bold text-[12px] uppercase"
                                    placeholder="E.G. FINE DINING, ROOFTOP"
                                    value={formData.department_name}
                                    onChange={(e) => setFormData({...formData, department_name: e.target.value.toUpperCase()})}
                                />
                            </div>

                            <div className="space-y-1.5 relative">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tax Product Group</label>
                                <select 
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all font-bold text-[12px] appearance-none cursor-pointer"
                                    value={formData.tax_product_group_id}
                                    onChange={(e) => setFormData({...formData, tax_product_group_id: e.target.value})}
                                >
                                    <option value="" className="bg-white dark:bg-[#1e2129]">SELECT TAX GROUP</option>
                                    {taxGroups.filter(g => g.is_active).map(g => (
                                        <option key={g.id} value={g.id} className="bg-white dark:bg-[#1e2129]">{g.group_name || g.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black/20 rounded-lg border border-slate-100 dark:border-white/5">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Status</span>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                        className="hidden"
                                    />
                                    <div className={`w-10 h-5 rounded-full relative transition-all ${formData.is_active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-white/10'}`}>
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.is_active ? 'right-1' : 'left-1'}`} />
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-black/20 border-t border-slate-200 dark:border-white/5 flex gap-3">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white uppercase tracking-widest transition-all">Cancel</button>
                            <button type="submit" className="flex-[2] py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20">
                                {editingItem ? "Update Area" : "Create Area"}
                            </button>
                        </div>
                    </form>
                </div>
        )}
        </>
    );
};

export default TableDepartmentManager;
