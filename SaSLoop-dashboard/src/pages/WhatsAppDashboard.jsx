import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, TrendingUp, Users, MessageSquare, FileText,
  Megaphone, CheckCircle2, Clock, AlertCircle, XCircle,
  ArrowRight, Plus, Send, Zap, RefreshCw, Eye,
  BarChart3, Activity, Phone, Shield, ChevronRight, Wifi, WifiOff
} from "lucide-react";
import API_BASE from "../config";

const WhatsAppDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [connectionStatus, setConnectionStatus] = useState({ connected: false, status: "CHECKING" });
    const [stats, setStats] = useState({
        totalCampaigns: 0,
        activeTemplates: 0,
        messagesSent: 0,
        contacts: 0
    });
    const [animatedStats, setAnimatedStats] = useState({
        totalCampaigns: 0,
        activeTemplates: 0,
        messagesSent: 0,
        contacts: 0
    });

    const [campaignsList, setCampaignsList] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const authHeader = { "Authorization": `Bearer ${localStorage.getItem("token")}` };
                
                const [statusRes, analyticsRes, campaignsRes, templatesRes, contactsRes] = await Promise.all([
                    fetch(`${API_BASE}/api/whatsapp/status`, { headers: authHeader }).then(r => r.ok ? r.json() : null).catch(() => null),
                    fetch(`${API_BASE}/api/whatsapp/analytics`, { headers: authHeader }).then(r => r.ok ? r.json() : null).catch(() => null),
                    fetch(`${API_BASE}/api/whatsapp/campaigns`, { headers: authHeader }).then(r => r.ok ? r.json() : null).catch(() => null),
                    fetch(`${API_BASE}/api/whatsapp/templates`, { headers: authHeader }).then(r => r.ok ? r.json() : null).catch(() => null),
                    fetch(`${API_BASE}/api/crm/customers`, { headers: authHeader }).then(r => r.ok ? r.json() : null).catch(() => null)
                ]);

                if (statusRes) {
                    setConnectionStatus(statusRes);
                }

                setStats({
                    totalCampaigns: campaignsRes ? campaignsRes.length : 0,
                    activeTemplates: templatesRes ? templatesRes.length : 0,
                    messagesSent: analyticsRes ? (analyticsRes.sent || 0) : 0,
                    contacts: contactsRes ? contactsRes.length : 0
                });

                if (campaignsRes && campaignsRes.length > 0) {
                    setCampaignsList(campaignsRes.slice(0, 5).map(c => ({
                        ...c,
                        template: c.templateName,
                        audience: c.audienceSize
                    })));
                } else {
                    setCampaignsList([]);
                }
            } catch (e) {
                console.error("Dashboard Fetch Error:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const recentCampaigns = campaignsList;

    // Animate numbers on load
    useEffect(() => {
        if (loading) return;
        const duration = 1200;
        const steps = 40;
        const interval = duration / steps;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            setAnimatedStats({
                totalCampaigns: Math.round(stats.totalCampaigns * eased),
                activeTemplates: Math.round(stats.activeTemplates * eased),
                messagesSent: Math.round(stats.messagesSent * eased),
                contacts: Math.round(stats.contacts * eased)
            });
            if (step >= steps) clearInterval(timer);
        }, interval);

        return () => clearInterval(timer);
    }, [loading, stats]);

    const formatNumber = (n) => n.toLocaleString();

    const statusConfig = {
        COMPLETED: { color: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: CheckCircle2 },
        IN_PROGRESS: { color: "bg-blue-50 text-blue-600 border-blue-100", icon: Activity },
        SCHEDULED: { color: "bg-amber-50 text-amber-600 border-amber-100", icon: Clock },
        FAILED: { color: "bg-rose-50 text-rose-600 border-rose-100", icon: XCircle },
    };

    const quickActions = [
        { label: "Create Template", icon: Plus, path: "/whatsapp-marketing/templates", color: "from-emerald-500 to-emerald-600" },
        { label: "New Campaign", icon: Megaphone, path: "/whatsapp-marketing/campaigns", color: "from-blue-500 to-blue-600" },
        { label: "View Messages", icon: MessageSquare, path: "/whatsapp-marketing/messages", color: "from-indigo-500 to-indigo-600" },
        { label: "Analytics", icon: BarChart3, path: "/whatsapp-marketing/analytics", color: "from-violet-500 to-violet-600" },
    ];

    return (
        <div className="space-y-5 animate-pro-in">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">WhatsApp Marketing</h2>
                    <p className="text-[12px] text-slate-500">Overview of your campaigns, templates, and engagement metrics.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${connectionStatus.connected ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-500 border-rose-200'}`}>
                        {connectionStatus.connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                        {connectionStatus.connected ? "Connected" : "Disconnected"}
                    </div>
                    <button onClick={() => window.location.reload()} className="pro-btn-secondary h-8 text-[10px] px-3">
                        <RefreshCw className="w-3.5 h-3.5" /> Refresh
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Campaigns", value: formatNumber(animatedStats.totalCampaigns), sub: "12 this month", icon: TrendingUp, trend: "+8%", trendUp: true, accent: "emerald" },
                    { label: "Active Templates", value: formatNumber(animatedStats.activeTemplates), sub: "23 approved", icon: FileText, trend: "+14%", trendUp: true, accent: "blue" },
                    { label: "Messages Sent", value: formatNumber(animatedStats.messagesSent), sub: "Last 30 days", icon: Send, trend: "+22%", trendUp: true, accent: "indigo" },
                    { label: "Total Contacts", value: formatNumber(animatedStats.contacts), sub: "+439 this month", icon: Users, trend: "+3.2%", trendUp: true, accent: "violet" },
                ].map((stat, idx) => (
                    <div key={idx} className={`pro-card p-5 space-y-4 group hover:shadow-md transition-all duration-300 ${loading ? 'animate-pulse' : ''}`}>
                        <div className="flex items-center justify-between">
                            <span className="text-[12px] font-bold text-slate-500">{stat.label}</span>
                            <div className={`w-9 h-9 rounded-xl bg-${stat.accent}-50 flex items-center justify-center text-${stat.accent}-500 group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-4.5 h-4.5" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</h4>
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-medium text-slate-400">{stat.sub}</p>
                                <span className={`text-[10px] font-bold ${stat.trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>{stat.trend}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {quickActions.map((action, idx) => (
                    <button
                        key={idx}
                        onClick={() => navigate(action.path)}
                        className="pro-card p-4 flex items-center gap-3 group hover:shadow-md transition-all duration-300 cursor-pointer text-left"
                    >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                            <action.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-[12px] font-bold text-slate-900 block">{action.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
                    </button>
                ))}
            </div>

            {/* Account Metadata + Connection */}
            <div className="pro-card p-6 space-y-5">
                <div className="flex items-center gap-2 text-slate-900">
                    <MessageSquare className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-sm font-bold">WhatsApp Business Account</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${connectionStatus.connected ? 'bg-emerald-500' : 'bg-slate-300'}`} /> Verified Name
                        </p>
                        <p className="text-[13px] font-bold text-slate-900">{connectionStatus.connected ? (connectionStatus.verified_name || "SaSLoop ERP") : "Not Connected"}</p>
                        {connectionStatus.connected ? (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded uppercase border border-emerald-100 flex items-center w-fit gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Approved
                            </span>
                        ) : (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black rounded uppercase border border-slate-200 flex items-center w-fit gap-1">
                                <AlertCircle className="w-2.5 h-2.5" /> Inactive
                            </span>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${connectionStatus.connected ? 'bg-blue-500' : 'bg-slate-300'}`} /> Phone Number
                        </p>
                        <p className="text-[13px] font-bold text-slate-900">{connectionStatus.connected ? (connectionStatus.display_phone_number || "+91 93719 30687") : "N/A"}</p>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${connectionStatus.connected ? 'bg-emerald-500' : 'bg-slate-300'}`} /> Quality Rating
                        </p>
                        <div className="flex items-center gap-2">
                            <p className="text-[13px] font-black text-emerald-600 uppercase">{connectionStatus.connected ? "Green" : "N/A"}</p>
                            {connectionStatus.connected && (
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded border border-emerald-100">Excellent</span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${connectionStatus.connected ? 'bg-amber-500' : 'bg-slate-300'}`} /> Messaging Limit
                        </p>
                        <p className="text-[13px] font-bold text-slate-900">{connectionStatus.connected ? "TIER_100K" : "N/A"}</p>
                        {connectionStatus.connected && (
                            <p className="text-[10px] text-slate-400 font-medium italic">10,000 messages/day</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Campaigns Table */}
            <div className="pro-card overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-[13px] font-bold text-slate-900 flex items-center gap-2">
                        <Megaphone className="w-4 h-4 text-emerald-500" /> Recent Campaigns
                    </h3>
                    <button onClick={() => navigate('/whatsapp-marketing/campaigns')} className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
                        View All <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Campaign</th>
                                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Template</th>
                                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Audience</th>
                                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Sent</th>
                                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Delivered</th>
                                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Read</th>
                                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {recentCampaigns.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-10 text-slate-400 font-bold uppercase tracking-wider italic">
                                        <Megaphone className="w-8 h-8 text-slate-200 mx-auto mb-2 opacity-50" />
                                        No campaigns launched yet
                                    </td>
                                </tr>
                            ) : (
                                recentCampaigns.map((c, idx) => {
                                    const cfg = statusConfig[c.status] || statusConfig.COMPLETED;
                                    const StatusIcon = cfg.icon;
                                    return (
                                        <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <span className="text-[12px] font-bold text-slate-900">{c.name}</span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="text-[11px] font-medium text-slate-500 font-mono">{c.template}</span>
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <span className="text-[12px] font-bold text-slate-700">{c.audience.toLocaleString()}</span>
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <span className="text-[12px] font-bold text-slate-700">{c.sent.toLocaleString()}</span>
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <span className="text-[12px] font-bold text-emerald-600">{c.delivered.toLocaleString()}</span>
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <span className="text-[12px] font-bold text-blue-600">{c.read.toLocaleString()}</span>
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${cfg.color}`}>
                                                    <StatusIcon className="w-2.5 h-2.5" /> {c.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="text-[11px] font-medium text-slate-400">{c.date}</span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default WhatsAppDashboard;
