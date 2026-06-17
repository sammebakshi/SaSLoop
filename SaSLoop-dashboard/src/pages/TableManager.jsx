import React, { useState, useEffect, useRef } from "react";
import { 
    Plus, Grid, Trash2, Search, RefreshCw, 
    Filter, Edit3, MapPin, Download, Upload,
    CheckCircle2, XCircle, AlertCircle, FileSpreadsheet,
    ChevronRight, MoreVertical, Layout, Smartphone
} from "lucide-react";
import API_BASE from "../config";

const TableManager = () => {
    const [data, setData] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const fileInputRef = useRef(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        department_id: "",
        max_persons: 4,
        is_active: true
    });

    const targetUserId = sessionStorage.getItem("impersonate_id");
    const headers = {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const queryParams = targetUserId ? `?target_user_id=${targetUserId}` : "";
            const [tableRes, deptRes] = await Promise.all([
                fetch(`${API_BASE}/api/brand/tables${queryParams}`, { headers }),
                fetch(`${API_BASE}/api/brand/table-departments${queryParams}`, { headers })
            ]);
            
            const tables = await tableRes.json();
            const depts = await deptRes.json();
            
            setData(Array.isArray(tables) ? tables : []);
            setDepartments(Array.isArray(depts) ? depts : []);
        } catch (e) {
            console.error("Fetch Error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [targetUserId]);

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                department_id: item.department_id || "",
                max_persons: item.max_persons || 4,
                is_active: item.is_active
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: "",
                department_id: departments.length > 0 ? departments[0].id : "",
                max_persons: 4,
                is_active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = editingItem ? "PUT" : "POST";
            const url = editingItem 
                ? `${API_BASE}/api/brand/tables/${editingItem.id}` 
                : `${API_BASE}/api/brand/tables`;
            
            const payload = { 
                ...formData,
                target_user_id: targetUserId 
            };

            const res = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchData();
            } else {
                const err = await res.json();
                alert(err.error || "Operation failed");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this table?")) return;
        try {
            const queryParams = targetUserId ? `?target_user_id=${targetUserId}` : "";
            const res = await fetch(`${API_BASE}/api/brand/tables/${id}${queryParams}`, {
                method: "DELETE",
                headers
            });
            if (res.ok) fetchData();
        } catch (e) {
            console.error(e);
        }
    };

    const handleBulkUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append("file", file);
        if (targetUserId) uploadData.append("target_user_id", targetUserId);
        if (formData.department_id) uploadData.append("department_id", formData.department_id);

        try {
            const res = await fetch(`${API_BASE}/api/brand/tables/bulk-upload`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
                body: uploadData
            });

            if (res.ok) {
                const result = await res.json();
                alert(`Successfully uploaded ${result.count} tables!`);
                setIsUploadModalOpen(false);
                fetchData();
            } else {
                const err = await res.json();
                alert(err.error || "Upload failed");
            }
        } catch (e) {
            console.error(e);
            alert("Network error during upload");
        }
    };

    const filteredData = data.filter(item => 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.department_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Header Matrix */}
            <div className="flex items-center justify-between bg-white dark:bg-[#1e2129] p-3 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                        <Grid className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="pro-heading">Tables</h2>
                        <p className="pro-subheading">Manage restaurant tables and seating capacity</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchData} className="h-10 w-10 flex items-center justify-center bg-white dark:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg border border-slate-200 dark:border-white/5 transition-all shadow-sm"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
                    
                    <div className="flex items-center bg-white dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
                        <button onClick={() => setIsUploadModalOpen(true)} className="h-10 px-4 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-[0.1em] hover:bg-slate-50 dark:hover:bg-white/5 border-r border-slate-200 dark:border-white/5 transition-all flex items-center gap-2">
                            <Upload className="w-4 h-4 text-emerald-600" /> Upload
                        </button>
                        <a href={`${API_BASE}/samples/table_upload_sample.xlsx`} download className="h-10 px-4 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-[0.1em] hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center gap-2">
                            <Download className="w-4 h-4 text-emerald-600" /> Template
                        </a>
                    </div>

                    <button onClick={() => handleOpenModal()} className="pro-btn-primary h-10 px-5">
                        <Plus className="w-4 h-4" /> Add Table
                    </button>
                    <div className="h-10 px-4 flex items-center bg-white dark:bg-white/5 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200 dark:border-white/5 shadow-sm">
                        {data.length} Nodes
                    </div>
                </div>
            </div>

            {/* Tactical Search & Filter Bar */}
            {/* Filter Hub */}
            <div className="bg-white dark:bg-[#1e2129] p-3 rounded-lg border border-slate-200 dark:border-white/5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 flex-1">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="SEARCH TABLES BY NAME OR DEPARTMENT..." 
                        className="bg-transparent text-[11px] font-bold text-slate-600 dark:text-slate-300 placeholder:text-slate-300 outline-none w-full uppercase"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Industrial Data Grid */}
            {/* Industrial Data Grid */}
            <div className="bg-white dark:bg-[#1e2129] rounded-lg border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
                <table className="pro-table">
                    <thead>
                        <tr>
                            <th className="text-center w-24">Action</th>
                            <th className="text-center w-16">Sr. No.</th>
                            <th>Table Name</th>
                            <th>Department Name</th>
                            <th>Outlet Name</th>
                            <th className="text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan="6" className="px-4 py-4"><div className="h-8 bg-slate-100 dark:bg-white/5 rounded" /></td>
                                </tr>
                            ))
                        ) : filteredData.map((item, index) => (
                            <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all">
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleOpenModal(item)} className="p-1.5 bg-slate-100 dark:bg-white/5 hover:bg-indigo-600 hover:text-white rounded text-slate-400 transition-all border border-slate-200 dark:border-white/10 shadow-sm active:scale-90"><Edit3 className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-slate-100 dark:bg-white/5 hover:bg-rose-600 hover:text-white rounded text-slate-400 transition-all border border-slate-200 dark:border-white/10 shadow-sm active:scale-90"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center font-bold text-slate-400 text-[11px]">{index + 1}</td>
                                <td className="px-6 py-4 font-bold text-slate-800 dark:text-white uppercase tracking-tight text-[12px]">{item.name}</td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{item.department_name || 'Unassigned'}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{item.outlet_name || 'Main Outlet'}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                                        item.is_active 
                                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-500/20' 
                                        : 'bg-slate-50 text-slate-400 border border-slate-200'
                                    }`}>
                                        {item.is_active ? 'Active' : 'Offline'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {!loading && filteredData.length === 0 && (
                            <tr>
                                <td colSpan="6" className="py-24 text-center">
                                    <div className="flex flex-col items-center opacity-30">
                                        <Grid className="w-12 h-12 mb-4" />
                                        <p className="pro-subheading text-[12px]">No spatial nodes detected in current context</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Modal Architecture Moved Outside Animated Container to fix positioning */}
        {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1e2129] w-full max-w-md rounded-xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
                    <div className="p-4 bg-slate-50 dark:bg-black/20 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                        <h3 className="text-[12px] font-bold text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                            <Grid className="w-4 h-4 text-emerald-600" />
                            {editingItem ? 'Edit Table Node' : 'Register New Table'}
                        </h3>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all"><XCircle className="w-5 h-5" /></button>
                    </div>

                    <div className="p-6 space-y-5">
                        {departments.length === 0 && (
                            <div className="p-3 bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/10 rounded-lg flex items-start gap-3">
                                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                                <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase leading-relaxed">
                                    No active departments found. Please register a department before adding tables.
                                </p>
                            </div>
                        )}
                        
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Table Name / ID</label>
                            <input 
                                required
                                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all font-bold text-[12px] uppercase"
                                placeholder="E.G. T1, VIP-01"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value.toUpperCase()})}
                            />
                        </div>

                        <div className="space-y-1.5 relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assigned Department</label>
                            <select 
                                required
                                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all font-bold text-[12px] appearance-none cursor-pointer"
                                value={formData.department_id}
                                onChange={(e) => setFormData({...formData, department_id: e.target.value})}
                            >
                                <option value="" className="bg-white dark:bg-[#1e2129]">SELECT DEPARTMENT</option>
                                {departments.filter(d => d.is_active).map(dept => (
                                    <option key={dept.id} value={dept.id} className="bg-white dark:bg-[#1e2129]">{dept.department_name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Capacity (Persons)</label>
                                <input 
                                    type="number"
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all font-bold text-[12px]"
                                    placeholder="4"
                                    value={formData.max_persons}
                                    onChange={(e) => setFormData({...formData, max_persons: parseInt(e.target.value)})}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Status</label>
                                <div className="h-[46px] flex items-center justify-between px-4 bg-slate-50 dark:bg-black/20 rounded-lg border border-slate-200 dark:border-white/10">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase">{formData.is_active ? 'Active' : 'Offline'}</span>
                                    <label className="flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="hidden"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                        />
                                        <div className={`w-9 h-5 rounded-full relative transition-all ${formData.is_active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-white/10'}`}>
                                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.is_active ? 'right-1' : 'left-1'}`} />
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-black/20 border-t border-slate-200 dark:border-white/5 flex gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white uppercase tracking-widest transition-all">Cancel</button>
                        <button type="submit" className="flex-[2] py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20">
                            {editingItem ? 'Update Node' : 'Register Node'}
                        </button>
                    </div>
                </form>
            </div>
        )}

        {/* Upload Modal Architecture */}
        {isUploadModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white dark:bg-[#1e2129] w-full max-w-md rounded-xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
                    <div className="p-4 bg-slate-50 dark:bg-black/20 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                        <h3 className="text-[12px] font-bold text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                            <Upload className="w-4 h-4 text-emerald-600" />
                            Bulk Upload Tables
                        </h3>
                        <button type="button" onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all"><XCircle className="w-5 h-5" /></button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div 
                            className="p-8 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-black/20 flex flex-col items-center gap-3 group hover:border-emerald-500 transition-all cursor-pointer"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-all">
                                <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div className="text-center">
                                <p className="text-[11px] font-bold text-slate-700 dark:text-white uppercase tracking-widest">Select Excel Data Source</p>
                                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Supports .xlsx, .xls formats</p>
                            </div>
                            <input 
                                type="file" 
                                className="hidden" 
                                ref={fileInputRef}
                                accept=".xlsx, .xls"
                                onChange={handleBulkUpload}
                            />
                        </div>

                        <div className="space-y-1.5 relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assign to Department</label>
                            <select 
                                required
                                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all font-bold text-[12px] appearance-none cursor-pointer"
                                value={formData.department_id}
                                onChange={(e) => setFormData({...formData, department_id: e.target.value})}
                            >
                                <option value="" className="bg-white dark:bg-[#1e2129]">SELECT TARGET DEPARTMENT</option>
                                {departments.filter(d => d.is_active).map(dept => (
                                    <option key={dept.id} value={dept.id} className="bg-white dark:bg-[#1e2129]">{dept.department_name}</option>
                                ))}
                            </select>
                        </div>

                        <button 
                            onClick={() => setIsUploadModalOpen(false)}
                            className="w-full py-2.5 text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white uppercase tracking-widest transition-all"
                        >
                            Cancel Upload
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default TableManager;
