import React, { useState, useEffect } from "react";
import { 
  Bell, Phone, Users, Plus, Trash2, Save, 
  HelpCircle, ShieldCheck, MessageSquare, Utensils
} from "lucide-react";
import API_BASE from "../config";

const NotificationSettings = () => {
    const [kitchenNumber, setKitchenNumber] = useState("");
    const [staffNumbers, setStaffNumbers] = useState([]);
    const [newStaffNumber, setNewStaffNumber] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    const fetchNotificationSettings = async () => {
        setLoading(true);
        try {
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/business/status${targetParam}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.hasBusiness && data.business) {
                    const biz = data.business;
                    setKitchenNumber(biz.kitchen_number || "");
                    setStaffNumbers(Array.isArray(biz.notification_numbers) ? biz.notification_numbers : []);
                }
            }
        } catch (e) {
            console.error("Failed to fetch notification settings:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotificationSettings();
    }, []);

    const showToast = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleAddStaffNumber = (e) => {
        if (e) e.preventDefault();
        const cleaned = newStaffNumber.trim();
        if (!cleaned) return;
        
        // Simple regex check or pattern validation for international phone format
        if (!/^\+?[1-9]\d{1,14}$/.test(cleaned.replace(/[\s-]/g, ""))) {
            showToast("error", "Please enter a valid phone number (e.g. +919876543210).");
            return;
        }

        if (staffNumbers.includes(cleaned)) {
            showToast("error", "This number is already in the notification list.");
            return;
        }

        setStaffNumbers(prev => [...prev, cleaned]);
        setNewStaffNumber("");
    };

    const handleRemoveStaffNumber = (indexToRemove) => {
        setStaffNumbers(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        
        // Clean kitchen number if filled
        const cleanedKitchen = kitchenNumber.trim();
        if (cleanedKitchen && !/^\+?[1-9]\d{1,14}$/.test(cleanedKitchen.replace(/[\s-]/g, ""))) {
            showToast("error", "Please enter a valid Kitchen phone number.");
            return;
        }

        try {
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/business/setup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    target_user_id: impersonateId || undefined,
                    kitchen_number: cleanedKitchen,
                    notification_numbers: staffNumbers
                })
            });
            if (res.ok) {
                showToast("success", "Staff & Kitchen notification numbers saved successfully!");
                fetchNotificationSettings();
            } else {
                const err = await res.json();
                showToast("error", err.error || "Failed to save notification settings.");
            }
        } catch (e) {
            console.error("Save notification numbers error:", e);
            showToast("error", "Network error updating alert contacts.");
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="animate-pulse text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
                    Loading Alert Channels...
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500 font-sans">
            {/* Status Toast Notification */}
            {message && (
                <div className={`fixed top-6 right-6 z-[1000] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border text-xs font-bold uppercase tracking-wider animate-in slide-in-from-top duration-300 ${
                    message.type === "success" 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50" 
                        : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50"
                }`}>
                    <ShieldCheck className="w-4 h-4" />
                    {message.text}
                </div>
            )}

            {/* Header Title Section */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-4">
                <div>
                    <h1 className="text-[20px] font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-2">
                        <Bell className="w-6 h-6 text-emerald-500" /> Staff & Kitchen Numbers
                    </h1>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                        Configure WhatsApp alert channels for real-time order notifications and KOT ticket printing
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Side: Summary Card */}
                <div className="lg:col-span-4">
                    <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl p-6 shadow-xl space-y-6">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Alert Orchestrator</h3>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight leading-relaxed px-4">
                                Keep your kitchen staff and operational managers synced in real-time. Order logs and status updates are dispatched automatically via WhatsApp API.
                            </p>
                        </div>

                        {/* Interactive info panel */}
                        <div className="bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-xl p-4 space-y-4 text-xs font-bold">
                            <div className="flex items-start gap-3">
                                <Utensils className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Kitchen Ticket (KOT)</h4>
                                    <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-1 leading-normal">
                                        New prep requests are routed directly to the designated Kitchen number instantly.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Users className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Staff Notifications</h4>
                                    <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-1 leading-normal">
                                        Operational updates, cancellations, and sales summaries are broadcasted to all staff alert lines.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Setup Inputs Panel */}
                <div className="lg:col-span-8">
                    <form onSubmit={handleSave} className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl p-8 shadow-xl space-y-6 h-full flex flex-col">
                        
                        {/* 1. Kitchen Alert Number */}
                        <div className="space-y-3">
                            <h3 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <Utensils className="w-4 h-4 text-emerald-500" /> Kitchen Alert Number
                            </h3>
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    value={kitchenNumber} 
                                    onChange={e => setKitchenNumber(e.target.value)}
                                    className="w-full h-11 px-4 pl-11 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-600 transition-all" 
                                    placeholder="+919876543210"
                                />
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                            </div>
                            <p className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
                                WhatsApp/Mobile number of the Kitchen display or printer node.
                            </p>
                        </div>

                        <div className="w-full border-t border-slate-100 dark:border-white/5 my-2" />

                        {/* 2. Staff Notification Numbers */}
                        <div className="space-y-4 flex-1 flex flex-col">
                            <h3 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-500" /> Staff Notification Channels
                            </h3>
                            
                            {/* Add staff number row */}
                            <div className="flex gap-2">
                                <div className="relative flex-1 group">
                                    <input 
                                        type="text" 
                                        value={newStaffNumber} 
                                        onChange={e => setNewStaffNumber(e.target.value)}
                                        className="w-full h-11 px-4 pl-11 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-600 transition-all" 
                                        placeholder="e.g. +919998887776"
                                    />
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                                </div>
                                <button 
                                    type="button"
                                    onClick={handleAddStaffNumber}
                                    className="h-11 px-6 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-850 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-md flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Add Line
                                </button>
                            </div>
                            <p className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
                                Enter staff numbers in international format (with country code, e.g., +91 or +1).
                            </p>

                            {/* Numbers list container */}
                            <div className="flex-1 min-h-[150px] border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10 rounded-xl p-4 mt-2 overflow-y-auto custom-scrollbar">
                                {staffNumbers.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-center py-8">
                                        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">No staff alert channels registered yet</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {staffNumbers.map((num, idx) => (
                                            <div 
                                                key={idx} 
                                                className="flex items-center justify-between p-3 bg-white dark:bg-[#1c1e26] border border-slate-200/50 dark:border-white/5 rounded-lg animate-in fade-in zoom-in-95 duration-200"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 text-xs">
                                                        {idx + 1}
                                                    </div>
                                                    <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 tracking-tight truncate">{num}</span>
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleRemoveStaffNumber(idx)}
                                                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="pt-6 border-t border-slate-100 dark:border-white/5 mt-auto">
                            <button type="submit" className="px-10 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center gap-3">
                                <Save className="w-4 h-4" /> Save Alert Channels
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings;
