import React, { useState, useEffect } from "react";
import { 
  Calendar, RefreshCw, Save, Info, AlertTriangle, ShieldCheck
} from "lucide-react";
import API_BASE from "../config";

const Toggle = ({ checked, onChange, disabled }) => (
    <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        className={`${
            checked ? "bg-emerald-600" : "bg-slate-200"
        } relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
    >
        <span
            className={`${
                checked ? "translate-x-5" : "translate-x-0"
            } pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
    </button>
);

const PreOrderSettings = () => {
    const [bizSettings, setBizSettings] = useState({});
    const [settingsForm, setSettingsForm] = useState({
        custEnablePreOrder: false,
        preOrderDetailsMandatory: false,
        preOrderRevenueMode: "FULFILLMENT_DAY"
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState(false);

    const fetchBusinessStatus = async () => {
        setLoading(true);
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
                setSettingsForm({
                    custEnablePreOrder: !!settings.custEnablePreOrder,
                    preOrderDetailsMandatory: !!settings.preOrderDetailsMandatory,
                    preOrderRevenueMode: settings.preOrderRevenueMode || (settings.countAdvanceInSales ? "BOOKING_DAY" : "FULFILLMENT_DAY")
                });
            }
        } catch (err) {
            console.error("Failed to fetch business status:", err);
            setErrorMsg("Failed to load settings from server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBusinessStatus();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg(false);
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const target_user_id = (impersonateId && impersonateId !== "global") ? impersonateId : null;

            // Merge back into original business settings
            const updatedSettings = {
                ...bizSettings,
                ...settingsForm,
                countAdvanceInSales: settingsForm.preOrderRevenueMode === "BOOKING_DAY"
            };

            const res = await fetch(`${API_BASE}/api/business/setup`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    target_user_id,
                    settings: updatedSettings
                })
            });

            if (res.ok) {
                setSuccessMsg(true);
                setTimeout(() => setSuccessMsg(false), 3000);
                fetchBusinessStatus();
            } else {
                const errData = await res.json();
                setErrorMsg(errData.error || "Failed to save pre-order settings.");
            }
        } catch (err) {
            console.error("Failed to save pre-order settings:", err);
            setErrorMsg("Network error. Please try again.");
        } finally {
            setSaving(false);
        }
    };



    return (
        <div className="space-y-4 animate-in fade-in duration-500 max-w-4xl">
            {/* Header Matrix */}
            <div className="flex items-center justify-between bg-white dark:bg-[#1e2129] p-3 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                        <Calendar className="w-5 h-5 text-emerald-600 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="pro-heading">Pre-Order Configuration</h2>
                        <p className="pro-subheading">Manage pre-order scheduling and revenue settings</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {loading && <RefreshCw className="w-3.5 h-3.5 text-emerald-500 animate-spin mr-2" />}
                    <div className="h-10 px-4 flex items-center bg-white dark:bg-white/5 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200 dark:border-white/5 shadow-sm">
                        Secure Matrix
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="py-24 text-center bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5">
                    <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-3" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Retrieving Configurations...</p>
                </div>
            ) : (
                <form onSubmit={handleSave} className="space-y-4 bg-white dark:bg-[#1e2129] p-6 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                    {errorMsg && (
                        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-[11px] font-semibold flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> {errorMsg}
                        </div>
                    )}

                    {successMsg && (
                        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-lg text-[11px] font-semibold flex items-center gap-2 animate-in fade-in duration-300">
                            <ShieldCheck className="w-4 h-4" /> Pre-order settings saved successfully!
                        </div>
                    )}

                    {/* Enable Pre Order */}
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200/50 dark:border-white/5">
                        <div>
                            <h4 className="text-[12px] font-bold text-slate-700 dark:text-white uppercase tracking-wider">Enable Pre-Orders</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Toggle to allow customers to schedule pre-orders</p>
                        </div>
                        <Toggle 
                            checked={settingsForm.custEnablePreOrder} 
                            onChange={(val) => setSettingsForm({ ...settingsForm, custEnablePreOrder: val })} 
                        />
                    </div>

                    {settingsForm.custEnablePreOrder && (
                        <div className="space-y-5 pt-2 animate-in slide-in-from-top-2 duration-300">
                            


                            {/* Details Mandatory Toggle */}
                            <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-slate-200/50 dark:border-white/5">
                                <div>
                                    <p className="text-[11px] font-bold text-slate-700 dark:text-white uppercase">Customer Details Mandatory for Pre Order</p>
                                </div>
                                <Toggle 
                                    checked={settingsForm.preOrderDetailsMandatory} 
                                    onChange={(val) => setSettingsForm({ ...settingsForm, preOrderDetailsMandatory: val })} 
                                />
                            </div>

                            {/* Sales Recognition Mode selector */}
                            <div className="flex flex-col gap-1.5 border-t border-slate-100 dark:border-white/5 pt-4">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Pre-Order Sales Recognition Mode</label>
                                <select 
                                    value={settingsForm.preOrderRevenueMode || "FULFILLMENT_DAY"} 
                                    onChange={(e) => setSettingsForm({ ...settingsForm, preOrderRevenueMode: e.target.value })}
                                    className="w-full px-3 py-2 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 text-slate-800 dark:text-white cursor-pointer"
                                >
                                    <option value="BOOKING_DAY">Calculate Advance Payment in Today's Sales (Booking Day)</option>
                                    <option value="FULFILLMENT_DAY">Calculate on Fulfillment Day</option>
                                </select>
                                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-200/50 dark:border-white/5 flex items-start gap-2.5">
                                    <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                                    <p className="text-[9.5px] font-bold text-slate-500 dark:text-slate-400 uppercase leading-relaxed">
                                        {settingsForm.preOrderRevenueMode === "BOOKING_DAY" 
                                            ? "Advance payments are added to sales on booking day. Balance is recognized when fulfilled." 
                                            : "Sales are recognized only when the order is fulfilled/completed."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions Form */}
                    <div className="border-t border-slate-100 dark:border-white/5 pt-4 flex justify-end">
                        <button 
                            type="submit" 
                            disabled={saving}
                            className="pro-btn-primary h-10 px-5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider"
                        >
                            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Configurations
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default PreOrderSettings;
