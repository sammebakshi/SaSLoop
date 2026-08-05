import React, { useState, useEffect } from "react";
import { 
  Building2, Search, RefreshCw, Plus, Edit3, Trash2, 
  X, Truck, Phone, Mail, MapPin, FileText
} from "lucide-react";
import API_BASE from "../config";

const VendorManager = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    
    const [form, setForm] = useState({
        name: "",
        contact_person: "",
        phone: "",
        email: "",
        address: "",
        gst_number: "",
        opening_balance: 0,
        payment_terms: "Immediate"
    });

    const getAuthHeaders = () => {
        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        };
    };

    const getImpersonateParam = () => {
        const impId = sessionStorage.getItem("impersonate_id");
        return impId && impId !== "global" ? `?target_user_id=${impId}` : "";
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const q = getImpersonateParam();
            const res = await fetch(`${API_BASE}/api/inventory/vendors${q}`, {
                headers: getAuthHeaders()
            });
            const d = await res.json();
            setVendors(Array.isArray(d) ? d : []);
        } catch (e) {
            console.error("Fetch vendors error:", e);
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
            setForm({
                name: item.name || "",
                contact_person: item.contact_person || "",
                phone: item.phone || "",
                email: item.email || "",
                address: item.address || "",
                gst_number: item.gst_number || "",
                opening_balance: item.opening_balance || 0,
                payment_terms: item.payment_terms || "Immediate"
            });
        } else {
            setEditingItem(null);
            setForm({
                name: "",
                contact_person: "",
                phone: "",
                email: "",
                address: "",
                gst_number: "",
                opening_balance: 0,
                payment_terms: "Immediate"
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return alert("Vendor Name is required");

        try {
            const q = getImpersonateParam();
            const body = { ...form };
            if (editingItem) body.id = editingItem.id;

            const res = await fetch(`${API_BASE}/api/inventory/vendors${q}`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchData();
            } else {
                const err = await res.json();
                alert(`Error: ${err.error || "Failed to save vendor"}`);
            }
        } catch (e) {
            console.error("Save vendor error:", e);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this vendor supplier?")) return;
        try {
            const q = getImpersonateParam();
            const res = await fetch(`${API_BASE}/api/inventory/vendors/${id}${q}`, {
                method: "DELETE",
                headers: getAuthHeaders()
            });
            if (res.ok) fetchData();
        } catch (e) {
            console.error("Delete vendor error:", e);
        }
    };

    const filtered = vendors.filter(v => 
        (v.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.contact_person || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.gst_number || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4 animate-pro-in pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm">
                <div>
                    <h2 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Vendors & Suppliers Directory</h2>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Manage partner suppliers, GSTIN credentials, contact details & payment terms</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchData} className="px-3 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-500' : ''}`} /> Refresh
                    </button>
                    <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> Provision Vendor
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-[#1e2129] p-3 rounded-xl border border-slate-100 dark:border-white/5 flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-lg px-3 py-2 flex-1">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        placeholder="Search vendors by name, contact person or GSTIN..." 
                        className="bg-transparent text-[11px] font-bold outline-none w-full text-slate-800 dark:text-white uppercase tracking-tight"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            <th className="p-3.5">Vendor Supplier</th>
                            <th className="p-3.5">Contact Details</th>
                            <th className="p-3.5">GSTIN / Tax ID</th>
                            <th className="p-3.5">Payment Terms</th>
                            <th className="p-3.5">Opening Balance</th>
                            <th className="p-3.5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                        {loading ? (
                            <tr><td colSpan="6" className="p-12 text-center text-slate-400 animate-pulse">Loading vendors...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan="6" className="p-12 text-center text-slate-400">No vendor suppliers registered yet. Click "Provision Vendor" to add one.</td></tr>
                        ) : filtered.map(ven => (
                            <tr key={ven.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                <td className="p-3.5">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                            <Truck className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{ven.name}</span>
                                            {ven.contact_person && <p className="text-[9px] font-bold text-slate-400">Contact: {ven.contact_person}</p>}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3.5">
                                    <div className="space-y-0.5">
                                        {ven.phone && <p className="flex items-center gap-1 text-[10px]"><Phone className="w-3 h-3 text-slate-400" /> {ven.phone}</p>}
                                        {ven.email && <p className="flex items-center gap-1 text-[10px] text-slate-400"><Mail className="w-3 h-3 text-slate-400" /> {ven.email}</p>}
                                    </div>
                                </td>
                                <td className="p-3.5">
                                    <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-white/5 text-[10px] font-black uppercase text-slate-600 dark:text-slate-400">
                                        {ven.gst_number || "N/A"}
                                    </span>
                                </td>
                                <td className="p-3.5 text-slate-500">{ven.payment_terms || "Immediate"}</td>
                                <td className="p-3.5 font-black text-slate-900 dark:text-white">₹{parseFloat(ven.opening_balance || 0).toFixed(2)}</td>
                                <td className="p-3.5 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                        <button onClick={() => handleOpenModal(ven)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white">
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(ven.id)} className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-rose-400 hover:text-rose-600">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1e2129] border border-slate-100 dark:border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                            <h3 className="text-[15px] font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                {editingItem ? "Edit Vendor Details" : "Provision Vendor Supplier"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4 mt-4 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Vendor Business Name *</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={form.name} 
                                        onChange={(e) => setForm({ ...form, name: e.target.value })} 
                                        placeholder="e.g. Metro Cash & Carry"
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-slate-900 dark:text-white uppercase font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact Person</label>
                                    <input 
                                        type="text" 
                                        value={form.contact_person} 
                                        onChange={(e) => setForm({ ...form, contact_person: e.target.value })} 
                                        placeholder="e.g. Rajesh Sharma"
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-slate-900 dark:text-white font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</label>
                                    <input 
                                        type="text" 
                                        value={form.phone} 
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                                        placeholder="e.g. +91 9876543210"
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-slate-900 dark:text-white font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
                                    <input 
                                        type="email" 
                                        value={form.email} 
                                        onChange={(e) => setForm({ ...form, email: e.target.value })} 
                                        placeholder="vendor@supplier.com"
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-slate-900 dark:text-white font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">GSTIN Number</label>
                                    <input 
                                        type="text" 
                                        value={form.gst_number} 
                                        onChange={(e) => setForm({ ...form, gst_number: e.target.value })} 
                                        placeholder="e.g. 01AAAAA0000A1Z5"
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-slate-900 dark:text-white uppercase font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Terms</label>
                                    <select 
                                        value={form.payment_terms} 
                                        onChange={(e) => setForm({ ...form, payment_terms: e.target.value })} 
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-slate-900 dark:text-white uppercase font-bold cursor-pointer"
                                    >
                                        <option value="Immediate">Immediate / Cash</option>
                                        <option value="Net 7 Days">Net 7 Days</option>
                                        <option value="Net 15 Days">Net 15 Days</option>
                                        <option value="Net 30 Days">Net 30 Days</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Supplier Address</label>
                                <textarea 
                                    value={form.address} 
                                    onChange={(e) => setForm({ ...form, address: e.target.value })} 
                                    placeholder="Street, City, Pincode..."
                                    rows="2"
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-slate-900 dark:text-white font-bold"
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-[2] py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20">
                                    {editingItem ? "Save Vendor Details" : "Create Vendor"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorManager;
