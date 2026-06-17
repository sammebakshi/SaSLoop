import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Plus, Trash2, Edit3, X, Check, Shield, Lock, Monitor, Package, BarChart3, Users, Layout, Zap, AlertCircle, Search, RefreshCw } from "lucide-react";
import API_BASE from "../config";

const standardRoles = [
    "Manager / Admin",
    "Billing User / Cashier",
    "Captain / Steward",
    "Waiter / Server",
    "Kitchen Staff / Chef",
    "Delivery Boy",
    "Inventory Manager",
    "Other"
];

const DesignationManager = () => {
    const [designations, setDesignations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: standardRoles[0], is_active: true });
    const [customName, setCustomName] = useState("");
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorModal, setErrorModal] = useState(null);

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => setShowSuccess(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    const fetchDesignations = async () => {
        try {
            const impersonateId = sessionStorage.getItem("impersonate_id");
            let url = `${API_BASE}/api/brand/designations`;
            const params = new URLSearchParams();
            if (impersonateId) {
                params.append("target_user_id", impersonateId);
                params.append("outlet_id", impersonateId);
            }
            if (params.toString()) url += `?${params.toString()}`;

            const res = await fetch(url, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            const data = await res.json();
            setDesignations(Array.isArray(data) ? data : []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchDesignations(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingId ? "PUT" : "POST";
        const url = editingId ? `${API_BASE}/api/brand/designations/${editingId}` : `${API_BASE}/api/brand/designations`;
        
        try {
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const finalName = formData.name === "Other" ? customName : formData.name;

            const res = await fetch(url, {
                method,
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ 
                    name: finalName,
                    is_active: formData.is_active,
                    target_user_id: impersonateId,
                    outlet_id: impersonateId 
                })
            });
            if (res.ok) {
                setShowSuccess(true);
                setIsModalOpen(false);
                setEditingId(null);
                setFormData({ name: standardRoles[0], is_active: true });
                fetchDesignations();
            } else {
                const errData = await res.json();
                setIsModalOpen(false); // Close the add/edit form immediately as requested
                setErrorModal(errData.error || "Update Failed");
            }
        } catch (e) { 
            console.error(e); 
        }
    };

    const openEdit = (d) => {
        setEditingId(d.id);
        setFormData({ 
            name: d.name, 
            is_active: d.is_active !== false
        });
        setIsModalOpen(true);
    };

    const executeDelete = async () => {
        if (!confirmDeleteId) return;
        try {
            const res = await fetch(`${API_BASE}/api/brand/designations/${confirmDeleteId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.ok) {
                setConfirmDeleteId(null);
                setShowSuccess(true);
                fetchDesignations();
            } else {
                const err = await res.json();
                setErrorModal(err.error || "Deletion failed");
                setConfirmDeleteId(null);
            }
        } catch (e) { console.error(e); }
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Header Hub */}
            <div className="flex items-center justify-between bg-white dark:bg-[#1e2129] p-3 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                        <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="pro-heading">Designation Management</h2>
                        <p className="pro-subheading">Manage job roles and staff titles</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => { setEditingId(null); setFormData({ name: standardRoles[0], is_active: true }); setCustomName(""); setIsModalOpen(true); }}
                        className="h-9 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md font-bold text-[10px] uppercase tracking-widest shadow-md shadow-indigo-600/10 transition-all"
                    >
                        Add Designation
                    </button>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="bg-white dark:bg-[#1e2129] p-2 px-3 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input type="text" placeholder="Search designations..." className="bg-transparent text-[11px] font-bold text-slate-600 dark:text-slate-400 outline-none w-full uppercase placeholder:text-slate-300" />
                </div>
                <div className="flex items-center gap-2 border-l border-slate-100 dark:border-white/5 pl-3 ml-3">
                    <button onClick={fetchDesignations} className="p-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded text-slate-400 transition-all"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
                </div>
            </div>

            {/* Registry Matrix Grid */}
            <div className="bg-white dark:bg-[#1e2129] rounded-lg border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                <table className="pro-table">
                    <thead>
                        <tr>
                            <th className="w-16">#</th>
                            <th>Designation Identity</th>
                            <th className="text-right">Operational Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {loading ? (
                            <tr><td colSpan="3" className="py-20 text-center animate-pulse text-[10px] uppercase tracking-widest font-bold text-slate-400">Scanning Registry...</td></tr>
                        ) : designations.map((d, i) => (
                            <tr key={d.id} onClick={() => openEdit(d)} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all cursor-pointer group">
                                <td className="px-6 py-4 text-[11px] font-bold text-slate-400">{i + 1}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-[12px] font-bold text-slate-800 dark:text-white uppercase tracking-tight">{d.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${d.is_active !== false ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500 border border-rose-200 dark:border-rose-500/20'}`}>
                                            {d.is_active !== false ? 'Active' : 'Disabled'}
                                        </span>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(d.id); }}
                                            className="p-1 text-rose-400 hover:text-rose-600 dark:hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Action Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1e2129] w-full max-w-lg rounded-xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
                        <div className="p-4 bg-slate-50 dark:bg-black/20 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                            <h3 className="text-[12px] font-bold text-slate-800 dark:text-white uppercase tracking-widest">{editingId ? "Update Designation" : "Add Designation"}</h3>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Designation</label>
                                {editingId ? (
                                    <div className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-500 dark:text-slate-400 font-bold text-[12px] cursor-not-allowed flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Lock className="w-3.5 h-3.5 opacity-50" />
                                            {formData.name}
                                        </div>
                                        <span className="text-[9px] uppercase tracking-widest opacity-30">Immutable</span>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <select 
                                            required
                                            value={formData.name}
                                            onChange={e => {
                                                const newName = e.target.value;
                                                setFormData(prev => ({ ...prev, name: newName }));
                                            }}
                                            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all font-bold text-[12px] appearance-none cursor-pointer"
                                        >
                                            {standardRoles.map(role => (
                                                <option key={role} value={role} className="bg-white dark:bg-[#1e2129] text-slate-900 dark:text-white font-bold">{role}</option>
                                            ))}
                                        </select>

                                        {formData.name === "Other" && (
                                            <div className="animate-in fade-in duration-300 slide-in-from-top-2">
                                                <input 
                                                    type="text"
                                                    required
                                                    placeholder="ENTER CUSTOM DESIGNATION..."
                                                    value={customName}
                                                    onChange={e => setCustomName(e.target.value.toUpperCase())}
                                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all font-bold text-[12px] uppercase"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black/20 rounded-lg border border-slate-200 dark:border-white/5">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Status</span>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.is_active}
                                        onChange={e => setFormData({...formData, is_active: e.target.checked})}
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
                                {editingId ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            )}


            {/* Custom Delete Dialogue */}
            {confirmDeleteId && createPortal(
                <div className="pro-modal-overlay">
                    <div className="pro-modal-content max-w-xs p-8 text-center">
                        <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"><AlertCircle className="w-8 h-8" /></div>
                        <h4 className="text-[16px] font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2 leading-tight">Delete this designation?</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8">This action cannot be undone</p>
                        <div className="flex gap-4">
                            <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-3 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all">Cancel</button>
                            <button onClick={executeDelete} className="flex-[2] py-3 bg-rose-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500 transition-all shadow-xl shadow-rose-600/20">Confirm</button>
                        </div>
                    </div>
                </div>
            , document.body)}


            {showSuccess && createPortal(
                <div className="pro-modal-overlay z-[2000] !bg-slate-900/40 backdrop-blur-sm">
                    <div className="pro-modal-content max-w-xs p-10 text-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-emerald-500/5">
                            <Check className="w-12 h-12" />
                        </div>
                        <h4 className="text-[20px] font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">Success !</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em]">Changes has been updated</p>
                    </div>
                </div>
            , document.body)}


            {/* Unified Error Dialogue - Centered */}
            {errorModal && createPortal(
                <div className="pro-modal-overlay z-[3000]">
                    <div className="pro-modal-content max-w-xs p-10 text-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-rose-500/5">
                            <AlertCircle className="w-12 h-12" />
                        </div>
                        <h4 className="text-[18px] font-black text-slate-800 dark:text-white uppercase tracking-tight mb-4 leading-tight">Registry Exception</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] leading-relaxed mb-10 px-4">{errorModal}</p>
                        <button 
                            onClick={() => setErrorModal(null)} 
                            className="w-full py-4 bg-slate-900 dark:bg-rose-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black dark:hover:bg-rose-500 transition-all shadow-xl shadow-rose-600/20"
                        >
                            Acknowledge
                        </button>
                    </div>
                </div>
            , document.body)}

        </div>
    );
};

export default DesignationManager;

