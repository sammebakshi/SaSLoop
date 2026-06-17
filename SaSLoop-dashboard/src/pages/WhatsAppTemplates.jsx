import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  Plus, Search, RefreshCw, Filter, 
  Send, CheckCircle2, AlertCircle, 
  ChevronDown, MoreHorizontal, X, 
  Eye, Trash2, Globe, FileText, 
  Image, Video, MessageSquare, 
  Phone, ExternalLink, Sparkles, Check, HelpCircle, Upload
} from "lucide-react";
import API_BASE from "../config";

const WhatsAppTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL"); // ALL, APPROVED, PENDING, REJECTED
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL"); // ALL, MARKETING, UTILITY, AUTHENTICATION
  
  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [activePreviewTemplate, setActivePreviewTemplate] = useState(null);
  
  // Toast notifications
  const [toast, setToast] = useState(null);

  // New Template form state
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    category: "MARKETING",
    language: "en",
    headerType: "NONE", // NONE, TEXT, IMAGE, DOCUMENT
    headerText: "",
    bodyText: "",
    footerText: "",
    buttons: [] // { type: 'QUICK_REPLY' | 'PHONE' | 'URL', text: '', value: '' }
  });

  const [variablesList, setVariablesList] = useState([]); // Array of strings representing variable fallbacks

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/whatsapp/templates`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTemplates(data || []);
      }
    } catch (e) {
      console.error("Templates fetch failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSyncTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/whatsapp/templates/sync-from-meta`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (res.ok) {
        setTemplates(data || []);
        showToast("Successfully synced message templates from Meta Business Suite.");
      } else {
        showToast(data.error || "Failed to sync templates from Meta.", "error");
      }
    } catch (e) {
      console.error("Templates sync failed", e);
      showToast("Failed to connect to server.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (window.confirm("Are you sure you want to delete this template from WhatsApp Business? This action cannot be undone.")) {
      try {
        const res = await fetch(`${API_BASE}/api/whatsapp/templates/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
          setTemplates(templates.filter(t => t.id !== id));
          showToast("Template deleted successfully.", "error");
        }
      } catch (err) {
        showToast("Failed to delete template.", "error");
      }
    }
  };

  // Sync a PENDING template to Meta for approval
  const handleSyncToMeta = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/whatsapp/templates/${id}/sync-to-meta`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (res.ok) {
        setTemplates(prev => prev.map(t => t.id === id ? { ...t, status: 'APPROVED' } : t));
        showToast("Template submitted to Meta successfully! Status: APPROVED");
      } else {
        showToast(data.error || "Failed to sync template to Meta.", "error");
      }
    } catch (err) {
      console.error("Sync to Meta failed:", err);
      showToast("Failed to connect to server.", "error");
    }
  };

  // Helper to add variable to bodyText
  const addVariableToBody = () => {
    const varCount = (newTemplate.bodyText.match(/\{\{\d+\}\}/g) || []).length + 1;
    setNewTemplate(prev => ({
      ...prev,
      bodyText: prev.bodyText + ` {{${varCount}}}`
    }));
    setVariablesList(prev => [...prev, ""]);
  };

  // Helper to handle adding buttons in modal
  const addButton = (type) => {
    if (newTemplate.buttons.length >= 3) {
      alert("You can add up to 3 buttons only.");
      return;
    }
    const btnData = {
      type,
      text: type === "QUICK_REPLY" ? "Quick Reply Button" : type === "PHONE" ? "Call Us" : "Visit Website",
      value: type === "QUICK_REPLY" ? "REPLY_PAYLOAD" : type === "PHONE" ? "+91" : "https://"
    };
    setNewTemplate(prev => ({
      ...prev,
      buttons: [...prev.buttons, btnData]
    }));
  };

  const removeButton = (index) => {
    setNewTemplate(prev => ({
      ...prev,
      buttons: prev.buttons.filter((_, i) => i !== index)
    }));
  };

  const handleButtonChange = (index, field, value) => {
    const updated = [...newTemplate.buttons];
    updated[index][field] = value;
    setNewTemplate(prev => ({
      ...prev,
      buttons: updated
    }));
  };

  // Create Template form submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newTemplate.name) {
      alert("Please enter a template name");
      return;
    }
    if (!newTemplate.bodyText) {
      alert("Please enter template body content");
      return;
    }

    // Standardize template name: lower case, underscores only
    const sanitizedName = newTemplate.name.toLowerCase().replace(/[^a-z0-9_]/g, "_");

    try {
      const res = await fetch(`${API_BASE}/api/whatsapp/templates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          name: sanitizedName,
          category: newTemplate.category,
          language: newTemplate.language,
          headerType: newTemplate.headerType,
          headerText: newTemplate.headerText,
          bodyText: newTemplate.bodyText,
          footerText: newTemplate.footerText,
          buttons: newTemplate.buttons
        })
      });

      if (res.ok) {
        const created = await res.json();
        setTemplates([created, ...templates.filter(t => t.name !== sanitizedName)]);
        setIsCreateModalOpen(false);
        const statusMsg = created.status === 'APPROVED' 
          ? `Template "${sanitizedName}" created and synced with Meta!` 
          : `Template "${sanitizedName}" saved locally. Click "Sync to Meta" to register it.`;
        showToast(statusMsg, created.status === 'APPROVED' ? undefined : 'warning');
        
        // Reset form
        setNewTemplate({
          name: "",
          category: "MARKETING",
          language: "en",
          headerType: "NONE",
          headerText: "",
          bodyText: "",
          footerText: "",
          buttons: []
        });
      } else {
        const errData = await res.json();
        showToast(errData.error || "Failed to create template.", "error");
      }
    } catch (err) {
      console.error("Error creating template:", err);
      showToast("Failed to connect to template service.", "error");
    }
  };

  // Preview helper
  const openPreview = (tpl) => {
    setActivePreviewTemplate(tpl);
    setIsPreviewModalOpen(true);
  };

  // Render template body with highlight variables
  const formatBodyPreview = (text) => {
    if (!text) return "Enter body text...";
    // Replace {{1}}, {{2}}... with highlighted tags
    return text.split(/(\{\{\d+\}\})/).map((part, index) => {
      if (part.match(/\{\{\d+\}\}/)) {
        return (
          <span key={index} className="px-1.5 py-0.5 mx-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-bold text-[10px]">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Filtering Logic
  const filteredTemplates = templates.filter(tpl => {
    const matchesSearch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tpl.body.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === "ALL" || tpl.status === selectedStatus;
    const matchesCategory = selectedCategoryFilter === "ALL" || tpl.category === selectedCategoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Stats Breakdown
  const stats = {
    total: templates.length,
    approved: templates.filter(t => t.status === "APPROVED").length,
    pending: templates.filter(t => t.status === "PENDING").length,
    rejected: templates.filter(t => t.status === "REJECTED").length
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
            <FileText className="w-5 h-5 text-emerald-500" />
            Message Templates
          </h2>
          <p className="text-[11px] text-slate-500">Create, manage and sync pre-approved message layouts with Meta Business APIs.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSyncTemplates} 
            className="pro-btn-secondary h-9 px-4 font-bold flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sync with Meta
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)} 
            className="pro-btn-primary h-9 px-4 font-black flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-sm text-[11px] uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" /> Create Template
          </button>
        </div>
      </div>

      {/* Dashboard Stats Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Total Templates</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{stats.total}</h3>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg text-slate-500"><FileText className="w-5 h-5" /></div>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase text-emerald-500 tracking-wider">Approved</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{stats.approved}</h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-500"><CheckCircle2 className="w-5 h-5" /></div>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase text-amber-500 tracking-wider">Pending</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">{stats.pending}</h3>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg text-amber-500"><RefreshCw className="w-5 h-5 animate-spin-slow" /></div>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase text-rose-500 tracking-wider">Rejected</p>
            <h3 className="text-2xl font-black text-rose-600 mt-1">{stats.rejected}</h3>
          </div>
          <div className="p-3 bg-rose-50 rounded-lg text-rose-500"><AlertCircle className="w-5 h-5" /></div>
        </div>
      </div>

      {/* Toolbar - Search, Category filter and Status Tabs */}
      <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-full md:max-w-xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search template name/body..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-[11px] font-medium outline-none w-full text-slate-700" 
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Selectors */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {[
              { label: "All", value: "ALL" },
              { label: "Approved", value: "APPROVED" },
              { label: "Pending", value: "PENDING" },
              { label: "Rejected", value: "REJECTED" }
            ].map(tab => (
              <button 
                key={tab.value} 
                onClick={() => setSelectedStatus(tab.value)}
                className={`px-3 py-1 text-[10px] font-black uppercase rounded transition-all ${
                  selectedStatus === tab.value 
                    ? 'bg-white shadow-sm text-slate-900' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Dropdown Filter */}
          <div className="relative">
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 pr-8 rounded-lg text-[10px] font-black uppercase outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="MARKETING">Marketing</option>
              <option value="UTILITY">Utility</option>
              <option value="AUTHENTICATION">Authentication</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid List of Templates */}
      {filteredTemplates.length === 0 ? (
        <div className="bg-white border border-slate-150 rounded-xl p-16 text-center shadow-sm">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h4 className="text-[14px] font-bold text-slate-700">No templates found</h4>
          <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">We couldn't find any templates matching your search criteria. Try modifying your search or create a new template.</p>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 pro-btn-primary h-8 px-4 font-bold text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-sm inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Create First Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((tpl) => (
            <div key={tpl.id} className="bg-white border border-slate-200/60 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden">
              <div className="p-4 space-y-3 flex-1">
                {/* Header info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[8px] font-black tracking-widest uppercase text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">
                      {tpl.category}
                    </span>
                    <h4 className="text-[13px] font-bold text-slate-800 mt-1 truncate" title={tpl.name}>
                      {tpl.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase flex items-center gap-1 border ${
                      tpl.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      tpl.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {tpl.status === 'APPROVED' && <CheckCircle2 className="w-2.5 h-2.5" />}
                      {tpl.status === 'PENDING' && <RefreshCw className="w-2.5 h-2.5 animate-spin-slow" />}
                      {tpl.status === 'REJECTED' && <AlertCircle className="w-2.5 h-2.5" />}
                      {tpl.status}
                    </span>
                  </div>
                </div>

                {/* Body Text Sandbox */}
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg min-h-[90px] flex flex-col justify-between">
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium line-clamp-4">
                    {tpl.body}
                  </p>
                  {tpl.footerText && (
                    <p className="text-[9px] text-slate-400 border-t border-slate-100/50 pt-1.5 mt-2 font-medium">
                      {tpl.footerText}
                    </p>
                  )}
                </div>

                {/* Sub features */}
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold border-b border-slate-50 pb-2">
                  <div className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-300" />
                    <span>{tpl.language}</span>
                  </div>
                  <span>{tpl.date}</span>
                </div>

                {/* Buttons count & types */}
                {tpl.buttons && tpl.buttons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tpl.buttons.map((btn, bIdx) => (
                      <span key={bIdx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[8px] font-bold">
                        {btn.type === "URL" ? <ExternalLink className="w-2.5 h-2.5" /> : 
                         btn.type === "PHONE" ? <Phone className="w-2.5 h-2.5" /> : 
                         <MessageSquare className="w-2.5 h-2.5" />}
                        {btn.text}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Toolbar footer */}
              <div className="bg-slate-50 border-t border-slate-100 px-3 py-2 flex items-center justify-between">
                <button 
                  onClick={() => openPreview(tpl)}
                  className="text-slate-500 hover:text-slate-800 text-[10px] font-bold flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded"
                >
                  <Eye className="w-3 h-3" /> Preview
                </button>
                <div className="flex items-center gap-1.5">
                  {tpl.status === 'PENDING' && (
                    <button 
                      onClick={() => handleSyncToMeta(tpl.id)}
                      className="px-2 py-1 text-[9px] font-black uppercase tracking-wider rounded flex items-center gap-1 bg-amber-500 text-white hover:bg-amber-600"
                      title="Submit this template to Meta for approval"
                    >
                      <Upload className="w-3 h-3" /> Sync to Meta
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteTemplate(tpl.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 bg-white border border-slate-200 rounded hover:border-rose-100"
                    title="Delete Template"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    disabled={tpl.status !== "APPROVED"}
                    className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded flex items-center gap-1 ${
                      tpl.status === "APPROVED" 
                        ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-3 h-3" /> Use
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE TEMPLATE MODAL */}
      {isCreateModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <div>
                  <h3 className="text-[14px] font-bold text-slate-800">Create New Message Template</h3>
                  <p className="text-[10px] text-slate-500">Design your WhatsApp message block compliant with Meta Guidelines.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - 2 Columns (Form left, Realtime WhatsApp Preview right) */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Form Side */}
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                {/* Template Name */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">Template Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. order_completed_loyalty" 
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value.toLowerCase().replace(/\s/g, "_")})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[12px] font-medium outline-none focus:border-emerald-500 text-slate-800"
                    required
                  />
                  <span className="text-[9px] text-slate-400 mt-0.5 block">Use lowercase letters, numbers, and underscores only. No spaces.</span>
                </div>

                {/* Category & Language Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">Category</label>
                    <select
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="MARKETING">Marketing (Promo, Offers)</option>
                      <option value="UTILITY">Utility (Receipts, Updates)</option>
                      <option value="AUTHENTICATION">Authentication (OTPs)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">Language</label>
                    <select
                      value={newTemplate.language}
                      onChange={(e) => setNewTemplate({...newTemplate, language: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="en">English (en)</option>
                      <option value="es">Spanish (es)</option>
                      <option value="hi">Hindi (hi)</option>
                    </select>
                  </div>
                </div>

                {/* Header Type and Content */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                    <label className="text-[10px] font-black uppercase text-slate-600 tracking-wider">Header Content (Optional)</label>
                    <div className="flex items-center gap-1">
                      {["NONE", "TEXT", "IMAGE"].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNewTemplate({...newTemplate, headerType: type, headerText: ""})}
                          className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                            newTemplate.headerType === type 
                              ? "bg-emerald-600 text-white shadow-sm" 
                              : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-150"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {newTemplate.headerType === "TEXT" && (
                    <input 
                      type="text" 
                      placeholder="e.g. Welcome Customer" 
                      value={newTemplate.headerText}
                      onChange={(e) => setNewTemplate({...newTemplate, headerText: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[12px] font-medium outline-none focus:border-emerald-500 text-slate-800"
                      maxLength={60}
                    />
                  )}

                  {newTemplate.headerType === "IMAGE" && (
                    <input 
                      type="text" 
                      placeholder="Image URL (e.g. https://domain.com/banner.png)" 
                      value={newTemplate.headerText}
                      onChange={(e) => setNewTemplate({...newTemplate, headerText: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[12px] font-medium outline-none focus:border-emerald-500 text-slate-800"
                    />
                  )}
                </div>

                {/* Template Body Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider">Body Text</label>
                    <button
                      type="button"
                      onClick={addVariableToBody}
                      className="text-[9px] font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-700 flex items-center gap-1 px-2 py-0.5 bg-emerald-50 rounded border border-emerald-100 hover:bg-emerald-100/50"
                    >
                      + Add Variable
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Enter your message details here. Use {{1}}, {{2}} for dynamic customer inputs."
                    value={newTemplate.bodyText}
                    onChange={(e) => setNewTemplate({...newTemplate, bodyText: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-[12px] font-medium outline-none focus:border-emerald-500 text-slate-800 leading-relaxed"
                    required
                  />
                </div>

                {/* Footer Text */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">Footer Text (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Tap below to stop receiving messages." 
                    value={newTemplate.footerText}
                    onChange={(e) => setNewTemplate({...newTemplate, footerText: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[12px] font-medium outline-none focus:border-emerald-500 text-slate-800"
                  />
                </div>

                {/* Buttons Creator */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                    <label className="text-[10px] font-black uppercase text-slate-600 tracking-wider">Interactive Buttons (Optional)</label>
                    <span className="text-[9px] font-bold text-slate-400">Max 3 buttons</span>
                  </div>

                  {newTemplate.buttons.length < 3 && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => addButton("QUICK_REPLY")}
                        className="px-2 py-1 text-[9px] font-bold text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-100"
                      >
                        + Quick Reply
                      </button>
                      <button
                        type="button"
                        onClick={() => addButton("URL")}
                        className="px-2 py-1 text-[9px] font-bold text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-100"
                      >
                        + Website Link (CTA)
                      </button>
                      <button
                        type="button"
                        onClick={() => addButton("PHONE")}
                        className="px-2 py-1 text-[9px] font-bold text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-100"
                      >
                        + Phone Number (CTA)
                      </button>
                    </div>
                  )}

                  {/* Buttons inputs list */}
                  <div className="space-y-2">
                    {newTemplate.buttons.map((btn, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-lg">
                        <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">
                          {btn.type}
                        </span>
                        <input 
                          type="text" 
                          placeholder="Button Label" 
                          value={btn.text}
                          onChange={(e) => handleButtonChange(idx, "text", e.target.value)}
                          className="flex-1 bg-slate-50 border border-slate-100 rounded px-2 py-1 text-[11px] font-medium outline-none text-slate-800"
                          required
                        />
                        <input 
                          type="text" 
                          placeholder={btn.type === "URL" ? "URL: https://..." : btn.type === "PHONE" ? "+91..." : "Payload / Action"} 
                          value={btn.value}
                          onChange={(e) => handleButtonChange(idx, "value", e.target.value)}
                          className="flex-1 bg-slate-50 border border-slate-100 rounded px-2 py-1 text-[11px] font-medium outline-none text-slate-800"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeButton(idx)}
                          className="text-rose-500 hover:bg-rose-50 p-1 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Submit Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsCreateModalOpen(false)}
                    className="pro-btn-secondary h-9 px-4 font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="pro-btn-primary h-9 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-black text-[11px] uppercase tracking-wider shadow-md"
                  >
                    Submit for Approval
                  </button>
                </div>
              </form>

              {/* Preview Side (WhatsApp mockup screen) */}
              <div className="bg-slate-100 rounded-xl p-4 flex flex-col items-center justify-center min-h-[400px] border border-slate-200 relative" style={{ backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`, backgroundSize: 'cover' }}>
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></div>
                  Live Mobile Preview
                </div>

                {/* WhatsApp Chat Bubble */}
                <div className="bg-white rounded-lg shadow-md max-w-[280px] w-full overflow-hidden border border-slate-100 text-slate-800">
                  {/* Media Header (if enabled) */}
                  {newTemplate.headerType === "IMAGE" && (
                    <div className="bg-slate-100 aspect-video w-full flex items-center justify-center overflow-hidden border-b border-slate-100">
                      {newTemplate.headerText && newTemplate.headerText.startsWith("http") ? (
                        <img src={newTemplate.headerText} alt="Preview Banner" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center text-slate-400 p-4">
                          <Image className="w-8 h-8 mx-auto mb-1 opacity-50" />
                          <span className="text-[10px] font-medium break-all">{newTemplate.headerText || "No image url yet"}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bubble Content */}
                  <div className="p-3 space-y-1.5">
                    {/* Text Header */}
                    {newTemplate.headerType === "TEXT" && newTemplate.headerText && (
                      <p className="font-bold text-[12px] text-slate-900">{newTemplate.headerText}</p>
                    )}

                    {/* Main Body */}
                    <p className="text-[11.5px] text-slate-700 leading-relaxed font-normal whitespace-pre-wrap">
                      {formatBodyPreview(newTemplate.bodyText)}
                    </p>

                    {/* Footer */}
                    {newTemplate.footerText && (
                      <p className="text-[9.5px] text-slate-400 font-medium select-none">{newTemplate.footerText}</p>
                    )}
                  </div>

                  {/* Buttons Display inside bubble layout */}
                  {newTemplate.buttons.length > 0 && (
                    <div className="border-t border-slate-100 divide-y divide-slate-100">
                      {newTemplate.buttons.map((btn, idx) => (
                        <div key={idx} className="py-2.5 text-center text-[11px] font-black text-blue-500 flex items-center justify-center gap-1.5 hover:bg-slate-50 cursor-pointer transition-colors">
                          {btn.type === "URL" ? <ExternalLink className="w-3.5 h-3.5" /> : 
                           btn.type === "PHONE" ? <Phone className="w-3.5 h-3.5" /> : 
                           <MessageSquare className="w-3.5 h-3.5" />}
                          {btn.text || `Button ${idx+1}`}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}

      {/* INDIVIDUAL TEMPLATE PREVIEW MODAL */}
      {isPreviewModalOpen && activePreviewTemplate && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden flex flex-col">
            <div className="border-b border-slate-100 px-4 py-3 flex items-center justify-between bg-slate-50">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Template Inspector</span>
              <button onClick={() => setIsPreviewModalOpen(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 bg-slate-100/50 flex flex-col items-center justify-center" style={{ backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`, backgroundSize: 'cover' }}>
              <div className="bg-white rounded-lg shadow-md max-w-[280px] w-full overflow-hidden border border-slate-100">
                {activePreviewTemplate.headerType === "IMAGE" && (
                  <div className="bg-slate-100 aspect-video w-full flex items-center justify-center overflow-hidden border-b border-slate-100">
                    <img 
                      src={activePreviewTemplate.headerText || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60"} 
                      alt="Banner" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
                <div className="p-3 space-y-1.5 text-slate-800">
                  {activePreviewTemplate.headerType === "TEXT" && activePreviewTemplate.headerText && (
                    <p className="font-bold text-[12px] text-slate-900">{activePreviewTemplate.headerText}</p>
                  )}
                  <p className="text-[11.5px] text-slate-700 leading-relaxed font-normal whitespace-pre-wrap">
                    {activePreviewTemplate.body}
                  </p>
                  {activePreviewTemplate.footerText && (
                    <p className="text-[9.5px] text-slate-400 font-medium">{activePreviewTemplate.footerText}</p>
                  )}
                </div>
                {activePreviewTemplate.buttons && activePreviewTemplate.buttons.length > 0 && (
                  <div className="border-t border-slate-100 divide-y divide-slate-100">
                    {activePreviewTemplate.buttons.map((btn, idx) => (
                      <a 
                        key={idx} 
                        href={btn.type === 'URL' ? btn.value : undefined} 
                        target={btn.type === 'URL' ? "_blank" : undefined}
                        rel="noreferrer"
                        className="py-2.5 text-center text-[11px] font-black text-blue-500 flex items-center justify-center gap-1.5 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        {btn.type === "URL" ? <ExternalLink className="w-3.5 h-3.5" /> : 
                         btn.type === "PHONE" ? <Phone className="w-3.5 h-3.5" /> : 
                         <MessageSquare className="w-3.5 h-3.5" />}
                        {btn.text}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 p-4 bg-slate-50 flex items-center justify-between">
              <div>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Meta Approved ID</p>
                <p className="text-[10px] text-slate-700 font-bold font-mono">tpl_{activePreviewTemplate.id}</p>
              </div>
              <button 
                onClick={() => setIsPreviewModalOpen(false)}
                className="pro-btn-secondary h-8 px-4 font-bold text-[10px]"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default WhatsAppTemplates;
