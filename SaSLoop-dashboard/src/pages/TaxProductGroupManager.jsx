import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  Package, Plus, Trash2, Edit3, 
  Search, RefreshCw, X, ShieldCheck,
  AlertCircle, Layers
} from "lucide-react";
import API_BASE from "../config";

const TaxProductGroupManager = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [groupName, setGroupName] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const targetId = sessionStorage.getItem("impersonate_id");
            const queryParams = targetId ? `?outlet_id=${targetId}` : "";
            
            const res = await fetch(`${API_BASE}/api/brand/tax-groups${queryParams}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setGroups(data);
            }
        } catch (err) {
            console.error("Failed to fetch tax product groups:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const filteredGroups = groups.filter(g => 
        g.group_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = (group = null) => {
        if (group) {
            setEditingGroup(group);
            setGroupName(group.group_name);
        } else {
            setEditingGroup(null);
            setGroupName("");
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!groupName.trim()) return;

        try {
            const token = localStorage.getItem("token");
            const targetId = sessionStorage.getItem("impersonate_id");
            const method = editingGroup ? "PUT" : "POST";
            const url = editingGroup 
                ? `${API_BASE}/api/brand/tax-groups/${editingGroup.id}`
                : `${API_BASE}/api/brand/tax-groups`;

            const res = await fetch(url, {
                method,
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    group_name: groupName.toUpperCase(),
                    outlet_id: targetId
                })
            });

            if (res.ok) {
                fetchGroups();
                setShowModal(false);
                setGroupName("");
                setEditingGroup(null);
            } else {
                const errorData = await res.json();
                alert(`Error: ${errorData.error || 'Failed to save group'}`);
            }
        } catch (err) {
            console.error("Failed to save group:", err);
            alert("Connection error.");
        }
    };

    const deleteGroup = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const targetId = sessionStorage.getItem("impersonate_id");
            const queryParams = targetId ? `?target_user_id=${targetId}` : "";
            
            const res = await fetch(`${API_BASE}/api/brand/tax-groups/${id}${queryParams}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setGroups(prev => prev.filter(g => g.id !== id));
                setConfirmDelete(null);
            }
        } catch (err) {
            console.error("Failed to delete group:", err);
        }
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Header Control Hub */}
            <div className="flex items-center justify-between bg-white dark:bg-[#1e2129] p-3 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                        <Layers className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="pro-heading">Tax Groups</h2>
                        <p className="pro-subheading">Group products for specific tax rules</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchGroups} className="h-10 w-10 flex items-center justify-center bg-white dark:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg border border-slate-200 dark:border-white/5 transition-all shadow-sm"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
                    <button 
                        onClick={() => openModal()}
                        className="h-10 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] uppercase tracking-[0.1em] transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> Register Group
                    </button>
                    <div className="h-10 px-4 flex items-center bg-white dark:bg-white/5 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200 dark:border-white/5 shadow-sm">
                        {groups.length} Nodes
                    </div>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="bg-white dark:bg-[#1e2129] p-3 rounded-lg border border-slate-200 dark:border-white/5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 flex-1">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="SEARCH TAX GROUPS..." 
                        className="bg-transparent text-[11px] font-bold text-slate-600 dark:text-slate-300 placeholder:text-slate-300 outline-none w-full uppercase"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Industrial Data Grid */}
            <div className="bg-white dark:bg-[#1e2129] rounded-lg border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
                <table className="pro-table">
                    <thead>
                        <tr>
                            <th className="text-center w-24">Action</th>
                            <th className="text-center w-16">Sr. No.</th>
                            <th>Tax Product Group Name</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse"><td colSpan="3" className="px-6 py-4"><div className="h-10 bg-slate-100 dark:bg-white/5 rounded" /></td></tr>
                            ))
                        ) : filteredGroups.length === 0 ? (
                            <tr><td colSpan="3" className="py-24 text-center opacity-20"><Layers className="w-12 h-12 mx-auto mb-4" /><p className="text-[11px] font-bold uppercase tracking-widest">No Groups Registered</p></td></tr>
                        ) : (
                            filteredGroups.map((group, index) => (
                                <tr key={group.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all">
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openModal(group)} className="p-1.5 bg-slate-100 dark:bg-white/5 hover:bg-indigo-600 hover:text-white rounded text-slate-400 transition-all border border-slate-200 dark:border-white/10 shadow-sm active:scale-90"><Edit3 className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => setConfirmDelete(group)} className="p-1.5 bg-slate-100 dark:bg-white/5 hover:bg-rose-600 hover:text-white rounded text-slate-400 transition-all border border-slate-200 dark:border-white/10 shadow-sm active:scale-90"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-slate-400 text-[11px]">{index + 1}</td>
                                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white uppercase tracking-tight text-[12px]">{group.group_name}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Architecture */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1e2129] w-full max-w-md rounded-xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
                        <div className="p-4 bg-slate-50 dark:bg-black/20 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                            <h3 className="text-[12px] font-bold text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                <Layers className="w-4 h-4 text-emerald-600" />
                                {editingGroup ? 'Update Tax Group' : 'Register Tax Group'}
                            </h3>
                            <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all"><X className="w-5 h-5" /></button>
                        </div>
                        
                        <div className="p-6 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Group Identity</label>
                                <input 
                                    autoFocus
                                    required 
                                    value={groupName} 
                                    onChange={e => setGroupName(e.target.value.toUpperCase())} 
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all font-bold text-[12px] uppercase" 
                                    placeholder="E.G. FOOD, ALCOHOL, TOBACCO" 
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-black/20 border-t border-slate-200 dark:border-white/5 flex gap-3">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white uppercase tracking-widest transition-all">Cancel</button>
                            <button type="submit" className="flex-[2] py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20">
                                {editingGroup ? 'Update Hierarchy' : 'Authorize Group'}
                            </button>
                        </div>
                    </form>
                </div>
            )}


            {/* Confirmation Modal Architecture */}
            {confirmDelete && createPortal(
                <div className="pro-modal-overlay">
                    <div className="pro-modal-content max-w-sm overflow-hidden">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100 dark:border-rose-500/20">
                                <Trash2 className="w-8 h-8 text-rose-500" />
                            </div>
                            <h3 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Delete Group?</h3>
                            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed">
                                Are you sure you want to remove <span className="text-slate-900 dark:text-white">{confirmDelete.group_name}</span>? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex border-t border-slate-100 dark:border-white/5">
                            <button 
                                onClick={() => setConfirmDelete(null)}
                                className="flex-1 px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-r border-slate-100 dark:border-white/5"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => deleteGroup(confirmDelete.id)}
                                className="flex-1 px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            , document.body)}

        </div>
    );

};

export default TaxProductGroupManager;
