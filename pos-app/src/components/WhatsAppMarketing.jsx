import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, Search, RefreshCw, Filter, 
  Plus, Target, Layers, CheckCircle2, 
  Clock, Database, Globe, Share2,
  BarChart3, UserCheck, Edit3, Trash2,
  TrendingUp, Download, ChevronRight, X,
  Calendar, Check, AlertCircle, Eye, Sliders, Play, Pause,
  Bot, ShieldAlert, Sparkles, FileText, Send, User, CheckCheck,
  Wifi, WifiOff, LayoutDashboard, Megaphone,
  Activity, XCircle, Users, Volume2, VolumeX, Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { playConfiguredWaSound, playNewMessageSound, getWaSoundSettings, setWaSoundSettings } from "../utils/soundHelper";


const WhatsAppMarketing = ({ isDark, t, customerDb = {}, config = {}, initialSubTab = "chats" }) => {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab); // chats, dashboard, campaigns, settings
  const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:5000"
      : "https://backend.sasloop.in";

  const getHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("pos_token")}`
  });

  return (
    <div className={`h-full flex flex-col overflow-hidden ${isDark ? "bg-[#0d1117]" : "bg-slate-50"}`}>
      {/* Sub-navigation bar */}
      <div className={`h-12 border-b flex items-center justify-between px-6 shrink-0 bg-white dark:bg-[#161b22] border-slate-200 dark:border-[#30363d]`}>
        <div className="flex items-center gap-1.5">
          <MessageSquare className="w-5 h-5 text-emerald-500" />
          <span className="text-[13px] font-black uppercase tracking-wider text-slate-800 dark:text-white">
            WhatsApp Suite
          </span>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0d1117] p-0.5 rounded-lg">
          {[
            { id: "chats", label: "Chats", icon: MessageSquare },
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "campaigns", label: "Campaigns", icon: Megaphone },
            { id: "settings", label: "Sound Settings", icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  isActive 
                    ? "bg-white dark:bg-[#161b22] text-slate-900 dark:text-white shadow-sm" 
                    : "text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeSubTab === "dashboard" && (
            <motion.div 
              key="dashboard" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="h-full overflow-y-auto p-6 space-y-6 no-scrollbar"
            >
              <DashboardView 
                API_BASE={API_BASE} 
                getHeaders={getHeaders} 
                setActiveSubTab={setActiveSubTab} 
                customerDb={customerDb} 
                isDark={isDark}
              />
            </motion.div>
          )}

          {activeSubTab === "campaigns" && (
            <motion.div 
              key="campaigns" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="h-full overflow-y-auto p-6 space-y-6 no-scrollbar"
            >
              <CampaignsView 
                API_BASE={API_BASE} 
                getHeaders={getHeaders} 
                customerDb={customerDb} 
                isDark={isDark}
              />
            </motion.div>
          )}

          {activeSubTab === "chats" && (
            <motion.div 
              key="chats" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <ChatsView 
                API_BASE={API_BASE} 
                getHeaders={getHeaders} 
                isDark={isDark}
              />
            </motion.div>
          )}

          {activeSubTab === "settings" && (
            <motion.div 
              key="settings" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="h-full overflow-y-auto p-6 space-y-6 no-scrollbar"
            >
              <SoundSettingsView isDark={isDark} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* ⚙️ SOUND SETTINGS SUB-VIEW                                                */
/* ========================================================================= */
const SoundSettingsView = ({ isDark }) => {
  const [soundSettings, setSoundSettingsState] = useState(() => getWaSoundSettings());
  const [testPlaying, setTestPlaying] = useState(false);

  const handleToggleEnable = (e) => {
    const newEnabled = e.target.checked;
    setWaSoundSettings(newEnabled, soundSettings.soundType);
    setSoundSettingsState(prev => ({ ...prev, enabled: newEnabled }));
  };

  const handleSelectSoundType = (type) => {
    setWaSoundSettings(soundSettings.enabled, type);
    setSoundSettingsState(prev => ({ ...prev, soundType: type }));
    playNewMessageSound(type);
  };

  const handleTestSound = () => {
    playNewMessageSound(soundSettings.soundType);
    setTestPlaying(true);
    setTimeout(() => setTestPlaying(false), 1500);
  };

  const soundOptions = [
    { id: 'default', label: 'Default Chime', desc: 'Classic double-tone notification chime' },
    { id: 'bell', label: 'Crystal Bell', desc: 'Sustained 880Hz high bell ring' },
    { id: 'ping', label: 'Quick Ping', desc: 'Short crisp 1046Hz alert ping' },
    { id: 'pop', label: 'Pop Alert', desc: 'Snappy frequency sweep pop tone' }
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">WhatsApp Notification Settings</h2>
          <p className="text-[10px] text-slate-450 dark:text-slate-400 uppercase font-black tracking-widest mt-0.5">Customize or disable notification sound alerts for incoming messages</p>
        </div>
      </div>

      {/* Main Sound Switch Card */}
      <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] p-6 rounded-2xl shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-[#30363d]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${soundSettings.enabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
              {soundSettings.enabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-slate-800 dark:text-white tracking-wider">Incoming Message Sound Alert</h3>
              <p className="text-[10px] text-slate-400 font-medium">Play sound chime when a new customer WhatsApp message arrives</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={soundSettings.enabled} 
              onChange={handleToggleEnable} 
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Sound Selection Options */}
        {soundSettings.enabled ? (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">Select Sound Alert Tone</label>
              <button 
                onClick={handleTestSound}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                {testPlaying ? "Playing Chime..." : "🔊 Test Sound"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {soundOptions.map(opt => {
                const isSelected = soundSettings.soundType === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectSoundType(opt.id)}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-500/10 shadow-sm"
                        : "border-slate-200 dark:border-[#30363d] hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[12px] font-bold ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>
                        {opt.label}
                      </span>
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                      )}
                    </div>
                    <p className="text-[9.5px] text-slate-400 font-medium mt-1">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
            🔇 Sound notifications are currently disabled
          </div>
        )}
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 📊 DASHBOARD SUB-VIEW                                                     */
/* ========================================================================= */
const DashboardView = ({ API_BASE, getHeaders, setActiveSubTab, customerDb, isDark }) => {
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, status: "CHECKING" });
  const [stats, setStats] = useState({
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
        const headers = getHeaders();
        const [statusRes, analyticsRes, campaignsRes, templatesRes] = await Promise.all([
          fetch(`${API_BASE}/api/whatsapp/status`, { headers }).then(r => r.ok ? r.json() : null).catch(() => null),
          fetch(`${API_BASE}/api/whatsapp/analytics`, { headers }).then(r => r.ok ? r.json() : null).catch(() => null),
          fetch(`${API_BASE}/api/whatsapp/campaigns`, { headers }).then(r => r.ok ? r.json() : null).catch(() => null),
          fetch(`${API_BASE}/api/whatsapp/templates`, { headers }).then(r => r.ok ? r.json() : null).catch(() => null)
        ]);

        if (statusRes) {
          setConnectionStatus(statusRes);
        }

        setStats({
          totalCampaigns: campaignsRes ? campaignsRes.length : 0,
          activeTemplates: templatesRes ? templatesRes.length : 0,
          messagesSent: analyticsRes ? (analyticsRes.sent || 0) : 0,
          contacts: Object.keys(customerDb).length
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
  }, [customerDb]);

  const statusConfig = {
    COMPLETED: { color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border-emerald-150 dark:border-emerald-500/20", icon: CheckCircle2 },
    IN_PROGRESS: { color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-405 border-blue-150 dark:border-blue-500/20", icon: Activity },
    SCHEDULED: { color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-450 border-amber-150 dark:border-amber-500/20", icon: Clock },
    FAILED: { color: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-450 border-rose-150 dark:border-rose-500/20", icon: XCircle }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Panel */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">WhatsApp Marketing Overview</h2>
          <p className="text-[10px] text-slate-450 dark:text-slate-400 uppercase font-black tracking-widest mt-0.5">Performance statistics and live channel metrics</p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
            connectionStatus.connected 
              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30" 
              : "bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-200 dark:border-rose-500/30"
          }`}>
            {connectionStatus.connected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {connectionStatus.connected ? "Connected" : "Disconnected"}
          </div>
        </div>
      </div>

      {/* Stats Blocks */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Campaigns", value: stats.totalCampaigns, icon: TrendingUp, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" },
          { label: "Active Templates", value: stats.activeTemplates, icon: FileText, color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10" },
          { label: "Messages Sent", value: stats.messagesSent.toLocaleString(), icon: Send, color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10" },
          { label: "Total CRM Contacts", value: stats.contacts, icon: Users, color: "text-violet-500 bg-violet-50 dark:bg-violet-500/10" }
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-wider">{item.label}</span>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{loading ? "..." : item.value}</h4>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Panel */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "New Broadcast Campaign", sub: "Trigger template messages to audience segments", icon: Megaphone, action: () => setActiveSubTab("campaigns") },
          { label: "Open Live Chat Inbox", sub: "Message customers directly in real-time", icon: MessageSquare, action: () => setActiveSubTab("chats") },
          { label: "Manage Customers", sub: "View loyalty levels and spend profile metrics", icon: Users, action: () => { window.setActiveTrayTab && window.setActiveTrayTab("Loyalty"); } }
        ].map((act, idx) => (
          <button
            key={idx}
            onClick={act.action}
            className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] p-4 rounded-2xl hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-600 transition-all text-left flex items-start gap-4 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <act.icon className="w-5 h-5" />
            </div>
            <div className="space-y-1 min-w-0">
              <span className="text-[12px] font-bold text-slate-800 dark:text-white block truncate">{act.label}</span>
              <p className="text-[9.5px] text-slate-400 dark:text-slate-400 font-medium leading-tight">{act.sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Account connection status */}
      <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-800 dark:text-white">
          <Globe className="w-5 h-5 text-emerald-500" />
          <h3 className="text-xs font-black uppercase tracking-wider">Meta API Integration Status</h3>
        </div>
        <div className="grid grid-cols-4 gap-6">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-400">Verified Name</span>
            <p className="text-[12px] font-bold text-slate-800 dark:text-white">{connectionStatus.connected ? (connectionStatus.verified_name || "SaSLoop ERP") : "Not Connected"}</p>
            {connectionStatus.connected ? (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-55 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[8px] font-black rounded uppercase border border-emerald-100 dark:border-emerald-500/20">
                <CheckCircle2 className="w-2.5 h-2.5" /> Approved
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[8px] font-black rounded uppercase border border-slate-200 dark:border-white/5">
                <AlertCircle className="w-2.5 h-2.5" /> Inactive
              </span>
            )}
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-400">Phone Number</span>
            <p className="text-[12px] font-bold text-slate-800 dark:text-white">{connectionStatus.connected ? (connectionStatus.display_phone_number || "+91 93719 30687") : "N/A"}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-400">Quality Rating</span>
            <p className="text-[12px] font-black text-emerald-500 uppercase">{connectionStatus.connected ? "Green" : "N/A"}</p>
            {connectionStatus.connected && <span className="text-[9.5px] text-slate-400 dark:text-slate-400">Excellent</span>}
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-400">Tier Capacity</span>
            <p className="text-[12px] font-bold text-slate-800 dark:text-white">{connectionStatus.connected ? "TIER_100K" : "N/A"}</p>
            {connectionStatus.connected && <span className="text-[9.5px] text-slate-400 dark:text-slate-400">10,000 sent/day</span>}
          </div>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-[#30363d] flex items-center justify-between">
          <h3 className="text-xs font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-emerald-500" /> Recent Broadcast Campaigns
          </h3>
          {campaignsList.length > 0 && (
            <button onClick={() => setActiveSubTab("campaigns")} className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-[#30363d] text-[9px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-400">
                <th className="px-5 py-3">Campaign</th>
                <th className="px-5 py-3">Template</th>
                <th className="px-5 py-3 text-center">Audience</th>
                <th className="px-5 py-3 text-center">Sent</th>
                <th className="px-5 py-3 text-center">Delivered</th>
                <th className="px-5 py-3 text-center">Read</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3">Launched</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#30363d]">
              {campaignsList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider italic">
                    <Megaphone className="w-7 h-7 mx-auto mb-2 opacity-40 text-slate-300" />
                    No campaigns launched yet
                  </td>
                </tr>
              ) : (
                campaignsList.map((c, idx) => {
                  const cfg = statusConfig[c.status] || statusConfig.COMPLETED;
                  const StatusIcon = cfg.icon;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors text-slate-700 dark:text-[#c9d1d9]">
                      <td className="px-5 py-3 font-bold text-slate-800 dark:text-white">{c.name}</td>
                      <td className="px-5 py-3 font-mono font-bold text-slate-500 dark:text-slate-400">{c.template}</td>
                      <td className="px-5 py-3 text-center font-bold">{c.audience}</td>
                      <td className="px-5 py-3 text-center font-bold">{c.sent}</td>
                      <td className="px-5 py-3 text-center font-bold text-emerald-600">{c.delivered}</td>
                      <td className="px-5 py-3 text-center font-bold text-blue-600">{c.read}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-black uppercase border ${cfg.color}`}>
                          <StatusIcon className="w-2.5 h-2.5" /> {c.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-400 dark:text-slate-400">{c.date}</td>
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

/* ========================================================================= */
/* 📣 CAMPAIGNS SUB-VIEW                                                     */
/* ========================================================================= */
const CampaignsView = ({ API_BASE, getHeaders, customerDb, isDark }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");
  const [toastMsg, setToastMsg] = useState(null);

  // Wizard state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [activeChatCount, setActiveChatCount] = useState(0);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    templateId: "",
    audienceSource: "GROUP", // GROUP, CSV
    selectedGroup: "ALL_CRM", // ALL_CRM, VIP, INACTIVE, LEADS
    csvFileName: "",
    scheduleType: "IMMEDIATE",
    scheduledDate: "",
    scheduledTime: "",
    delayInterval: "2",
    deliveryType: "TEMPLATE"
  });

  const showToast = (msg, type = "success") => {
    setToastMsg({ text: msg, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const customerGroups = [
    { id: "ALL_CRM", name: `All Customers (${Object.keys(customerDb).length} Contacts)` },
    { id: "VIP", name: `VIP Loyalists (${Object.values(customerDb).filter(c => c.totalSpent > 5000).length} Contacts)` },
    { id: "INACTIVE", name: `Dormant (3+ months) (${Object.values(customerDb).filter(c => c.orders > 0).length} Contacts)` },
    { id: "ACTIVE", name: `Active Chats (Last 24 Hours) (${activeChatCount} Contacts)` },
    { id: "LEADS", name: `New Table Enquiries (65 Contacts)` }
  ];

  const fetchCampaignsAndTemplates = async () => {
    setLoading(true);
    try {
      const headers = getHeaders();
      const [tplRes, cmpRes, segmentsRes] = await Promise.all([
        fetch(`${API_BASE}/api/whatsapp/templates`, { headers }),
        fetch(`${API_BASE}/api/whatsapp/campaigns`, { headers }),
        fetch(`${API_BASE}/api/crm/segments`, { headers }).then(r => r.ok ? r.json() : null).catch(() => null)
      ]);

      if (segmentsRes) {
        setActiveChatCount(segmentsRes.active_chat_count || 0);
      }

      if (tplRes.ok) {
        const tplData = await tplRes.json();
        setTemplates(tplData.map(t => ({
          id: t.name,
          name: t.name,
          body: t.body,
          type: t.category
        })));
      } else {
        setTemplates([]);
      }

      if (cmpRes.ok) {
        const cmpData = await cmpRes.json();
        setCampaigns(cmpData);
      } else {
        setCampaigns([]);
      }
    } catch (err) {
      console.error("Failed to fetch campaigns/templates", err);
      setTemplates([]);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignsAndTemplates();
  }, []);

  const handleCreateCampaignSubmit = async () => {
    if (!newCampaign.name || !newCampaign.templateId) {
      alert("Please enter a campaign name and select a template");
      return;
    }

    try {
      const headers = getHeaders();
      const res = await fetch(`${API_BASE}/api/whatsapp/campaigns`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: newCampaign.name,
          templateId: newCampaign.templateId,
          audienceSource: newCampaign.audienceSource,
          selectedGroup: newCampaign.selectedGroup,
          delayInterval: newCampaign.delayInterval,
          scheduleType: newCampaign.scheduleType,
          scheduledDate: newCampaign.scheduledDate,
          scheduledTime: newCampaign.scheduledTime,
          deliveryType: newCampaign.deliveryType
        })
      });

      if (res.ok) {
        const created = await res.json();
        setCampaigns([created, ...campaigns]);
        setIsWizardOpen(false);
        setWizardStep(1);
        showToast(`Campaign "${newCampaign.name}" initiated successfully!`);
        
        // Reset form
        setNewCampaign({
          name: "",
          templateId: "",
          audienceSource: "GROUP",
          selectedGroup: "ALL_CRM",
          csvFileName: "",
          scheduleType: "IMMEDIATE",
          scheduledDate: "",
          scheduledTime: "",
          delayInterval: "2",
          deliveryType: "TEMPLATE"
        });
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to create campaign.", "error");
      }
    } catch (err) {
      console.error("Error creating campaign:", err);
      showToast("Failed to connect to campaign service.", "error");
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (window.confirm("Are you sure you want to stop/delete this campaign?")) {
      try {
        const headers = getHeaders();
        const res = await fetch(`${API_BASE}/api/whatsapp/campaigns/${id}`, {
          method: "DELETE",
          headers
        });
        if (res.ok) {
          setCampaigns(campaigns.filter(c => c.id !== id));
          showToast("Campaign deleted successfully.", "error");
        } else {
          showToast("Failed to delete campaign.", "error");
        }
      } catch (err) {
        showToast("Error connecting to campaign service.", "error");
      }
    }
  };

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.templateName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatusFilter === "ALL" || c.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const getTelemetry = () => {
    const totalSent = campaigns.reduce((acc, c) => acc + c.sent, 0);
    const totalDelivered = campaigns.reduce((acc, c) => acc + c.delivered, 0);
    const totalRead = campaigns.reduce((acc, c) => acc + c.read, 0);
    const totalFailed = campaigns.reduce((acc, c) => acc + c.failed, 0);
    return { totalSent, totalDelivered, totalRead, totalFailed };
  };

  const telemetry = getTelemetry();

  return (
    <div className="space-y-5 pb-8">
      {/* Toast */}
      {toastMsg && (
        <div className={`fixed top-4 right-4 z-[9999] flex items-center gap-3 px-4 py-3 rounded shadow-xl text-white transition-all transform animate-bounce ${
          toastMsg.type === "success" ? "bg-emerald-600" : "bg-rose-600"
        }`}>
          {toastMsg.type === "success" ? <CheckCircle2 className="w-5 h-5 text-white" /> : <AlertCircle className="w-5 h-5 text-white" />}
          <span className="text-[11px] font-bold uppercase tracking-wider">{toastMsg.text}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">WhatsApp Broadcast Campaigns</h2>
          <p className="text-[10px] text-slate-450 uppercase font-black tracking-widest mt-0.5">Dispatch bulk marketing templates and monitor delivery telemetry</p>
        </div>

        <button 
          onClick={() => setIsWizardOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/10 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      {/* Telemetry Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Sent", value: telemetry.totalSent, color: "text-slate-800 dark:text-white", desc: "Processed packets" },
          { label: "Delivered", value: telemetry.totalDelivered, color: "text-emerald-600 dark:text-emerald-450", desc: `${telemetry.totalSent > 0 ? Math.round((telemetry.totalDelivered/telemetry.totalSent)*100) : 0}% Delivery rate` },
          { label: "Read (Opens)", value: telemetry.totalRead, color: "text-blue-600 dark:text-blue-450", desc: `${telemetry.totalDelivered > 0 ? Math.round((telemetry.totalRead/telemetry.totalDelivered)*100) : 0}% Open rate` },
          { label: "Failed Packets", value: telemetry.totalFailed, color: "text-rose-600 dark:text-rose-450", desc: `${telemetry.totalSent > 0 ? ((telemetry.totalFailed/telemetry.totalSent)*100).toFixed(1) : 0}% Fail rate` }
        ].map((card, idx) => (
          <div key={idx} className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] p-4 rounded-2xl shadow-sm">
            <span className="text-[8.5px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-wider block">{card.label}</span>
            <h3 className={`text-xl font-black mt-1 ${card.color}`}>{card.value.toLocaleString()}</h3>
            <span className="text-[8.5px] text-slate-400 dark:text-slate-400 font-bold block mt-0.5">{card.desc}</span>
          </div>
        ))}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] p-3 rounded-2xl shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-lg px-3 py-1.5 w-64">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent text-[11px] font-medium outline-none w-full text-slate-800 dark:text-[#c9d1d9]"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0d1117] p-1 rounded-lg">
          {[
            { label: "All", value: "ALL" },
            { label: "Completed", value: "COMPLETED" },
            { label: "In Progress", value: "IN_PROGRESS" },
            { label: "Scheduled", value: "SCHEDULED" }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setSelectedStatusFilter(tab.value)}
              className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${
                selectedStatusFilter === tab.value
                  ? "bg-white dark:bg-[#161b22] text-slate-850 dark:text-white shadow-sm"
                  : "text-slate-450 hover:text-slate-650"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns list Table */}
      <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-[#30363d] bg-slate-50/50 dark:bg-white/5 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-slate-450 dark:text-slate-400 tracking-wider">Campaign Registries</span>
          <span className="text-[9px] text-slate-400 font-bold">{filteredCampaigns.length} campaigns matched</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-150 dark:border-[#30363d] text-[9.5px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-400">
                <th className="px-4 py-3">Campaign Details</th>
                <th className="px-4 py-3">Template</th>
                <th className="px-4 py-3 text-center">Audience</th>
                <th className="px-4 py-3">Progress / Telemetry</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3">Launched / Scheduled</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#30363d]">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider italic">
                    <Database className="w-8 h-8 text-slate-200 mx-auto mb-2 opacity-50" />
                    No campaigns match the filters
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map(c => {
                  const deliveryRate = c.sent > 0 ? Math.round((c.delivered / c.sent) * 100) : 0;
                  const readRate = c.delivered > 0 ? Math.round((c.read / c.delivered) * 100) : 0;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/20 dark:hover:bg-white/5 transition-colors text-slate-700 dark:text-[#c9d1d9]">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-800 dark:text-white">{c.name}</div>
                        <div className="text-[8.5px] text-slate-400 mt-0.5">ID: {c.id}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-slate-600 dark:text-slate-400 font-bold bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 px-1.5 py-0.5 rounded text-[10px]">
                          {c.templateName}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold">{c.audienceSize}</td>
                      <td className="px-4 py-3 min-w-[200px]">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8.5px] text-slate-400 font-bold">
                            <span>Delivered: {deliveryRate}%</span>
                            <span>Read: {readRate}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 dark:bg-[#0d1117] rounded-full overflow-hidden flex">
                            <div className="bg-emerald-500 h-full" style={{ width: `${deliveryRate}%` }}></div>
                            <div className="bg-blue-400 h-full" style={{ width: `${c.sent > 0 ? (c.read / c.sent) * 100 : 0}%` }}></div>
                          </div>
                          <div className="flex justify-between text-[8.5px] text-slate-400 font-medium">
                            <span>Sent: {c.sent}</span>
                            <span>Read: {c.read}</span>
                            <span className="text-rose-500 font-bold">Fail: {c.failed}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                          c.status === "COMPLETED" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20" :
                          c.status === "IN_PROGRESS" ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20 animate-pulse" :
                          c.status === "SCHEDULED" ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20" :
                          "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/5"
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-450 dark:text-slate-400 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{c.date}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteCampaign(c.id)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete Campaign"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign wizard modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal header */}
            <div className="border-b border-slate-100 dark:border-[#30363d] px-6 py-4 flex items-center justify-between bg-slate-50 dark:bg-white/5">
              <div>
                <h3 className="text-xs font-black uppercase text-slate-800 dark:text-white tracking-wider">New WhatsApp Campaign</h3>
                <p className="text-[10px] text-slate-450">Broadcast templates to target customer directories</p>
              </div>
              <button onClick={() => setIsWizardOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps indicator */}
            <div className="px-6 py-3 bg-slate-100/50 dark:bg-[#0d1117] border-b border-slate-150 dark:border-[#30363d] flex items-center justify-between text-[9px] font-black uppercase text-slate-400">
              {[
                { step: 1, label: "Template" },
                { step: 2, label: "Audience" },
                { step: 3, label: "Schedule" },
                { step: 4, label: "Review" }
              ].map(s => (
                <div key={s.step} className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono ${
                    wizardStep === s.step ? "bg-emerald-600 text-white" :
                    wizardStep > s.step ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400" :
                    "bg-slate-250 dark:bg-white/5 text-slate-500 dark:text-slate-400"
                  }`}>
                    {wizardStep > s.step ? <Check className="w-3 h-3" /> : s.step}
                  </span>
                  <span className={wizardStep === s.step ? "text-slate-800 dark:text-white font-bold" : ""}>{s.label}</span>
                  {s.step < 4 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
                </div>
              ))}
            </div>

            {/* Body */}
            <div className="p-6 flex-1 overflow-y-auto min-h-[300px] text-slate-800 dark:text-[#c9d1d9]">
              {wizardStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-[9.5px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-wider mb-1">Campaign Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Weekend brunch promo"
                      value={newCampaign.name}
                      onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-lg px-3 py-2 text-xs font-bold outline-none text-slate-800 dark:text-white focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-wider mb-1.5">Select Message Template</label>
                    {templates.length === 0 ? (
                      <div className="p-8 border border-dashed rounded-xl text-center text-slate-450 dark:text-slate-400">
                        <FileText className="w-8 h-8 text-slate-200 mx-auto mb-2 opacity-55" />
                        No templates found. Go to Back-office to create WhatsApp Templates.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                        {templates.map(tpl => (
                          <label
                            key={tpl.id}
                            onClick={() => setNewCampaign({ ...newCampaign, templateId: tpl.id })}
                            className={`block p-3 rounded-lg border cursor-pointer transition-all ${
                              newCampaign.templateId === tpl.id
                                ? "border-emerald-500 bg-emerald-50/15 dark:bg-emerald-500/10 shadow-sm"
                                : "border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="templateSelect"
                                  checked={newCampaign.templateId === tpl.id}
                                  readOnly
                                  className="text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="text-xs font-bold text-slate-800 dark:text-white">{tpl.name}</span>
                              </div>
                              <span className="px-1.5 py-0.5 rounded text-[8px] bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-black uppercase border border-slate-200 dark:border-white/5">
                                {tpl.type}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 dark:text-slate-400 font-mono mt-1 leading-snug truncate">{tpl.body}</p>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-[9.5px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-wider mb-1.5">Audience Source</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setNewCampaign({ ...newCampaign, audienceSource: "GROUP" })}
                        className={`p-3 rounded-lg border text-center font-bold text-[11px] flex flex-col items-center gap-1.5 ${
                          newCampaign.audienceSource === "GROUP"
                            ? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400"
                            : "border-slate-200 dark:border-white/5 bg-white dark:bg-[#161b22] text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        <Layers className="w-5 h-5 text-slate-400" />
                        CRM Segments
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewCampaign({ ...newCampaign, audienceSource: "CSV" })}
                        className={`p-3 rounded-lg border text-center font-bold text-[11px] flex flex-col items-center gap-1.5 ${
                          newCampaign.audienceSource === "CSV"
                            ? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400"
                            : "border-slate-200 dark:border-white/5 bg-white dark:bg-[#161b22] text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        <Database className="w-5 h-5 text-slate-400" />
                        Upload CSV List
                      </button>
                    </div>
                  </div>

                  {newCampaign.audienceSource === "GROUP" ? (
                    <div>
                      <label className="block text-[9.5px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-wider mb-1.5">Select Segment</label>
                      <select
                        value={newCampaign.selectedGroup}
                        onChange={e => setNewCampaign({ ...newCampaign, selectedGroup: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-lg px-3 py-2 text-xs font-bold text-slate-700 dark:text-white outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        {customerGroups.map(g => (
                          <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[9.5px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-wider mb-1.5">CSV File</label>
                      <div className="border-2 border-dashed border-slate-200 dark:border-[#30363d] rounded-xl p-6 text-center bg-slate-50/50 dark:bg-[#0d1117]">
                        <Database className="w-8 h-8 text-slate-350 dark:text-slate-400 mx-auto mb-1.5" />
                        <span className="text-[11px] text-slate-600 dark:text-[#c9d1d9] font-bold block">June_Blast_List.csv</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-400 block mt-0.5">Uploaded containing 140 contacts</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-[9.5px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-wider mb-1.5">Temporal Dispatch Mode</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setNewCampaign({ ...newCampaign, scheduleType: "IMMEDIATE" })}
                        className={`p-3 rounded-lg border text-center font-bold text-[11px] flex flex-col items-center gap-1.5 ${
                          newCampaign.scheduleType === "IMMEDIATE"
                            ? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400"
                            : "border-slate-200 dark:border-white/5 bg-white dark:bg-[#161b22] text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        <Play className="w-5 h-5 text-slate-400" />
                        Immediate Execution
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewCampaign({ ...newCampaign, scheduleType: "SCHEDULED" })}
                        className={`p-3 rounded-lg border text-center font-bold text-[11px] flex flex-col items-center gap-1.5 ${
                          newCampaign.scheduleType === "SCHEDULED"
                            ? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400"
                            : "border-slate-200 dark:border-white/5 bg-white dark:bg-[#161b22] text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        <Calendar className="w-5 h-5 text-slate-400" />
                        Schedule for Later
                      </button>
                    </div>
                  </div>

                  {newCampaign.scheduleType === "SCHEDULED" && (
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-[#0d1117] p-3 border border-slate-150 dark:border-[#30363d] rounded-xl">
                      <div>
                        <label className="block text-[8.5px] font-black uppercase text-slate-450 dark:text-slate-400 mb-1">Target Date</label>
                        <input
                          type="date"
                          value={newCampaign.scheduledDate}
                          onChange={e => setNewCampaign({ ...newCampaign, scheduledDate: e.target.value })}
                          className="w-full bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[8.5px] font-black uppercase text-slate-450 dark:text-slate-400 mb-1">Target Time</label>
                        <input
                          type="time"
                          value={newCampaign.scheduledTime}
                          onChange={e => setNewCampaign({ ...newCampaign, scheduledTime: e.target.value })}
                          className="w-full bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Delivery Options */}
                  <div className="bg-slate-50 dark:bg-[#0d1117] border border-slate-150 dark:border-[#30363d] p-3 rounded-xl space-y-2">
                    <label className="block text-[9.5px] font-black uppercase text-[#2563eb] dark:text-[#2563eb] flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> Delivery Options
                    </label>
                    <p className="text-[9px] text-slate-450 dark:text-slate-400 leading-tight">Choose how you want to dispatch this message. Plain-text mode bypasses template setup fees and rules, but only delivers to contacts with an open 24h chat.</p>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setNewCampaign({ ...newCampaign, deliveryType: "TEMPLATE" })}
                        className={`py-1.5 px-3 rounded-lg border text-center font-bold text-[10px] ${
                          newCampaign.deliveryType === "TEMPLATE"
                            ? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-450"
                            : "border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] text-slate-650 dark:text-slate-450 hover:bg-slate-50"
                        }`}
                      >
                        Native Template
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewCampaign({ ...newCampaign, deliveryType: "TEXT" })}
                        className={`py-1.5 px-3 rounded-lg border text-center font-bold text-[10px] ${
                          newCampaign.deliveryType === "TEXT"
                            ? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-450"
                            : "border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] text-slate-650 dark:text-slate-450 hover:bg-slate-50"
                        }`}
                      >
                        Plain Text Bypass
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-[#0d1117] border border-slate-155 dark:border-[#30363d] p-3 rounded-xl space-y-2">
                    <label className="block text-[9.5px] font-black uppercase text-slate-650 dark:text-[#c9d1d9] flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5 text-emerald-500" /> Throttling Configuration
                    </label>
                    <p className="text-[9px] text-slate-400 dark:text-slate-400 leading-tight">Introduce a sequential delay interval between dispatch packets. Helps protect your WhatsApp Business number rating.</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase">Wait Interval:</span>
                      <select
                        value={newCampaign.delayInterval}
                        onChange={e => setNewCampaign({ ...newCampaign, delayInterval: e.target.value })}
                        className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded px-2 py-1 text-[10px] font-bold outline-none text-slate-700 dark:text-white cursor-pointer"
                      >
                        <option value="1">1 second</option>
                        <option value="2">2 seconds (Safe)</option>
                        <option value="5">5 seconds (Ideal)</option>
                        <option value="10">10 seconds</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-4 animate-fade-in text-xs font-medium text-slate-700 dark:text-[#c9d1d9]">
                  <div className="bg-slate-50 dark:bg-[#0d1117] border border-slate-150 dark:border-[#30363d] p-4 rounded-xl space-y-3">
                    <div className="flex justify-between border-b pb-2 dark:border-white/5">
                      <span className="font-bold text-slate-450 dark:text-slate-400">Campaign Name:</span>
                      <span className="font-bold text-slate-800 dark:text-white">{newCampaign.name}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 dark:border-white/5">
                      <span className="font-bold text-slate-450 dark:text-slate-400">Selected Template:</span>
                      <span className="font-bold font-mono text-slate-800 dark:text-white">{newCampaign.templateId}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 dark:border-white/5">
                      <span className="font-bold text-slate-450 dark:text-slate-400">Audience Group:</span>
                      <span className="font-bold text-slate-800 dark:text-white">
                        {newCampaign.audienceSource === "GROUP"
                          ? customerGroups.find(g => g.id === newCampaign.selectedGroup)?.name || newCampaign.selectedGroup
                          : `CSV Uploaded (${newCampaign.csvFileName})`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-450 dark:text-slate-400">Dispatch timing:</span>
                      <span className="font-bold text-slate-800 dark:text-white uppercase">
                        {newCampaign.scheduleType === "IMMEDIATE"
                          ? "IMMEDIATE SEND"
                          : `SCHEDULED FOR: ${newCampaign.scheduledDate} AT ${newCampaign.scheduledTime}`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-3 rounded-lg text-[10px] text-emerald-800 dark:text-emerald-400">
                    <AlertCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                    <span>Proceeding will queue this campaign. Please ensure your WhatsApp status is connected and wallet balance is sufficient.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 dark:border-[#30363d] p-4 bg-slate-50 dark:bg-white/5 flex items-center justify-between shrink-0">
              <button
                type="button"
                disabled={wizardStep === 1}
                onClick={() => setWizardStep(prev => prev - 1)}
                className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${
                  wizardStep === 1
                    ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Back
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsWizardOpen(false)}
                  className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] text-slate-600 dark:text-slate-300 px-4 py-2 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-50 dark:hover:bg-[#30363d] transition-all"
                >
                  Cancel
                </button>
                {wizardStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (wizardStep === 1 && !newCampaign.name) {
                        alert("Campaign reference name is required");
                        return;
                      }
                      if (wizardStep === 1 && !newCampaign.templateId) {
                        alert("Please select a template first");
                        return;
                      }
                      setWizardStep(prev => prev + 1);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCreateCampaignSubmit}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-md shadow-emerald-600/10"
                  >
                    Submit & Launch
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ========================================================================= */
/* 💬 CHATS SUB-VIEW                                                         */
/* ========================================================================= */
const ChatsView = ({ API_BASE, getHeaders, isDark, onUnreadCountChange }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL"); // ALL, UNREAD, BOT_PAUSED

  // Modals & Popovers
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateVariables, setTemplateVariables] = useState([]);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [approvedTemplates, setApprovedTemplates] = useState([]);

  const messagesEndRef = useRef(null);
  const prevUnreadTotalRef = useRef(-1);
  const isFirstFetchRef = useRef(true);

  const fetchChats = async () => {

    try {
      const headers = getHeaders();
      let crmCustomers = [];
      try {
        const crmRes = await fetch(`${API_BASE}/api/crm/customers`, { headers });
        if (crmRes.ok) crmCustomers = await crmRes.json();
      } catch (err) {
        console.error("Failed to fetch CRM customers in ChatsView:", err);
      }

      const crmMap = {};
      crmCustomers.forEach(cust => {
        crmMap[cust.customer_number || cust.phone] = cust;
      });

      const res = await fetch(`${API_BASE}/api/whatsapp/chats`, { headers });
      if (res.ok) {
        const data = await res.json();
        const rawMessages = data.chats || [];
        const pausedNumbers = data.pausedNumbers || [];

        // Deduplicate by message ID
        const seenIds = new Set();
        const uniqueMessages = rawMessages.filter(msg => {
          if (seenIds.has(msg.id)) return false;
          seenIds.add(msg.id);
          return true;
        });

        const grouped = {};
        uniqueMessages.forEach(msg => {
          const phone = msg.customerNumber;
          if (!grouped[phone]) grouped[phone] = [];
          grouped[phone].push(msg);
        });

        const contactList = Object.keys(grouped).map(phone => {
          const thread = grouped[phone].sort((a, b) => new Date(a.time) - new Date(b.time));
          const lastMsg = thread[thread.length - 1];
          const unreadCount = thread.filter(m => m.role === "customer" && !m.is_read).length;
          const lastTime = new Date(lastMsg.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          const botPaused = pausedNumbers.includes(phone);
          const crmUser = crmMap[phone] || {};

          return {
            id: phone,
            name: crmUser.name || phone,
            phone: phone,
            lastMessage: lastMsg.text,
            time: lastTime,
            unread: unreadCount,
            avatar: (crmUser.name || phone).substring(0, 2).toUpperCase(),
            botPaused: botPaused,
            botPauseUntil: botPaused ? "Manual Takeover" : undefined,
            tags: crmUser.points > 1000 ? ["VIP"] : ["Regular"],
            email: crmUser.email || "",
            location: crmUser.address || ""
          };
        });

        contactList.sort((a, b) => {
          const aMsgs = grouped[a.phone];
          const bMsgs = grouped[b.phone];
          const aMax = new Date(aMsgs[aMsgs.length - 1].time);
          const bMax = new Date(bMsgs[bMsgs.length - 1].time);
          return bMax - aMax;
        });

        const threadsMap = {};
        Object.keys(grouped).forEach(phone => {
          threadsMap[phone] = grouped[phone].map(m => ({
            id: m.id,
            text: m.text,
            sender: m.role,
            time: new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }));
        });

        setChats(contactList);
        setChatMessages(threadsMap);

        const totalUnreadCount = contactList.reduce((acc, c) => acc + (c.unread || 0), 0);
        if (typeof onUnreadCountChange === 'function') {
          onUnreadCountChange(totalUnreadCount);
        }

        if (!isFirstFetchRef.current && prevUnreadTotalRef.current !== -1 && totalUnreadCount > prevUnreadTotalRef.current) {
          playConfiguredWaSound();
        }
        prevUnreadTotalRef.current = totalUnreadCount;
        isFirstFetchRef.current = false;


        if (contactList.length > 0) {
          setSelectedChat(prevSelected => {
            const nextVal = (() => {
              if (prevSelected) {
                const current = contactList.find(c => c.phone === prevSelected.phone);
                return current || contactList[0];
              }
              return contactList[0];
            })();
            console.log("[POS WhatsApp Debug] Polled. prev:", prevSelected?.name, "-> next:", nextVal?.name);
            return nextVal;
          });
        }
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const headers = getHeaders();
      const res = await fetch(`${API_BASE}/api/whatsapp/templates`, { headers });
      if (res.ok) {
        const data = await res.json();
        setApprovedTemplates(data.map(t => {
          const variablesCount = (t.body.match(/\{\{\d+\}\}/g) || []).length;
          const placeholders = Array(variablesCount).fill("").map((_, i) => `Variable ${i+1}`);
          return {
            id: t.name,
            name: t.name,
            body: t.body,
            variablesCount,
            placeholders
          };
        }));
      }
    } catch (err) {
      console.error("Failed to fetch templates in chats", err);
    }
  };

  useEffect(() => {
    fetchChats();
    fetchTemplates();
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, []);

  // Mark selected chat as read
  useEffect(() => {
    if (selectedChat && selectedChat.unread > 0) {
      const markAsRead = async () => {
        try {
          const headers = getHeaders();
          await fetch(`${API_BASE}/api/whatsapp/mark-read`, {
            method: "POST",
            headers,
            body: JSON.stringify({ type: "chats", customerNumber: selectedChat.phone })
          });
          setChats(prev => {
            const updated = prev.map(c => c.phone === selectedChat.phone ? { ...c, unread: 0 } : c);
            const newTotal = updated.reduce((acc, c) => acc + (c.unread || 0), 0);
            if (typeof onUnreadCountChange === 'function') {
              onUnreadCountChange(newTotal);
            }
            return updated;
          });
          setSelectedChat(prev => prev && prev.phone === selectedChat.phone ? { ...prev, unread: 0 } : prev);
        } catch (e) {
          console.error("Failed to mark chat as read:", e);
        }
      };
      markAsRead();
    }
  }, [selectedChat]);

  // Scroll to bottom of message thread
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, selectedChat]);

  const handleSendMessage = async (textToSend = null) => {
    const text = textToSend || inputText;
    if (!text.trim() || !selectedChat) return;

    const headers = getHeaders();
    const tempMsg = {
      id: Date.now(),
      text: text,
      sender: "agent",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setChatMessages(prev => ({
      ...prev,
      [selectedChat.phone]: [...(prev[selectedChat.phone] || []), tempMsg]
    }));

    if (!textToSend) setInputText("");

    try {
      const res = await fetch(`${API_BASE}/api/whatsapp/chat/send`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          to: selectedChat.phone,
          text: text
        })
      });
      if (res.ok) {
        fetchChats();
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const toggleBotPause = async () => {
    if (!selectedChat) return;
    const nextStatus = !selectedChat.botPaused;

    try {
      const headers = getHeaders();
      const res = await fetch(`${API_BASE}/api/whatsapp/chat/pause`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          customerNumber: selectedChat.phone,
          pause: nextStatus
        })
      });
      if (res.ok) {
        setSelectedChat(prev => ({ ...prev, botPaused: nextStatus }));
        setChats(prev => prev.map(c => c.phone === selectedChat.phone ? { ...c, botPaused: nextStatus, botPauseUntil: nextStatus ? "Manual Takeover" : undefined } : c));
      }
    } catch (e) {
      console.error("Failed to toggle bot pause", e);
    }
  };

  const handleSelectTemplate = tpl => {
    setSelectedTemplate(tpl);
    setTemplateVariables(Array(tpl.variablesCount).fill(""));
  };

  const sendTemplateMessage = async () => {
    if (!selectedTemplate || !selectedChat) return;
    let finalBody = selectedTemplate.body;
    templateVariables.forEach((val, idx) => {
      finalBody = finalBody.replace(`{{${idx + 1}}}`, val || `[${selectedTemplate.placeholders[idx]}]`);
    });
    await handleSendMessage(finalBody);
    setIsTemplatePickerOpen(false);
    setSelectedTemplate(null);
    setTemplateVariables([]);
  };

  const filteredChats = chats.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.phone.includes(searchQuery) ||
                          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === "UNREAD") return matchesSearch && c.unread > 0;
    if (activeFilter === "BOT_PAUSED") return matchesSearch && c.botPaused;
    return matchesSearch;
  });

  return (
    <div className="h-full flex border-t border-slate-200 dark:border-[#30363d] overflow-hidden bg-white dark:bg-[#0d1117] text-slate-800 dark:text-[#c9d1d9]">
      {/* 1. Left Contact Column */}
      <div className="w-80 border-r border-slate-150 dark:border-[#30363d] flex flex-col bg-slate-50/50 dark:bg-white/5 shrink-0">
        <div className="p-4 border-b border-slate-100 dark:border-[#30363d] space-y-3 bg-white dark:bg-[#161b22]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-lg pl-9 pr-8 py-1.5 text-[11px] font-bold outline-none focus:border-emerald-500 text-slate-800 dark:text-white"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-2 hover:text-slate-650 text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0d1117] p-0.5 rounded-lg">
            {[
              { label: "All", value: "ALL" },
              { label: "Unread", value: "UNREAD" },
              { label: "Agent Lock", value: "BOT_PAUSED" }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`flex-1 text-center py-1 text-[9px] font-black uppercase rounded-md transition-all ${
                  activeFilter === tab.value
                    ? "bg-white dark:bg-[#161b22] text-slate-800 dark:text-white shadow-sm font-black"
                    : "text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-350"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-[#30363d] no-scrollbar">
          {filteredChats.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-35" />
              <p className="text-[10px] font-bold">No conversations found</p>
            </div>
          ) : (
            filteredChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`flex items-center gap-3 p-3.5 cursor-pointer transition-all ${
                  selectedChat?.phone === chat.phone
                    ? "bg-white dark:bg-[#161b22] shadow-sm border-l-4 border-emerald-500"
                    : "hover:bg-white/40 dark:hover:bg-white/5"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-center font-bold text-slate-700 dark:text-white text-[11px] shrink-0">
                  {chat.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[12px] font-bold text-slate-800 dark:text-white truncate">{chat.name}</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-400 font-bold">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10.5px] text-slate-500 dark:text-slate-450 truncate pr-2 font-medium">
                      {chat.lastMessage}
                    </p>
                    <div className="flex items-center gap-1 shrink-0">
                      {chat.botPaused && (
                        <span className="p-0.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded border border-rose-100 dark:border-rose-500/20" title="Agent Lock">
                          <Bot className="w-2.5 h-2.5" />
                        </span>
                      )}
                      {chat.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-red-600 shadow-md shadow-red-500/50 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. Chat Timeline Pane */}
      <div className="flex-1 flex flex-col relative min-w-0 bg-[#efeae2] dark:bg-[#0b141a]">
        {/* WhatsApp Background Wallpaper */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.06] dark:opacity-[0.03] z-0" style={{ 
          backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`,
          backgroundRepeat: 'repeat',
          backgroundAttachment: 'local'
        }} />

        {selectedChat ? (
          <>
            {/* Header */}
            <div className="h-14 px-6 border-b border-slate-150 dark:border-[#30363d] bg-white dark:bg-[#161b22] flex items-center justify-between z-10 shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8.5 h-8.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-center font-bold text-[11px] text-slate-700 dark:text-white">
                  {selectedChat.avatar}
                </div>
                <div>
                  <h3 className="text-[12.5px] font-bold text-slate-850 dark:text-white flex items-center gap-1.5">
                    {selectedChat.name}
                    <span className="text-[9px] text-slate-400 dark:text-slate-400 font-normal">({selectedChat.phone})</span>
                  </h3>
                  <div className="flex items-center mt-0.5">
                    {selectedChat.botPaused ? (
                      <span className="text-[8px] font-black uppercase text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 px-1 rounded flex items-center gap-0.5">
                        <User className="w-2.5 h-2.5" /> Agent Lock
                      </span>
                    ) : (
                      <span className="text-[8px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-1 rounded flex items-center gap-0.5 animate-pulse">
                        <Bot className="w-2.5 h-2.5" /> AI Autopilot
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleBotPause}
                  className={`px-3 py-1.5 rounded-lg border text-[9.5px] font-black uppercase tracking-wider flex items-center gap-1 transition-all ${
                    selectedChat.botPaused
                      ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400 hover:bg-rose-100"
                      : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 hover:bg-emerald-100"
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  {selectedChat.botPaused ? "Resume Bot" : "Lock Bot (Chat)"}
                </button>
                <button 
                  onClick={() => setIsInfoPanelOpen(!isInfoPanelOpen)}
                  className={`p-2 rounded-lg border transition-colors ${
                    isInfoPanelOpen ? "bg-slate-100 dark:bg-white/5 border-slate-350 text-slate-700 dark:text-white" : "bg-white dark:bg-[#161b22] text-slate-400 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <User className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Messages Timeline */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10 no-scrollbar">
              <div className="flex justify-center">
                <span className="px-3 py-1 bg-white/80 dark:bg-[#161b22]/80 backdrop-blur border border-slate-150 dark:border-[#30363d] rounded-full text-[9px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest">
                  Live Conversation Channel
                </span>
              </div>

              {(chatMessages[selectedChat.phone] || []).map((msg, idx) => {
                const isAgent = msg.sender === "agent" || msg.sender === "bot";
                return (
                  <div key={msg.id || idx} className={`flex ${isAgent ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[70%] space-y-0.5">
                      <div className={`p-3 rounded-lg shadow-sm border text-[11.5px] leading-relaxed ${
                        msg.sender === "agent"
                          ? "bg-emerald-600 dark:bg-emerald-700 border-emerald-600 dark:border-emerald-700 text-white rounded-tr-none rounded-br-lg"
                          : msg.sender === "bot"
                          ? "bg-indigo-600 dark:bg-indigo-700 border-indigo-600 dark:border-indigo-700 text-white rounded-tr-none rounded-br-lg"
                          : "bg-white dark:bg-[#161b22] border-slate-200 dark:border-[#30363d] text-slate-750 dark:text-white rounded-tl-none rounded-bl-lg"
                      }`}>
                        {msg.sender === "bot" && (
                          <div className="text-[7.5px] font-black uppercase tracking-wider text-indigo-200 mb-1 flex items-center gap-0.5">
                            <Bot className="w-2.5 h-2.5" /> AI autopilot response
                          </div>
                        )}
                        <div className={`whitespace-pre-wrap ${isAgent ? "text-white" : "text-slate-800 dark:text-white"}`}>{msg.text}</div>
                      </div>
                      <div className={`flex items-center gap-1.5 px-1 ${isAgent ? "justify-end" : "justify-start"}`}>
                        <span className="text-[8px] text-slate-400 dark:text-slate-400 font-bold">{msg.time}</span>
                        {isAgent && (
                          <CheckCheck className={`w-3.5 h-3.5 ${msg.sender === "bot" ? "text-indigo-400" : "text-emerald-500"}`} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Inputs wrapper */}
            <div className="p-3 bg-white dark:bg-[#161b22] border-t border-slate-150 dark:border-[#30363d] space-y-2 shrink-0 z-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTemplatePickerOpen(true)}
                  className="px-2.5 py-1.5 bg-slate-100 dark:bg-[#0d1117] hover:bg-slate-200 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 rounded-lg text-[9.5px] font-black uppercase tracking-wider flex items-center gap-1 transition-all border border-slate-200 dark:border-[#30363d]"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" /> Send Template
                </button>
                {selectedChat.botPaused && (
                  <span className="text-[8px] font-bold text-rose-500 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Manual Chat override is active. Bot autopilot paused.
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-emerald-500 text-slate-800 dark:text-white"
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-400 relative z-10">
            <MessageSquare className="w-12 h-12 opacity-35 mb-2" />
            <h4 className="font-bold text-slate-700 dark:text-white">No Chat Selected</h4>
            <p className="text-[10px] font-bold">Please select a conversation thread to start messaging</p>
          </div>
        )}
      </div>

      {/* 3. Detail Pane (Right Column) */}
      {selectedChat && isInfoPanelOpen && (
        <div className="w-64 border-l border-slate-150 dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 flex flex-col gap-4 overflow-y-auto shrink-0 no-scrollbar select-none z-10">
          <div className="text-center pb-3 border-b border-slate-100 dark:border-[#30363d]">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-center font-black text-slate-800 dark:text-white text-[14px] mx-auto mb-2">
              {selectedChat.avatar}
            </div>
            <h4 className="font-black text-slate-800 dark:text-white text-[13px]">{selectedChat.name}</h4>
            <span className="text-[9.5px] font-mono text-slate-400 dark:text-slate-400 font-bold">{selectedChat.phone}</span>
          </div>

          <div className="space-y-3">
            <span className="text-[8px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-widest block">CRM Context</span>
            <div className="space-y-2 text-[10px] font-medium text-slate-600 dark:text-[#c9d1d9]">
              <div>
                <span className="text-slate-400 dark:text-slate-400 block text-[8px] font-bold uppercase">Email Account</span>
                <span className="font-bold text-slate-850 dark:text-white">{selectedChat.email || "Not Configured"}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-400 block text-[8px] font-bold uppercase">Location Node</span>
                <span className="font-bold text-slate-850 dark:text-white">{selectedChat.location || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-400 block text-[8px] font-bold uppercase">Tags</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedChat.tags.map(t => (
                    <span key={t} className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-100 dark:border-emerald-500/20 text-[8px] uppercase">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-100 dark:border-[#30363d] pt-3 flex-1">
            <span className="text-[8px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-widest block">Autopilot logs</span>
            <div className="bg-slate-50 dark:bg-[#0d1117] border border-slate-150 dark:border-[#30363d] rounded-lg p-2.5 space-y-2 text-[10px]">
              <div className="flex justify-between font-bold">
                <span className="text-slate-450">Bot Integration:</span>
                <span className={selectedChat.botPaused ? "text-rose-500" : "text-emerald-600"}>
                  {selectedChat.botPaused ? "PAUSED (Manual)" : "AUTO ACTIVE"}
                </span>
              </div>
              {selectedChat.botPaused && (
                <div className="text-[9px] text-slate-400 dark:text-slate-400 border-t border-slate-200/50 dark:border-white/5 pt-1.5">
                  Direct Chat Lock is active. Automated replies are suspended until bot responder is resumed.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Template picker modal */}
      {isTemplatePickerOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
            <div className="border-b border-slate-150 dark:border-[#30363d] px-4 py-3 flex items-center justify-between bg-slate-50 dark:bg-white/5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span className="text-[11px] font-black uppercase text-slate-805 dark:text-white tracking-wider">Send WhatsApp Template</span>
              </div>
              <button onClick={() => { setIsTemplatePickerOpen(false); setSelectedTemplate(null); }} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar text-slate-805 dark:text-[#c9d1d9]">
              {!selectedTemplate ? (
                <div className="space-y-2">
                  <label className="block text-[9px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-wider">Select approved template</label>
                  {approvedTemplates.length === 0 ? (
                    <div className="p-8 border border-dashed rounded-xl text-center text-slate-450 dark:text-slate-400">
                      <FileText className="w-8 h-8 text-slate-200 mx-auto mb-2 opacity-55" />
                      No templates found. Go to Back-office to create WhatsApp Templates.
                    </div>
                  ) : (
                    approvedTemplates.map(tpl => (
                      <div
                        key={tpl.id}
                        onClick={() => handleSelectTemplate(tpl)}
                        className="p-3 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-xl hover:border-emerald-500 dark:hover:border-emerald-600 cursor-pointer transition-all"
                      >
                        <div className="font-bold text-[11px] text-slate-800 dark:text-white">{tpl.name}</div>
                        <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-1 line-clamp-2 leading-snug">{tpl.body}</p>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="text-[9px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:hover:text-white"
                  >
                    &larr; Back to list
                  </button>
                  <div className="bg-slate-50 dark:bg-[#0d1117] border border-slate-100 dark:border-[#30363d] rounded-xl p-3">
                    <span className="text-[8px] font-black uppercase text-slate-400 dark:text-slate-400 block mb-1">Body Template Model</span>
                    <p className="text-[11px] text-slate-650 dark:text-[#c9d1d9] leading-relaxed font-mono whitespace-pre-wrap">{selectedTemplate.body}</p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase text-slate-600 dark:text-[#c9d1d9] tracking-wider block">Bind Dynamic Variables</span>
                    {templateVariables.map((val, vIdx) => (
                      <div key={vIdx} className="space-y-1">
                        <label className="block text-[8px] font-black text-slate-400 dark:text-slate-400 uppercase">
                          Variable {`{{${vIdx + 1}}}`} ({selectedTemplate.placeholders[vIdx]})
                        </label>
                        <input
                          type="text"
                          placeholder={`Value for ${selectedTemplate.placeholders[vIdx]}`}
                          value={val}
                          onChange={e => {
                            const updated = [...templateVariables];
                            updated[vIdx] = e.target.value;
                            setTemplateVariables(updated);
                          }}
                          className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:border-emerald-500 text-slate-800 dark:text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-150 dark:border-[#30363d] p-3 bg-slate-50 dark:bg-white/5 flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => { setIsTemplatePickerOpen(false); setSelectedTemplate(null); }}
                className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] text-slate-600 dark:text-slate-350 px-4 py-2 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-50 dark:hover:bg-[#30363d] transition-all"
              >
                Cancel
              </button>
              <button
                disabled={!selectedTemplate}
                onClick={sendTemplateMessage}
                className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  selectedTemplate
                    ? "bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer"
                    : "bg-slate-200 dark:bg-white/5 text-slate-400 dark:text-slate-600 cursor-not-allowed border dark:border-white/5"
                }`}
              >
                Send Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppMarketing;
