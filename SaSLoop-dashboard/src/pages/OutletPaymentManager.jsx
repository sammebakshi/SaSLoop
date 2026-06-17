import React, { useState, useEffect } from "react";
import { 
  CreditCard, ChevronRight, ChevronLeft, 
  Trash2, Search, RefreshCw, ShieldCheck, 
  Lock, Smartphone, Wallet, Building2, Store, X, Plus, QrCode
} from "lucide-react";
import API_BASE from "../config";

const OutletPaymentManager = () => {
    const [authorizedChannels, setAuthorizedChannels] = useState([]);
    const [masterChannels, setMasterChannels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [newMethodName, setNewMethodName] = useState("");
    const [showAddInput, setShowAddInput] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null); // Stores methodName to delete

    // Centralized QRs State
    const [outletQrs, setOutletQrs] = useState([]);
    const [qrLoading, setQrLoading] = useState(false);
    const [newQr, setNewQr] = useState({ name: "", brand: "other", upi_id: "", qr_type: "static", is_active: true });
    const [showAddQr, setShowAddQr] = useState(false);

    // Business settings for centralized print toggle
    const [bizSettings, setBizSettings] = useState({});
    const [printUpiQr, setPrintUpiQr] = useState(false);

    const fetchBusinessStatus = async () => {
        try {
            const token = localStorage.getItem("token");
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = (impersonateId && impersonateId !== "global") ? `?target_user_id=${impersonateId}` : "";
            
            const res = await fetch(`${API_BASE}/api/business/status${targetParam}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.hasBusiness && data.business) {
                const settings = data.business.settings || {};
                setBizSettings(settings);
                setPrintUpiQr(!!settings.print_upi_qr);
            }
        } catch (err) {
            console.error("Failed to fetch business status:", err);
        }
    };

    const handleTogglePrintQr = async (val) => {
        setPrintUpiQr(val);
        try {
            const token = localStorage.getItem("token");
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const target_user_id = (impersonateId && impersonateId !== "global") ? impersonateId : null;
            
            const res = await fetch(`${API_BASE}/api/business/setup`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    target_user_id,
                    settings: {
                        ...bizSettings,
                        print_upi_qr: val
                    }
                })
            });
            if (res.ok) {
                fetchBusinessStatus();
            } else {
                alert("Failed to update print setting");
            }
        } catch (err) {
            console.error("Failed to save print setting:", err);
        }
    };

    const fetchOutletQrs = async () => {
        setQrLoading(true);
        try {
            const token = localStorage.getItem("token");
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = (impersonateId && impersonateId !== "global") ? `?target_user_id=${impersonateId}` : "";
            
            const res = await fetch(`${API_BASE}/api/pos/qrs${targetParam}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setOutletQrs(data);
            }
        } catch (err) {
            console.error("Failed to fetch outlet QRs:", err);
        } finally {
            setQrLoading(false);
        }
    };

    const addQrCode = async (e) => {
        e.preventDefault();
        if (!newQr.name.trim() || !newQr.upi_id.trim()) {
            alert("Please enter both a Name and UPI ID / URL");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const impersonateId = sessionStorage.getItem("impersonate_id");
            
            const res = await fetch(`${API_BASE}/api/pos/qrs`, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    ...newQr,
                    target_user_id: (impersonateId && impersonateId !== "global") ? impersonateId : null
                })
            });
            if (res.ok) {
                setNewQr({ name: "", brand: "other", upi_id: "", qr_type: "static", is_active: true });
                setShowAddQr(false);
                fetchOutletQrs();
            } else {
                const errData = await res.json();
                alert(`Failed to add QR code: ${errData.error || 'Server error'}`);
            }
        } catch (err) {
            console.error("Failed to add QR code:", err);
        }
    };

    const toggleQrStatus = async (id, currentActive) => {
        try {
            const token = localStorage.getItem("token");
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const qr = outletQrs.find(q => q.id === id);
            if (!qr) return;

            const res = await fetch(`${API_BASE}/api/pos/qrs/${id}`, {
                method: "PUT",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    name: qr.name,
                    brand: qr.brand,
                    upi_id: qr.upi_id,
                    qr_type: qr.qr_type,
                    is_active: !currentActive,
                    target_user_id: (impersonateId && impersonateId !== "global") ? impersonateId : null
                })
            });
            if (res.ok) {
                setOutletQrs(prev => prev.map(q => q.id === id ? { ...q, is_active: !currentActive } : q));
            }
        } catch (err) {
            console.error("Failed to update QR code status:", err);
        }
    };

    const deleteQrCode = async (id) => {
        if (!window.confirm("Are you sure you want to delete this QR code?")) return;
        try {
            const token = localStorage.getItem("token");
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = (impersonateId && impersonateId !== "global") ? `?target_user_id=${impersonateId}` : "";
            
            const res = await fetch(`${API_BASE}/api/pos/qrs/${id}${targetParam}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setOutletQrs(prev => prev.filter(q => q.id !== id));
            }
        } catch (err) {
            console.error("Failed to delete QR code:", err);
        }
    };

    const defaultChannels = ['PAYTM', 'GOOGLEPAY', 'PHONEPE', 'FREECHARGE', 'BHIMPAY', 'CARD', 'CASH', 'ZOMATO', 'SWIGGY', 'MAGICPIN'];

    const fetchMasterChannels = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/pos/master-payment-modes`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                if (data.length === 0) {
                    // Seed defaults if empty
                    for (const m of defaultChannels) {
                        await addMasterChannel(m, true);
                    }
                    setMasterChannels(defaultChannels);
                } else {
                    setMasterChannels(data);
                }
            }
        } catch (err) {
            console.error("Failed to fetch master channels:", err);
        }
    };

    const fetchAuthorizedChannels = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = (impersonateId && impersonateId !== "global") ? `?target_user_id=${impersonateId}` : "";
            
            const res = await fetch(`${API_BASE}/api/pos/payment-modes${targetParam}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setAuthorizedChannels(data.map(m => m.method_name));
            }
        } catch (err) {
            console.error("Failed to fetch payment modes:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMasterChannels();
        fetchAuthorizedChannels();
        fetchOutletQrs();
        fetchBusinessStatus();
    }, []);

    const addMasterChannel = async (methodName, silent = false) => {
        const name = methodName.toUpperCase();
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/pos/master-payment-modes`, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ methodName: name })
            });
            if (res.ok && !silent) {
                setMasterChannels(prev => Array.from(new Set([...prev, name])));
                setNewMethodName("");
                setShowAddInput(false);
            }
        } catch (err) {
            console.error("Failed to add master channel:", err);
        }
    };

    const deleteMasterChannel = async (methodName) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/pos/master-payment-modes/${methodName}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setMasterChannels(prev => prev.filter(c => c !== methodName));
                setAuthorizedChannels(prev => prev.filter(c => c !== methodName));
                setConfirmDelete(null);
            }
        } catch (err) {
            console.error("Failed to delete master channel:", err);
        }
    };

    const authorizeChannel = async (methodName) => {
        if (syncing) return;
        setSyncing(true);
        try {
            const token = localStorage.getItem("token");
            const impersonateId = sessionStorage.getItem("impersonate_id");
            
            const res = await fetch(`${API_BASE}/api/pos/payment-modes`, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    methodName,
                    target_user_id: (impersonateId && impersonateId !== "global") ? impersonateId : null
                })
            });
            if (res.ok) {
                setAuthorizedChannels(prev => [...prev, methodName]);
            } else {
                const errorData = await res.json();
                alert(`Authorization Failed: ${errorData.error || 'Server error'}`);
            }
        } catch (err) {
            console.error("Failed to authorize channel:", err);
            alert("Connection error. Please check server logs.");
        } finally {
            setSyncing(false);
        }
    };

    const revokeChannel = async (methodName) => {
        if (syncing) return;
        setSyncing(true);
        try {
            const token = localStorage.getItem("token");
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = (impersonateId && impersonateId !== "global") ? `?target_user_id=${impersonateId}` : "";

            const res = await fetch(`${API_BASE}/api/pos/payment-modes/${methodName}${targetParam}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setAuthorizedChannels(prev => prev.filter(c => c !== methodName));
            } else {
                const errorData = await res.json();
                alert(`Revocation Failed: ${errorData.error || 'Server error'}`);
            }
        } catch (err) {
            console.error("Failed to revoke channel:", err);
            alert("Connection error. Please check server logs.");
        } finally {
            setSyncing(false);
        }
    };

    const availableChannels = masterChannels.filter(c => !authorizedChannels.includes(c));

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Header Matrix */}
            <div className="flex items-center justify-between bg-white dark:bg-[#1e2129] p-3 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                        <CreditCard className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="pro-heading">Payment Methods</h2>
                        <p className="pro-subheading">Manage payment options for this outlet</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {loading && <RefreshCw className="w-3.5 h-3.5 text-emerald-500 animate-spin mr-2" />}
                    
                    {showAddInput ? (
                        <div className="flex items-center bg-white dark:bg-white/5 rounded-md p-1 border border-slate-200 dark:border-white/5 animate-in slide-in-from-right-2 duration-300">
                            <input 
                                autoFocus
                                type="text"
                                placeholder="METHOD NAME..."
                                value={newMethodName}
                                onChange={(e) => setNewMethodName(e.target.value.toUpperCase())}
                                onKeyDown={(e) => e.key === 'Enter' && addMasterChannel(newMethodName)}
                                className="bg-transparent border-none outline-none text-[10px] font-bold px-2 w-32 uppercase text-slate-600 dark:text-slate-300"
                            />
                            <button 
                                onClick={() => addMasterChannel(newMethodName)}
                                className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition-colors"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                            <button 
                                onClick={() => setShowAddInput(false)}
                                className="p-1.5 text-slate-400 hover:text-rose-500"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setShowAddInput(true)}
                            className="pro-btn-primary h-10 px-5"
                        >
                            <Plus className="w-4 h-4" />
                            Add Method
                        </button>
                    )}

                    <div className="h-10 px-4 flex items-center bg-white dark:bg-white/5 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200 dark:border-white/5 shadow-sm">
                        Secure Matrix
                    </div>
                </div>
            </div>

            {/* Authorization Theater */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                {/* Global Registry */}
                <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-lg shadow-sm flex flex-col overflow-hidden h-[500px]">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 flex items-center justify-between">
                        <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest underline decoration-emerald-500 decoration-2 underline-offset-4">GLOBAL REGISTRY</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {availableChannels.map(channel => (
                            <div key={channel} className="flex items-center justify-between px-6 py-4 border-b border-slate-50 dark:border-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center shadow-sm">
                                        <Smartphone className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <span className="text-[12px] font-bold text-slate-800 dark:text-white uppercase tracking-tight">{channel}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => setConfirmDelete(channel)}
                                        className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                        onClick={() => authorizeChannel(channel)}
                                        disabled={syncing}
                                        className="p-1.5 bg-slate-900 dark:bg-white/10 text-white dark:text-slate-300 rounded hover:bg-black dark:hover:bg-white/20 active:scale-90 transition-all disabled:opacity-50"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {availableChannels.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 gap-2">
                                <ShieldCheck size={32} className="opacity-20" />
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-20">Registry Synchronized</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Authorized Matrix */}
                <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-lg shadow-sm flex flex-col overflow-hidden h-[500px]">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 flex items-center justify-between relative z-10">
                        <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Active Outlet Matrix</h3>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Secure Node</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
                        {authorizedChannels.map(channel => (
                            <div key={channel} className="flex items-center justify-between px-6 py-4 border-b border-emerald-50 dark:border-emerald-500/10 bg-emerald-50/10 dark:bg-emerald-500/5 group">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded bg-white dark:bg-white/5 border border-emerald-100 dark:border-white/5 flex items-center justify-center shadow-sm">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                                    </div>
                                    <span className="text-[12px] font-bold text-slate-800 dark:text-white uppercase tracking-tight">{channel}</span>
                                </div>
                                <button 
                                    onClick={() => revokeChannel(channel)}
                                    disabled={syncing}
                                    className="p-1.5 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-400 rounded shadow-sm hover:bg-rose-600 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}

                        {authorizedChannels.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-20">
                                <Lock className="w-10 h-10 mb-4" />
                                <h4 className="text-[12px] font-bold uppercase tracking-tight mb-2">No Active Channels</h4>
                                <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">Transfer channels from the global registry to authorize for this outlet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* UPI QR Centralized Manager Section */}
            <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-lg shadow-sm overflow-hidden p-6 mt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                            <QrCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-[14px] font-bold text-slate-800 dark:text-white uppercase tracking-tight">UPI QR Codes Registry</h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Add payment QR codes or custom payment URLs</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowAddQr(!showAddQr)}
                        className="pro-btn-primary h-9 px-4 text-[10px] font-black uppercase"
                    >
                        {showAddQr ? "Close Form" : "+ Add QR Code"}
                    </button>
                </div>

                {showAddQr && (
                    <form onSubmit={addQrCode} className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 p-4 rounded-xl mb-6 space-y-4 max-w-2xl animate-in slide-in-from-top-2 duration-300">
                        <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">New QR Configuration</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Display Name</label>
                                <input 
                                    required
                                    type="text"
                                    placeholder="e.g. Counter Paytm, Reception PhonePe"
                                    value={newQr.name}
                                    onChange={e => setNewQr(prev => ({ ...prev, name: e.target.value }))}
                                    className="p-2.5 rounded-lg border outline-none text-[11px] font-bold bg-white dark:bg-[#161b22] border-slate-200 dark:border-[#30363d] text-slate-800 dark:text-white"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">UPI Brand</label>
                                <select 
                                    value={newQr.brand}
                                    onChange={e => setNewQr(prev => ({ ...prev, brand: e.target.value }))}
                                    className="p-2.5 rounded-lg border outline-none text-[11px] font-bold bg-white dark:bg-[#161b22] border-slate-200 dark:border-[#30363d] text-slate-800 dark:text-white"
                                >
                                    <option value="paytm">Paytm</option>
                                    <option value="phonepe">PhonePe</option>
                                    <option value="gpay">Google Pay</option>
                                    <option value="bhim">BHIM</option>
                                    <option value="amazonpay">Amazon Pay</option>
                                    <option value="other">Other UPI / Bank</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1 md:col-span-2">
                                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">UPI VPA / Payment URL</label>
                                <input 
                                    required
                                    type="text"
                                    placeholder="e.g. name@upi or https://..."
                                    value={newQr.upi_id}
                                    onChange={e => setNewQr(prev => ({ ...prev, upi_id: e.target.value }))}
                                    className="p-2.5 rounded-lg border outline-none text-[11px] font-bold bg-white dark:bg-[#161b22] border-slate-200 dark:border-[#30363d] text-slate-800 dark:text-white"
                                />
                            </div>
                        </div>
                        <button 
                            type="submit"
                            className="pro-btn-primary py-2.5 px-6 text-[10px] font-black uppercase"
                        >
                            Save QR Code
                        </button>
                    </form>
                )}

                <div className="overflow-x-auto">
                    {qrLoading ? (
                        <div className="py-8 flex items-center justify-center text-slate-400">
                            <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading QR Configurations...
                        </div>
                    ) : outletQrs.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 border border-dashed border-slate-200 dark:border-white/5 rounded-xl">
                            <QrCode className="w-10 h-10 mx-auto mb-2 opacity-20" />
                            <span className="text-[11px] font-bold uppercase tracking-widest opacity-30">No central QRs configured. POS defaults will apply.</span>
                        </div>
                    ) : (
                        <table className="w-full text-left text-[11px] font-bold uppercase tracking-tight">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 text-[9px] tracking-wider">
                                    <th className="py-3 px-4">Name</th>
                                    <th className="py-3 px-4">Brand</th>
                                    <th className="py-3 px-4">UPI VPA / URL</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {outletQrs.map((qr) => {
                                    const brandColors = { paytm: '#00BAF2', phonepe: '#5F259F', gpay: '#4285F4', bhim: '#00838F', amazonpay: '#FF9900', other: '#6B7280' };
                                    return (
                                        <tr key={qr.id} className="border-b border-slate-50 dark:border-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.01]">
                                            <td className="py-3.5 px-4 text-slate-800 dark:text-white font-black">{qr.name}</td>
                                            <td className="py-3.5 px-4">
                                                <span 
                                                    className="px-2 py-0.5 rounded text-[8px] font-black text-white"
                                                    style={{ backgroundColor: brandColors[qr.brand] || brandColors.other }}
                                                >
                                                    {qr.brand}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 lowercase font-mono">{qr.upi_id}</td>
                                            <td className="py-3.5 px-4">
                                                <button 
                                                    onClick={() => toggleQrStatus(qr.id, qr.is_active)}
                                                    className={`px-2 py-0.5 rounded text-[8px] font-black transition-colors ${
                                                        qr.is_active 
                                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                    }`}
                                                >
                                                    {qr.is_active ? "Active" : "Disabled"}
                                                </button>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <button 
                                                    onClick={() => deleteQrCode(qr.id)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            
            {/* Confirmation Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1e2129] w-full max-w-sm rounded-xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100 dark:border-rose-500/20">
                                <Trash2 className="w-8 h-8 text-rose-500" />
                            </div>
                            <h3 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Delete Channel?</h3>
                            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed">
                                Are you sure you want to remove <span className="text-slate-900 dark:text-white">{confirmDelete}</span>? This will revoke it from all authorized outlets.
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
                                onClick={() => deleteMasterChannel(confirmDelete)}
                                className="flex-1 px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OutletPaymentManager;
