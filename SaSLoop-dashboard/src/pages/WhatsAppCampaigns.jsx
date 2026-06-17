import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  MessageSquare, Search, RefreshCw, Filter, 
  Plus, Target, Layers, CheckCircle2, 
  Clock, Database, Globe, Share2,
  BarChart3, UserCheck, Edit3, Trash2,
  TrendingUp, Download, ChevronRight, X,
  Calendar, Check, AlertCircle, Eye, Sliders, Play, Pause
} from "lucide-react";
import API_BASE from "../config";

const WhatsAppCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");
  const [toast, setToast] = useState(null);

  // Modal State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1); // Steps 1 to 4
  const [groupCounts, setGroupCounts] = useState({
    all: 0,
    vip: 0,
    inactive: 0,
    leads: 0
  });
  
  // Wizard Form State
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    templateId: "",
    audienceSource: "GROUP", // GROUP, CSV
    selectedGroup: "ALL_CRM", // ALL_CRM, VIP, INACTIVE, LEADS
    csvFileName: "",
    scheduleType: "IMMEDIATE", // IMMEDIATE, SCHEDULED
    scheduledDate: "",
    scheduledTime: "",
    delayInterval: "2", // Delay in seconds to prevent spam blocking
    deliveryType: "TEMPLATE", // TEMPLATE, TEXT
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Dynamic Groups for selection based on actual database counts
  const customerGroups = [
    { id: "ALL_CRM", name: `All Customers (${groupCounts.all} Contacts)` },
    { id: "VIP", name: `VIP Loyalists (${groupCounts.vip} Contacts)` },
    { id: "INACTIVE", name: `Dormant (3+ months) (${groupCounts.inactive} Contacts)` },
    { id: "ACTIVE", name: `Active Chats (Last 24 Hours) (${groupCounts.active || 0} Contacts)` },
    { id: "LEADS", name: `New Table Enquiries (${groupCounts.leads} Contacts)` }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const [tplRes, cmpRes, contactsRes, segmentsRes] = await Promise.all([
        fetch(`${API_BASE}/api/whatsapp/templates`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/whatsapp/campaigns`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/crm/marketing-contacts`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/crm/segments`, { headers: { "Authorization": `Bearer ${token}` } })
      ]);

      if (tplRes.ok) {
        const tplData = await tplRes.json();
        if (tplData && tplData.length > 0) {
          setTemplates(tplData.map(t => ({
            id: t.name,
            name: t.name,
            body: t.body,
            type: t.category
          })));
        } else {
          setTemplates([]);
        }
      } else {
        throw new Error("Bad template response");
      }

      if (cmpRes.ok) {
        const cmpData = await cmpRes.json();
        if (cmpData && cmpData.length > 0) {
          setCampaigns(cmpData);
        } else {
          setCampaigns([]);
        }
      } else {
        throw new Error("Bad campaign response");
      }

      let mcCount = 0;
      if (contactsRes && contactsRes.ok) {
        const mcData = await contactsRes.json();
        mcCount = mcData.length;
      }

      let vipCount = 0;
      let inactiveCount = 0;
      let activeCount = 0;
      if (segmentsRes && segmentsRes.ok) {
        const segData = await segmentsRes.json();
        vipCount = parseInt(segData.vip_count || 0);
        inactiveCount = parseInt(segData.at_risk_count || 0);
        activeCount = parseInt(segData.active_chat_count || 0);
      }

      setGroupCounts({
        all: mcCount,
        vip: vipCount,
        inactive: inactiveCount,
        active: activeCount,
        leads: 0
      });
    } catch (err) {
      console.error("Failed to load templates or campaigns:", err);
      setTemplates([]);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCampaignSubmit = async () => {
    if (!newCampaign.name || !newCampaign.templateId) {
      alert("Please check campaign name and template selection");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/whatsapp/campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
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
        
        // Reset Form
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
        const errData = await res.json();
        showToast(errData.error || "Failed to create campaign.", "error");
      }
    } catch (err) {
      console.error("Error creating campaign:", err);
      showToast("Failed to connect to backend service.", "error");
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (window.confirm("Are you sure you want to stop/delete this campaign and wipe its historical log?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/whatsapp/campaigns/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          setCampaigns(campaigns.filter(c => c.id !== id));
          showToast("Campaign terminated and deleted.", "error");
        } else {
          showToast("Failed to delete campaign.", "error");
        }
      } catch (err) {
        showToast("Error connecting to campaign service.", "error");
      }
    }
  };

  const handlePauseResume = (id) => {
    setCampaigns(campaigns.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === "IN_PROGRESS" ? "DRAFT" : "IN_PROGRESS";
        showToast(`Campaign ${nextStatus === "IN_PROGRESS" ? "resumed" : "paused"}.`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // Filter logic
  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.templateName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatusFilter === "ALL" || c.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Analytics Metrics summaries
  const telemetry = {
    totalSent: campaigns.reduce((acc, c) => acc + c.sent, 0),
    totalDelivered: campaigns.reduce((acc, c) => acc + c.delivered, 0),
    totalRead: campaigns.reduce((acc, c) => acc + c.read, 0),
    totalFailed: campaigns.reduce((acc, c) => acc + c.failed, 0),
    count: campaigns.length,
    inProgress: campaigns.filter(c => c.status === "IN_PROGRESS").length,
    scheduled: campaigns.filter(c => c.status === "SCHEDULED").length,
  };

  // Delivery rate calculators
  const getDeliveryRate = (c) => {
    if (c.sent === 0) return 0;
    return Math.round((c.delivered / c.sent) * 100);
  };
  const getReadRate = (c) => {
    if (c.delivered === 0) return 0;
    return Math.round((c.read / c.delivered) * 100);
  };

  return (
    <div className="space-y-4 animate-pro-in pb-10">
      
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border text-white transition-all transform animate-bounce ${
          toast.type === "success" ? "bg-emerald-600 border-emerald-500" : "bg-rose-600 border-rose-500"
        }`}>
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5 text-white" /> : <AlertCircle className="w-5 h-5 text-white" />}
          <span className="text-[12px] font-bold tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Header section with Stats Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-500" />
            WhatsApp Campaigns
          </h2>
          <p className="text-[11px] text-slate-500">Design, execute and monitor bulk marketing messages and automated client updates.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="pro-btn-secondary h-9 px-4 font-bold flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300">
            <Download className="w-3.5 h-3.5" /> Export Logs
          </button>
          <button 
            onClick={() => {
              const defaultName = `Campaign ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
              setNewCampaign(prev => ({ ...prev, name: defaultName }));
              setIsWizardOpen(true);
            }} 
            className="pro-btn-primary h-9 px-4 font-black flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-sm text-[11px] uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" /> Create Campaign
          </button>
        </div>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
          <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Messages Sent</p>
          <h3 className="text-xl font-black text-slate-800 mt-1">{telemetry.totalSent.toLocaleString()}</h3>
          <span className="text-[9px] text-emerald-600 font-bold">100% processing rate</span>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
          <p className="text-[9px] font-black uppercase text-emerald-500 tracking-wider">Delivered</p>
          <h3 className="text-xl font-black text-emerald-600 mt-1">{telemetry.totalDelivered.toLocaleString()}</h3>
          <span className="text-[9px] text-slate-400 font-medium">
            {telemetry.totalSent > 0 ? Math.round((telemetry.totalDelivered / telemetry.totalSent) * 100) : 0}% Delivery Rate
          </span>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
          <p className="text-[9px] font-black uppercase text-blue-500 tracking-wider">Read (Open)</p>
          <h3 className="text-xl font-black text-blue-600 mt-1">{telemetry.totalRead.toLocaleString()}</h3>
          <span className="text-[9px] text-slate-400 font-medium">
            {telemetry.totalDelivered > 0 ? Math.round((telemetry.totalRead / telemetry.totalDelivered) * 100) : 0}% Read Rate
          </span>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
          <p className="text-[9px] font-black uppercase text-rose-500 tracking-wider">Failed</p>
          <h3 className="text-xl font-black text-rose-600 mt-1">{telemetry.totalFailed.toLocaleString()}</h3>
          <span className="text-[9px] text-rose-500 font-bold">
            {telemetry.totalSent > 0 ? ((telemetry.totalFailed / telemetry.totalSent) * 100).toFixed(1) : 0}% Error Rate
          </span>
        </div>
      </div>

      {/* Toolbar Filter */}
      <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-full md:max-w-xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search campaigns..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-[11px] font-medium outline-none w-full text-slate-700" 
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {[
            { label: "All Campaigns", value: "ALL" },
            { label: "Completed", value: "COMPLETED" },
            { label: "In Progress", value: "IN_PROGRESS" },
            { label: "Scheduled", value: "SCHEDULED" }
          ].map(tab => (
            <button 
              key={tab.value} 
              onClick={() => setSelectedStatusFilter(tab.value)}
              className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${
                selectedStatusFilter === tab.value 
                  ? 'bg-white shadow-sm text-slate-900' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Listing Container */}
      <div className="bg-white border border-slate-150 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Campaign Registries</span>
          <span className="text-[9px] text-slate-400 font-bold">{filteredCampaigns.length} campaigns matching</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="px-4 py-3">Campaign Details</th>
                <th className="px-4 py-3">Template</th>
                <th className="px-4 py-3 text-center">Audience</th>
                <th className="px-4 py-3">Progress / Telemetry</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3">Launch / Scheduled</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400 font-medium">
                    <Database className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                    No campaigns match the filters.
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-800">{c.name}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">ID: {c.id}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-slate-500 font-bold bg-slate-50 border px-1.5 py-0.5 rounded text-[10px]">
                        {c.templateName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-slate-700">
                      {c.audienceSize}
                    </td>
                    <td className="px-4 py-3 min-w-[180px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                          <span>Delivered: {getDeliveryRate(c)}%</span>
                          <span>Read: {getReadRate(c)}%</span>
                        </div>
                        {/* Progress bars */}
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                          <div className="bg-emerald-500 h-full" style={{ width: `${getDeliveryRate(c)}%` }}></div>
                          <div className="bg-blue-400 h-full" style={{ width: `${c.sent > 0 ? (c.read / c.sent) * 100 : 0}%` }}></div>
                        </div>
                        <div className="flex justify-between text-[8px] text-slate-400 font-medium">
                          <span>Sent: {c.sent}</span>
                          <span>Read: {c.read}</span>
                          <span className="text-rose-500">Fail: {c.failed}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                        c.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        c.status === "IN_PROGRESS" ? "bg-blue-50 text-blue-600 border-blue-100 animate-pulse" :
                        c.status === "SCHEDULED" ? "bg-amber-50 text-amber-600 border-amber-100" :
                        "bg-slate-50 text-slate-500 border-slate-100"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-350" />
                        <span>{c.date}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {c.status === "IN_PROGRESS" && (
                          <button 
                            onClick={() => handlePauseResume(c.id)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-600"
                            title="Pause Campaign"
                          >
                            <Pause className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {c.status === "DRAFT" && (
                          <button 
                            onClick={() => handlePauseResume(c.id)}
                            className="p-1 hover:bg-slate-100 rounded text-emerald-600"
                            title="Resume Campaign"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteCampaign(c.id)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-rose-600"
                          title="Delete Campaign"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MULTI-STEP CREATION WIZARD MODAL */}
      {isWizardOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-[13px] font-black uppercase text-slate-800 tracking-wider">New WhatsApp Broadcast Campaign</h3>
                <p className="text-[10px] text-slate-500">Reach custom lists via pre-approved template pipelines.</p>
              </div>
              <button onClick={() => setIsWizardOpen(false)} className="text-slate-400 hover:text-slate-650">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps Progress bar indicator */}
            <div className="px-6 py-3 bg-slate-100/50 border-b border-slate-100 flex items-center justify-between text-[9px] font-black uppercase text-slate-400">
              {[
                { step: 1, label: "Template" },
                { step: 2, label: "Audience" },
                { step: 3, label: "Schedule" },
                { step: 4, label: "Review" }
              ].map(s => (
                <div key={s.step} className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono ${
                    wizardStep === s.step ? "bg-emerald-600 text-white" :
                    wizardStep > s.step ? "bg-emerald-100 text-emerald-800" :
                    "bg-slate-200 text-slate-500"
                  }`}>
                    {wizardStep > s.step ? <Check className="w-3 h-3" /> : s.step}
                  </span>
                  <span className={wizardStep === s.step ? "text-slate-800 font-bold" : ""}>{s.label}</span>
                  {s.step < 4 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
                </div>
              ))}
            </div>

            {/* Wizard Body content */}
            <div className="p-6 flex-1 overflow-y-auto min-h-[300px]">
              
              {/* STEP 1: Campaign details & Template Selection */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">Campaign Reference Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. June Weekend Discount Blast" 
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[12px] font-medium outline-none focus:border-emerald-500 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">Select Message Template</label>
                    <div className="space-y-2">
                      {templates.map(tpl => (
                        <label 
                          key={tpl.id} 
                          onClick={() => setNewCampaign({ ...newCampaign, templateId: tpl.id })}
                          className={`block p-3 rounded-lg border cursor-pointer transition-all ${
                            newCampaign.templateId === tpl.id 
                              ? "border-emerald-500 bg-emerald-50/20 shadow-sm" 
                              : "border-slate-200 hover:bg-slate-50"
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
                              <span className="text-[12px] font-bold text-slate-700">{tpl.name}</span>
                            </div>
                            <span className="px-1.5 py-0.5 rounded text-[8px] bg-slate-100 text-slate-500 font-black uppercase">
                              {tpl.type}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 font-mono leading-tight truncate">{tpl.body}</p>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Audience targets selection */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">Audience Source</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setNewCampaign({ ...newCampaign, audienceSource: "GROUP" })}
                        className={`p-3 rounded-lg border text-center font-bold text-[11px] flex flex-col items-center gap-1 ${
                          newCampaign.audienceSource === "GROUP"
                            ? "border-emerald-500 bg-emerald-50/20 text-emerald-800"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Layers className="w-5 h-5 text-slate-450" />
                        CRM Contact Groups
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewCampaign({ ...newCampaign, audienceSource: "CSV" })}
                        className={`p-3 rounded-lg border text-center font-bold text-[11px] flex flex-col items-center gap-1 ${
                          newCampaign.audienceSource === "CSV"
                            ? "border-emerald-500 bg-emerald-50/20 text-emerald-800"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Database className="w-5 h-5 text-slate-450" />
                        Upload CSV List
                      </button>
                    </div>
                  </div>

                  {newCampaign.audienceSource === "GROUP" ? (
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">Select Group Segment</label>
                      <select
                        value={newCampaign.selectedGroup}
                        onChange={(e) => setNewCampaign({ ...newCampaign, selectedGroup: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        {customerGroups.map(g => (
                          <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">Upload CSV File</label>
                      <div className="border-2 border-dashed border-slate-250 hover:bg-slate-55/20 rounded-xl p-6 text-center cursor-pointer transition-colors">
                        <Database className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <span className="text-[11px] text-slate-650 font-bold block">Click to select files or drag here</span>
                        <span className="text-[9px] text-slate-400 block mt-1">Accepts .csv formatting with 'phone' and 'name' columns</span>
                        {newCampaign.csvFileName && (
                          <div className="mt-3 px-3 py-1 bg-emerald-55 text-emerald-800 border rounded-lg text-[10px] font-bold">
                            {newCampaign.csvFileName}
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept=".csv" 
                          onChange={(e) => setNewCampaign({ ...newCampaign, csvFileName: e.target.files[0]?.name || "" })}
                          className="hidden" 
                          id="csv_uploader"
                        />
                        <button 
                          type="button" 
                          onClick={() => document.getElementById('csv_uploader').click()}
                          className="mt-3 px-3 py-1.5 bg-white border border-slate-350 text-slate-700 hover:bg-slate-50 rounded text-[9.5px] font-bold"
                        >
                          Choose File
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Delivery schedule & Throttling speed */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">Temporal Execution</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setNewCampaign({ ...newCampaign, scheduleType: "IMMEDIATE" })}
                        className={`p-3 rounded-lg border text-center font-bold text-[11px] flex flex-col items-center gap-1 ${
                          newCampaign.scheduleType === "IMMEDIATE"
                            ? "border-emerald-500 bg-emerald-50/20 text-emerald-800"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Play className="w-5 h-5" />
                        Send Immediately
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewCampaign({ ...newCampaign, scheduleType: "SCHEDULED" })}
                        className={`p-3 rounded-lg border text-center font-bold text-[11px] flex flex-col items-center gap-1 ${
                          newCampaign.scheduleType === "SCHEDULED"
                            ? "border-emerald-500 bg-emerald-50/20 text-emerald-800"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Calendar className="w-5 h-5" />
                        Schedule for Later
                      </button>
                    </div>
                  </div>

                  {newCampaign.scheduleType === "SCHEDULED" && (
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 border border-slate-100 rounded-xl">
                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1">Target Date</label>
                        <input 
                          type="date" 
                          value={newCampaign.scheduledDate}
                          onChange={(e) => setNewCampaign({ ...newCampaign, scheduledDate: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] font-bold outline-none text-slate-750"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1">Target Time</label>
                        <input 
                          type="time" 
                          value={newCampaign.scheduledTime}
                          onChange={(e) => setNewCampaign({ ...newCampaign, scheduledTime: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] font-bold outline-none text-slate-750"
                        />
                      </div>
                    </div>
                  )}

                  {/* Delivery Options */}
                  <div className="bg-slate-50 p-3 border border-slate-100 rounded-xl space-y-2">
                    <label className="block text-[10px] font-black uppercase text-slate-650 tracking-wider flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> Delivery Options
                    </label>
                    <p className="text-[9px] text-slate-400 leading-tight">Choose how you want to dispatch this message. Plain-text mode bypasses template setup fees and rules, but only delivers to contacts with an open 24h chat.</p>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setNewCampaign({ ...newCampaign, deliveryType: "TEMPLATE" })}
                        className={`py-1.5 px-3 rounded-lg border text-center font-bold text-[10px] ${
                          newCampaign.deliveryType === "TEMPLATE"
                            ? "border-emerald-500 bg-emerald-50/20 text-emerald-800"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        Native Template
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewCampaign({ ...newCampaign, deliveryType: "TEXT" })}
                        className={`py-1.5 px-3 rounded-lg border text-center font-bold text-[10px] ${
                          newCampaign.deliveryType === "TEXT"
                            ? "border-emerald-500 bg-emerald-50/20 text-emerald-800"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        Plain Text Bypass
                      </button>
                    </div>
                  </div>

                  {/* Safety Throttling */}
                  <div className="bg-slate-50 p-3 border border-slate-100 rounded-xl space-y-2">
                    <label className="block text-[10px] font-black uppercase text-slate-655 tracking-wider flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5 text-emerald-500" /> Throttling Configuration
                    </label>
                    <p className="text-[9px] text-slate-400 leading-tight">Introduce a sequential delay interval between dispatch packets. Helps protect your WhatsApp Business number rating.</p>
                    <div className="flex items-center gap-2">
                      <select
                        value={newCampaign.delayInterval}
                        onChange={(e) => setNewCampaign({ ...newCampaign, delayInterval: e.target.value })}
                        className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="1">1 second delay</option>
                        <option value="2">2 seconds delay (Recommended)</option>
                        <option value="5">5 seconds delay (Safer)</option>
                        <option value="10">10 seconds delay (High Volume)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Review campaign configurations */}
              {wizardStep === 4 && (
                <div className="space-y-4">
                  <div className="bg-emerald-50/20 border border-emerald-100 rounded-xl p-4 space-y-3 text-slate-800">
                    <div className="flex items-center gap-2 border-b border-emerald-100/50 pb-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="text-[12px] font-bold text-slate-800">Campaign Manifest Summary</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-[11px]">
                      <div>
                        <span className="text-slate-400 font-bold uppercase block text-[8px]">Campaign Name</span>
                        <span className="font-bold text-slate-800">{newCampaign.name || "Untitled Campaign"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold uppercase block text-[8px]">Template Selected</span>
                        <span className="font-bold text-slate-800 font-mono">{newCampaign.templateId || "Not Selected"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold uppercase block text-[8px]">Target Audience</span>
                        <span className="font-bold text-slate-800">
                          {newCampaign.audienceSource === "CSV" 
                            ? `CSV List (${newCampaign.csvFileName})` 
                            : customerGroups.find(g => g.id === newCampaign.selectedGroup)?.name}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold uppercase block text-[8px]">Dispatch Strategy</span>
                        <span className="font-bold text-slate-800">
                          {newCampaign.scheduleType === "IMMEDIATE" ? "Immediate Launch" : `Scheduled: ${newCampaign.scheduledDate} @ ${newCampaign.scheduledTime}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border rounded-xl p-3 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Database className="w-4 h-4 text-emerald-600" />
                      <span>Estimated Credits Required:</span>
                    </div>
                    <span className="font-mono font-bold text-slate-800">
                      {newCampaign.audienceSource === "CSV" 
                        ? "Custom CSV List" 
                        : `${
                            newCampaign.selectedGroup === "VIP" ? groupCounts.vip :
                            newCampaign.selectedGroup === "INACTIVE" ? groupCounts.inactive :
                            newCampaign.selectedGroup === "LEADS" ? groupCounts.leads :
                            groupCounts.all
                          } Messages`
                      } (~${(
                        (newCampaign.audienceSource === "CSV" 
                          ? 0 
                          : (
                            newCampaign.selectedGroup === "VIP" ? groupCounts.vip :
                            newCampaign.selectedGroup === "INACTIVE" ? groupCounts.inactive :
                            newCampaign.selectedGroup === "LEADS" ? groupCounts.leads :
                            groupCounts.all
                          )
                        ) * 0.05
                      ).toFixed(2)} Credit units)
                    </span>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Controls */}
            <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
              <button
                type="button"
                disabled={wizardStep === 1}
                onClick={() => setWizardStep(wizardStep - 1)}
                className={`pro-btn-secondary h-8 px-4 font-bold text-[10px] ${
                  wizardStep === 1 ? "opacity-30 cursor-not-allowed" : ""
                }`}
              >
                Back
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsWizardOpen(false)}
                  className="pro-btn-secondary h-8 px-4 font-bold text-[10px] text-slate-650"
                >
                  Cancel
                </button>
                {wizardStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (wizardStep === 1) {
                        if (!newCampaign.name || !newCampaign.name.trim()) {
                          alert("Please enter a campaign reference name first.");
                          return;
                        }
                        if (!newCampaign.templateId) {
                          alert("Please select a message template first.");
                          return;
                        }
                      }
                      setWizardStep(wizardStep + 1);
                    }}
                    className="pro-btn-primary h-8 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-black text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCreateCampaignSubmit}
                    className="pro-btn-primary h-8 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-black text-[10px] uppercase tracking-wider shadow-sm"
                  >
                    Execute Campaign
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default WhatsAppCampaigns;
