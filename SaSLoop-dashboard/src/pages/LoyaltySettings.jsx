import React, { useState, useEffect } from "react";
import { 
  Gift, Trophy, Award, Landmark, 
  HelpCircle, Save, Percent, ShieldCheck,
  ChevronRight, ArrowRight, UserPlus, Coins
} from "lucide-react";
import API_BASE from "../config";

const LoyaltySettings = () => {
    const [settings, setSettings] = useState({
        loyalty_enabled: true,
        loyalty_joining_points: 0,
        loyalty_bill_amount_threshold: 100.00,
        loyalty_points_earned: 1,
        loyalty_points_dinein: true,
        loyalty_points_pickup: true,
        loyalty_points_delivery: true,
        points_to_amount_ratio: 1.00,
        min_redeem_points: 100,
        max_redeem_per_order: 500
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    const fetchLoyaltySettings = async () => {
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
                    setSettings({
                        loyalty_enabled: biz.loyalty_enabled ?? true,
                        loyalty_joining_points: parseInt(biz.loyalty_joining_points) || 0,
                        loyalty_bill_amount_threshold: parseFloat(biz.loyalty_bill_amount_threshold) || 100.00,
                        loyalty_points_earned: parseInt(biz.loyalty_points_earned) || 1,
                        loyalty_points_dinein: biz.loyalty_points_dinein ?? true,
                        loyalty_points_pickup: biz.loyalty_points_pickup ?? true,
                        loyalty_points_delivery: biz.loyalty_points_delivery ?? true,
                        points_to_amount_ratio: parseFloat(biz.points_to_amount_ratio) || 1.00,
                        min_redeem_points: parseInt(biz.min_redeem_points) || 100,
                        max_redeem_per_order: parseInt(biz.max_redeem_per_order) || 500
                    });
                }
            }
        } catch (e) {
            console.error("Failed to fetch loyalty settings:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLoyaltySettings();
    }, []);

    const showToast = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
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
                    loyalty_enabled: settings.loyalty_enabled,
                    loyalty_joining_points: settings.loyalty_joining_points,
                    loyalty_bill_amount_threshold: settings.loyalty_bill_amount_threshold,
                    loyalty_points_earned: settings.loyalty_points_earned,
                    loyalty_points_dinein: settings.loyalty_points_dinein,
                    loyalty_points_pickup: settings.loyalty_points_pickup,
                    loyalty_points_delivery: settings.loyalty_points_delivery,
                    points_to_amount_ratio: settings.points_to_amount_ratio,
                    min_redeem_points: settings.min_redeem_points,
                    max_redeem_per_order: settings.max_redeem_per_order
                })
            });
            if (res.ok) {
                showToast("success", "Loyalty program settings updated successfully!");
                fetchLoyaltySettings();
            } else {
                const err = await res.json();
                showToast("error", err.error || "Failed to save loyalty settings.");
            }
        } catch (e) {
            console.error("Loyalty save error:", e);
            showToast("error", "Network error updating loyalty configuration.");
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="animate-pulse text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
                    Loading Loyalty Matrices...
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

            {/* Header Title section */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-4">
                <div>
                    <h1 className="text-[20px] font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-emerald-500" /> Loyalty Program Settings
                    </h1>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                        Configure reward metrics, signup bonuses, and conversion parameters
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Side: Summary Card */}
                <div className="lg:col-span-4">
                    <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl p-6 shadow-xl space-y-6">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto">
                            <Award className="w-8 h-8" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Loyalty Paradigm</h3>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight leading-relaxed px-4">
                                Empower your customer base with automatic rewards and coin accumulation schemes.
                            </p>
                        </div>

                        {/* Interactive Rule Display Panel */}
                        <div className="bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-xl p-4 space-y-4">
                            <div className="flex items-start gap-3">
                                <Landmark className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Accumulation Logic</h4>
                                    <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-1 leading-normal">
                                        Customers earn <span className="text-emerald-500 font-black">{settings.loyalty_points_earned} Points</span> per <span className="text-slate-800 dark:text-white font-black">{settings.loyalty_bill_amount_threshold} Bill Amount</span>.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <UserPlus className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Sign Up Bonus</h4>
                                    <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-1 leading-normal">
                                        New customers receive <span className="text-blue-500 font-black">{settings.loyalty_joining_points} Points</span> instantly on registration.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Coins className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Redemption Value</h4>
                                    <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-1 leading-normal">
                                        Each point is worth <span className="text-amber-500 font-black">{settings.points_to_amount_ratio} currency units</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Setup Inputs Panel */}
                <div className="lg:col-span-8">
                    <form onSubmit={handleSave} className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl p-8 shadow-xl space-y-6 h-full flex flex-col">
                        
                        {/* Toggle loyalty enabled */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-100 dark:border-white/5">
                            <div className="space-y-1">
                                <h3 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-tight">Active Rewards System</h3>
                                <p className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Enable or disable points collection throughout all channels</p>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => setSettings(prev => ({ ...prev, loyalty_enabled: !prev.loyalty_enabled }))}
                                className={`w-10 h-5 rounded-full p-0.5 relative transition-all duration-300 ${
                                    settings.loyalty_enabled ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-white/10'
                                }`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                                    settings.loyalty_enabled ? 'translate-x-5' : 'translate-x-0'
                                }`} />
                            </button>
                        </div>

                        {settings.loyalty_enabled && (
                            <div className="space-y-6 flex-1 animate-in slide-in-from-top-2 duration-300">
                                
                                {/* Joining points input */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Joining / Registration Bonus Points</label>
                                    <div className="relative group">
                                        <input 
                                            type="number" 
                                            value={settings.loyalty_joining_points} 
                                            onChange={e => setSettings({ ...settings, loyalty_joining_points: parseInt(e.target.value) || 0 })}
                                            className="w-full h-11 px-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-600 transition-all" 
                                            min="0"
                                            placeholder="Enter points given on signup"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                            Points
                                        </div>
                                    </div>
                                    <p className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">Rewarded to the customer when they join the loyalty program</p>
                                </div>

                                {/* Bill Points Matrix Configuration */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    
                                    {/* Threshold (Bill Amount) */}
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Bill Amount Threshold</label>
                                        <div className="relative group">
                                            <input 
                                                type="number" 
                                                value={settings.loyalty_bill_amount_threshold} 
                                                onChange={e => setSettings({ ...settings, loyalty_bill_amount_threshold: parseFloat(e.target.value) || 0 })}
                                                className="w-full h-11 px-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-600 transition-all" 
                                                min="1"
                                                placeholder="Enter bill value threshold"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                Bill Amount
                                            </div>
                                        </div>
                                        <p className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">The base bill amount target to earn rewards</p>
                                    </div>

                                    {/* Points Earned */}
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Points Earned per Threshold</label>
                                        <div className="relative group">
                                            <input 
                                                type="number" 
                                                value={settings.loyalty_points_earned} 
                                                onChange={e => setSettings({ ...settings, loyalty_points_earned: parseInt(e.target.value) || 0 })}
                                                className="w-full h-11 px-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-600 transition-all" 
                                                min="1"
                                                placeholder="Enter points earned"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                Points
                                            </div>
                                        </div>
                                        <p className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">Amount of points awarded once threshold is cleared</p>
                                    </div>

                                </div>

                                {/* Points Channel Eligibility */}
                                <div className="space-y-2 pt-2">
                                    <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Offer Loyalty Points on Channels</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        
                                        {/* Dine-in Toggle */}
                                        <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-black/20 rounded-lg border border-slate-200/50 dark:border-white/5 shadow-sm">
                                            <div className="space-y-0.5">
                                                <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Dine-in</span>
                                                <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Table orders & QR</p>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => setSettings(prev => ({ ...prev, loyalty_points_dinein: !prev.loyalty_points_dinein }))}
                                                className={`w-9 h-5 rounded-full p-0.5 relative transition-all duration-300 ${
                                                    settings.loyalty_points_dinein ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-white/10'
                                                }`}
                                            >
                                                <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                                                    settings.loyalty_points_dinein ? 'translate-x-4' : 'translate-x-0'
                                                }`} />
                                            </button>
                                        </div>

                                        {/* Pickup Toggle */}
                                        <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-black/20 rounded-lg border border-slate-200/50 dark:border-white/5 shadow-sm">
                                            <div className="space-y-0.5">
                                                <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Pickup</span>
                                                <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Takeaway & Quick POS</p>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => setSettings(prev => ({ ...prev, loyalty_points_pickup: !prev.loyalty_points_pickup }))}
                                                className={`w-9 h-5 rounded-full p-0.5 relative transition-all duration-300 ${
                                                    settings.loyalty_points_pickup ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-white/10'
                                                }`}
                                            >
                                                <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                                                    settings.loyalty_points_pickup ? 'translate-x-4' : 'translate-x-0'
                                                }`} />
                                            </button>
                                        </div>

                                        {/* Delivery Toggle */}
                                        <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-black/20 rounded-lg border border-slate-200/50 dark:border-white/5 shadow-sm">
                                            <div className="space-y-0.5">
                                                <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Delivery</span>
                                                <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Online & App Delivery</p>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => setSettings(prev => ({ ...prev, loyalty_points_delivery: !prev.loyalty_points_delivery }))}
                                                className={`w-9 h-5 rounded-full p-0.5 relative transition-all duration-300 ${
                                                    settings.loyalty_points_delivery ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-white/10'
                                                }`}
                                            >
                                                <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                                                    settings.loyalty_points_delivery ? 'translate-x-4' : 'translate-x-0'
                                                }`} />
                                            </button>
                                        </div>

                                    </div>
                                </div>

                                {/* Dynamic conversion tip */}
                                <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 flex items-center gap-3">
                                    <HelpCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                                    <div className="text-[9.5px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wide leading-relaxed">
                                        Active Rule Summary: A bill of <span className="font-black text-slate-900 dark:text-white">{settings.loyalty_bill_amount_threshold}</span> will award the customer <span className="font-black text-slate-900 dark:text-white">{settings.loyalty_points_earned} Points</span>. 
                                        (Conversion rate: {(settings.loyalty_points_earned / (settings.loyalty_bill_amount_threshold || 1)).toFixed(4)} Points per unit spent).
                                    </div>
                                </div>

                                {/* Redemption Settings Grid */}
                                <div className="border-t border-slate-100 dark:border-white/5 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    
                                    {/* Ratio */}
                                    <div className="space-y-2">
                                        <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Point Redemption Value</label>
                                        <div className="relative group">
                                            <input 
                                                type="number" 
                                                value={settings.points_to_amount_ratio} 
                                                onChange={e => setSettings({ ...settings, points_to_amount_ratio: parseFloat(e.target.value) || 0 })}
                                                className="w-full h-11 px-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-600 transition-all" 
                                                step="0.01"
                                                min="0.01"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase">
                                                Val
                                            </div>
                                        </div>
                                        <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">Value of 1 point in currency (e.g. 1 point = 0.50)</p>
                                    </div>

                                    {/* Min redeem */}
                                    <div className="space-y-2">
                                        <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Minimum Redeem Points</label>
                                        <div className="relative group">
                                            <input 
                                                type="number" 
                                                value={settings.min_redeem_points} 
                                                onChange={e => setSettings({ ...settings, min_redeem_points: parseInt(e.target.value) || 0 })}
                                                className="w-full h-11 px-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-600 transition-all" 
                                                min="0"
                                            />
                                        </div>
                                        <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">Points needed before first redemption allowed</p>
                                    </div>

                                    {/* Max redeem per order */}
                                    <div className="space-y-2">
                                        <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Max Redeem Per Order</label>
                                        <div className="relative group">
                                            <input 
                                                type="number" 
                                                value={settings.max_redeem_per_order} 
                                                onChange={e => setSettings({ ...settings, max_redeem_per_order: parseInt(e.target.value) || 0 })}
                                                className="w-full h-11 px-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-600 transition-all" 
                                                min="0"
                                            />
                                        </div>
                                        <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">Maximum points allowed to redeem in a single checkout</p>
                                    </div>

                                </div>

                            </div>
                        )}

                        <div className="pt-6 border-t border-slate-100 dark:border-white/5 mt-auto">
                            <button type="submit" className="px-10 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center gap-3">
                                <Save className="w-4 h-4" /> Save Loyalty Metrics
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoyaltySettings;
