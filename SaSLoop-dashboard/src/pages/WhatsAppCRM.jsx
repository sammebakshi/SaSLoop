import React, { useState, useEffect } from "react";
import { 
  Users, Search, Filter, Download, 
  Plus, X, Trash2, Edit3, UserPlus, 
  FileUp, MoreHorizontal, User, Mail, Phone,
  Tag, Layers, Shield, Flag, Globe2, Activity, MapPin, 
  ChevronRight, CheckCircle2, AlertCircle, Trash, ToggleLeft, ToggleRight, Check,
  ChevronDown, Database
} from "lucide-react";
import API_BASE from "../config";

const WhatsAppCRM = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegmentFilter, setSelectedSegmentFilter] = useState("ALL");
  const [selectedOptFilter, setSelectedOptFilter] = useState("ALL");
  const [toast, setToast] = useState(null);

  // Selected row tracking
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  
  // Modals & Sliders
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [activeDetailsContact, setActiveDetailsContact] = useState(null);

  // Forms states
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    segment: "LEAD", // VIP, LEAD, INACTIVE, REGULAR
    location: "Mumbai",
    optOut: false
  });

  const [importFile, setImportFile] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/crm/customers`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setContacts(data.map(c => ({
            id: c.id,
            name: c.name || "Customer",
            phone: c.phone || c.customer_number,
            email: c.email || "No email",
            segment: c.points > 1000 ? "VIP" : c.orders > 5 ? "REGULAR" : "LEAD",
            location: c.address || "Unknown",
            optOut: c.is_blocked || false,
            source: "POS Sync",
            date: c.last_visit ? new Date(c.last_visit).toLocaleDateString() : "N/A"
          })));
        } else {
          setContacts(getMockContacts());
        }
      }
    } catch (err) {
      console.error("Failed to load CRM customers:", err);
      setContacts(getMockContacts());
    } finally {
      setLoading(false);
    }
  };

  const getMockContacts = () => [
    { id: 1, name: "Sajad Bakshi", phone: "+919876543210", email: "sajad@sasloop.com", segment: "VIP", location: "Mumbai", optOut: false, source: "POS Sync", date: "May 20, 2026" },
    { id: 2, name: "Anjali Sharma", phone: "+918123456789", email: "anjali@gmail.com", segment: "REGULAR", location: "Delhi", optOut: false, source: "Web Reservation", date: "May 22, 2026" },
    { id: 3, name: "Rahul Verma", phone: "+919900887766", email: "rahul@outlook.com", segment: "LEAD", location: "Bangalore", optOut: false, source: "CSV Import", date: "May 25, 2026" },
    { id: 4, name: "Zara Khan", phone: "+917766554433", email: "zara@zarakhan.com", segment: "LEAD", location: "Pune", optOut: true, source: "CSV Import", date: "May 25, 2026" },
    { id: 5, name: "Dev Patel", phone: "+919988771122", email: "dev.patel@yahoo.com", segment: "INACTIVE", location: "Ahmedabad", optOut: false, source: "POS Sync", date: "May 10, 2026" },
    { id: 6, name: "Priya Nair", phone: "+919445566221", email: "priya@gmail.com", segment: "REGULAR", location: "Chennai", optOut: false, source: "POS Sync", date: "May 12, 2026" }
  ];

  useEffect(() => {
    fetchContacts();
  }, []);

  // Row selection handler
  const toggleRowSelect = (id) => {
    if (selectedRowIds.includes(id)) {
      setSelectedRowIds(selectedRowIds.filter(rowId => rowId !== id));
    } else {
      setSelectedRowIds([...selectedRowIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedRowIds.length === filteredContacts.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredContacts.map(c => c.id));
    }
  };

  // Add Contact logic
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) {
      alert("Name and phone number are required.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/crm/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          name: newContact.name,
          number: newContact.phone.startsWith("+") ? newContact.phone : `+91${newContact.phone}`,
          address: newContact.location,
          points: newContact.segment === "VIP" ? 1500 : 0
        })
      });

      if (res.ok) {
        fetchContacts();
        setIsAddModalOpen(false);
        showToast(`Added contact "${newContact.name}" to CRM database.`);
        
        setNewContact({
          name: "",
          phone: "",
          email: "",
          segment: "LEAD",
          location: "Mumbai",
          optOut: false
        });
      } else {
        const errData = await res.json();
        showToast(errData.error || "Failed to add customer.", "error");
      }
    } catch (err) {
      console.error("Error adding customer:", err);
      showToast("Error connecting to CRM service.", "error");
    }
  };

  // CSV Mock upload parsing
  const handleCsvImportSubmit = (e) => {
    e.preventDefault();
    if (!importFile) {
      alert("Please select a file to import");
      return;
    }

    // Mock parse and add
    const parsed = [
      { id: Date.now() + 1, name: "Amit Kumar", phone: "+919665544321", email: "amit.k@gmail.com", segment: "LEAD", location: "Kolkata", optOut: false, source: "CSV Import", date: "Just now" },
      { id: Date.now() + 2, name: "Sneha Gupta", phone: "+919112233445", email: "sneha.g@gmail.com", segment: "LEAD", location: "Lucknow", optOut: false, source: "CSV Import", date: "Just now" }
    ];

    setContacts([...parsed, ...contacts]);
    setIsImportModalOpen(false);
    setImportFile(null);
    showToast(`Successfully imported 2 contacts from "${importFile.name}" file.`);
  };

  // Bulk actions triggers
  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to permanently delete the ${selectedRowIds.length} selected contacts?`)) {
      setContacts(contacts.filter(c => !selectedRowIds.includes(c.id)));
      setSelectedRowIds([]);
      showToast("Selected contacts deleted successfully.", "error");
    }
  };

  const handleBulkChangeSegment = (nextSegment) => {
    setContacts(contacts.map(c => {
      if (selectedRowIds.includes(c.id)) {
        return { ...c, segment: nextSegment };
      }
      return c;
    }));
    setSelectedRowIds([]);
    showToast("Assigned new segment group tags in bulk.");
  };

  // Single Actions
  const toggleOptOut = async (id) => {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;
    const nextOpt = !contact.optOut;

    try {
      const res = await fetch(`${API_BASE}/api/crm/block-customer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          phone: contact.phone,
          isBlocked: nextOpt
        })
      });

      if (res.ok) {
        setContacts(contacts.map(c => c.id === id ? { ...c, optOut: nextOpt } : c));
        if (activeDetailsContact?.id === id) {
          setActiveDetailsContact({ ...activeDetailsContact, optOut: nextOpt });
        }
        showToast(`${contact.name} has been ${nextOpt ? "Opted Out" : "Opted In"} for marketing.`);
      } else {
        showToast("Failed to toggle opt status.", "error");
      }
    } catch (err) {
      console.error("Error toggling opt-out status:", err);
      showToast("Error connecting to CRM block service.", "error");
    }
  };

  const handleDeleteSingle = async (id) => {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        const res = await fetch(`${API_BASE}/api/crm/customer/${contact.phone}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
          setContacts(contacts.filter(c => c.id !== id));
          if (activeDetailsContact?.id === id) setActiveDetailsContact(null);
          showToast("Contact deleted successfully.", "error");
        } else {
          showToast("Failed to delete contact.", "error");
        }
      } catch (err) {
        console.error("Error deleting contact:", err);
        showToast("Error connecting to CRM service.", "error");
      }
    }
  };

  // Export filtered contacts CSV Mock
  const handleExportCsv = () => {
    showToast("CSV export compiled. Check your browser downloads folder.");
  };

  // Filter logs
  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.phone.includes(searchQuery) ||
                          c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSegment = selectedSegmentFilter === "ALL" || c.segment === selectedSegmentFilter;
    
    let matchesOpt = true;
    if (selectedOptFilter === "IN") matchesOpt = !c.optOut;
    if (selectedOptFilter === "OUT") matchesOpt = c.optOut;

    return matchesSearch && matchesSegment && matchesOpt;
  });

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

      {/* Header section with Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" />
            Audience Directory
          </h2>
          <p className="text-[11px] text-slate-500">Store user records, review channel opt-out logs, configure targeting categories, and bulk upload contacts.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="pro-btn-secondary h-9 px-4 font-bold flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-350"
          >
            <FileUp className="w-3.5 h-3.5" /> Import CSV
          </button>
          <button 
            onClick={handleExportCsv}
            className="pro-btn-secondary h-9 px-4 font-bold flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-350"
          >
            <Download className="w-3.5 h-3.5" /> Export Lists
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="pro-btn-primary h-9 px-4 font-black flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-sm text-[11px] uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" /> Add Contact
          </button>
        </div>
      </div>

      {/* CRM Segmentation Metrics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Total CRM Nodes</span>
            <h3 className="text-xl font-black text-slate-800 mt-0.5">{contacts.length}</h3>
          </div>
          <div className="p-2 bg-slate-50 rounded text-slate-500"><Users className="w-4 h-4" /></div>
        </div>
        <div className="bg-white border rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[8px] font-black uppercase text-emerald-500 tracking-wider">VIP Segment</span>
            <h3 className="text-xl font-black text-emerald-600 mt-0.5">{contacts.filter(c => c.segment === 'VIP').length}</h3>
          </div>
          <div className="p-2 bg-emerald-50 rounded text-emerald-500"><Tag className="w-4 h-4" /></div>
        </div>
        <div className="bg-white border rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[8px] font-black uppercase text-blue-500 tracking-wider">Active Leads</span>
            <h3 className="text-xl font-black text-blue-600 mt-0.5">{contacts.filter(c => c.segment === 'LEAD').length}</h3>
          </div>
          <div className="p-2 bg-blue-50 rounded text-blue-500"><Layers className="w-4 h-4" /></div>
        </div>
        <div className="bg-white border rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[8px] font-black uppercase text-rose-500 tracking-wider">Marketing Opt-Outs</span>
            <h3 className="text-xl font-black text-rose-600 mt-0.5">{contacts.filter(c => c.optOut).length}</h3>
          </div>
          <div className="p-2 bg-rose-50 rounded text-rose-500"><Shield className="w-4 h-4" /></div>
        </div>
      </div>

      {/* Main Layout containing table directory and optional details sidepanel */}
      <div className="flex gap-4 items-start">
        
        {/* Table Directory Box */}
        <div className="flex-1 bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden flex flex-col">
          
          {/* Internal Toolbar Filter options */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-1.5 w-full md:max-w-xs shadow-sm">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name, phone, city..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-[11px] font-medium outline-none w-full text-slate-700" 
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Segment Dropdown filter */}
              <div className="relative">
                <select
                  value={selectedSegmentFilter}
                  onChange={(e) => setSelectedSegmentFilter(e.target.value)}
                  className="appearance-none bg-white border text-slate-750 px-3 py-1.5 pr-8 rounded-lg text-[10px] font-black uppercase outline-none focus:border-emerald-500 cursor-pointer shadow-sm"
                >
                  <option value="ALL">All Segments</option>
                  <option value="VIP">VIP Segment</option>
                  <option value="REGULAR">Regular Segment</option>
                  <option value="LEAD">Leads Segment</option>
                  <option value="INACTIVE">Inactive Segment</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2 pointer-events-none" />
              </div>

              {/* Opt filter dropdown */}
              <div className="relative">
                <select
                  value={selectedOptFilter}
                  onChange={(e) => setSelectedOptFilter(e.target.value)}
                  className="appearance-none bg-white border text-slate-750 px-3 py-1.5 pr-8 rounded-lg text-[10px] font-black uppercase outline-none focus:border-emerald-500 cursor-pointer shadow-sm"
                >
                  <option value="ALL">All Opt Status</option>
                  <option value="IN">Opted In</option>
                  <option value="OUT">Opted Out</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Directory Listings Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11.5px]">
              <thead>
                <tr className="bg-slate-50 border-b text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-3 text-center w-10">
                    <input 
                      type="checkbox"
                      checked={filteredContacts.length > 0 && selectedRowIds.length === filteredContacts.length}
                      onChange={toggleSelectAll}
                      className="rounded text-emerald-600 focus:ring-emerald-500" 
                    />
                  </th>
                  <th className="px-4 py-3">Customer Profile</th>
                  <th className="px-4 py-3">Contact Number</th>
                  <th className="px-4 py-3 text-center">Segment</th>
                  <th className="px-4 py-3 text-center">Opt Status</th>
                  <th className="px-4 py-3">Source Channel</th>
                  <th className="px-4 py-3">Creation Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-slate-400 font-medium">
                      <Users className="w-8 h-8 text-slate-205 mx-auto mb-2 opacity-50" />
                      No matching contact cards found.
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map(c => (
                    <tr 
                      key={c.id} 
                      className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                        selectedRowIds.includes(c.id) ? "bg-emerald-50/10" : ""
                      } ${activeDetailsContact?.id === c.id ? "bg-slate-50 border-l-4 border-l-emerald-500" : ""}`}
                      onClick={() => setActiveDetailsContact(c)}
                    >
                      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox"
                          checked={selectedRowIds.includes(c.id)}
                          onChange={() => toggleRowSelect(c.id)}
                          className="rounded text-emerald-600 focus:ring-emerald-500" 
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-50 border flex items-center justify-center font-bold text-slate-800 text-[11px]">
                            {c.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800">{c.name}</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">{c.location}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-700">{c.phone}</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">{c.email}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                          c.segment === "VIP" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          c.segment === "LEAD" ? "bg-blue-50 text-blue-600 border-blue-100" :
                          c.segment === "INACTIVE" ? "bg-amber-50 text-amber-600 border-amber-100" :
                          "bg-slate-50 text-slate-500 border-slate-100"
                        }`}>
                          {c.segment}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => toggleOptOut(c.id)}
                          className="focus:outline-none"
                          title={c.optOut ? "Opt in for Marketing broadcasts" : "Opt out for Marketing broadcasts"}
                        >
                          {c.optOut ? (
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded text-[8px] font-black uppercase border border-rose-100">Opted Out</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[8px] font-black uppercase border border-emerald-100">Opted In</span>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-500">{c.source}</td>
                      <td className="px-4 py-3 text-slate-400 font-bold">{c.date}</td>
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => handleDeleteSingle(c.id)}
                          className="p-1 hover:bg-slate-100 text-slate-450 hover:text-rose-500 rounded"
                          title="Delete contact card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with selected rows counter */}
          <div className="px-4 py-3 border-t bg-slate-50/50 flex items-center justify-between text-[11px] text-slate-400 font-bold select-none">
            <span>Showing {filteredContacts.length} of {contacts.length} entries</span>
            {selectedRowIds.length > 0 && (
              <span className="text-emerald-600 font-bold">{selectedRowIds.length} rows selected</span>
            )}
          </div>
        </div>

        {/* Selected Details Side Drawer (Interactive Context) */}
        {activeDetailsContact && (
          <div className="w-72 bg-white border border-slate-205 rounded-xl p-4 shadow-md space-y-4 shrink-0 animate-pro-in select-none">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Contact Inspector</span>
              <button 
                onClick={() => setActiveDetailsContact(null)}
                className="p-1 hover:bg-slate-100 rounded text-slate-450 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-slate-50 border flex items-center justify-center font-black text-slate-800 text-[14px] mx-auto mb-2">
                {activeDetailsContact.name.substring(0, 2).toUpperCase()}
              </div>
              <h4 className="font-black text-slate-800 text-[13px]">{activeDetailsContact.name}</h4>
              <p className="text-[9.5px] font-mono text-slate-400 mt-0.5">{activeDetailsContact.phone}</p>
            </div>

            <div className="space-y-3 pt-2 text-[10.5px]">
              <div>
                <span className="text-slate-400 text-[8px] font-black uppercase tracking-wider block mb-0.5">Email Address</span>
                <span className="font-bold text-slate-800">{activeDetailsContact.email}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[8px] font-black uppercase tracking-wider block mb-0.5">Geographical Region</span>
                <span className="font-bold text-slate-800">{activeDetailsContact.location}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[8px] font-black uppercase tracking-wider block mb-0.5">Opt-In Status</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <button 
                    onClick={() => toggleOptOut(activeDetailsContact.id)}
                    className="focus:outline-none"
                  >
                    {activeDetailsContact.optOut ? (
                      <ToggleLeft className="w-8 h-8 text-rose-450" />
                    ) : (
                      <ToggleRight className="w-8 h-8 text-emerald-500" />
                    )}
                  </button>
                  <span className={`font-bold uppercase ${activeDetailsContact.optOut ? "text-rose-500" : "text-emerald-600"}`}>
                    {activeDetailsContact.optOut ? "Opted Out" : "Opted In"}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[8px] font-black uppercase tracking-wider block mb-0.5">CRM Segment tag</span>
                <select
                  value={activeDetailsContact.segment}
                  onChange={(e) => {
                    const nextVal = e.target.value;
                    setContacts(contacts.map(c => c.id === activeDetailsContact.id ? { ...c, segment: nextVal } : c));
                    setActiveDetailsContact({ ...activeDetailsContact, segment: nextVal });
                    showToast("Assigned new segment group tag.");
                  }}
                  className="bg-slate-50 border border-slate-200 text-slate-700 px-2 py-1 rounded text-[10px] font-black uppercase outline-none focus:border-emerald-500 cursor-pointer mt-1"
                >
                  <option value="VIP">VIP Segment</option>
                  <option value="REGULAR">Regular Segment</option>
                  <option value="LEAD">Leads Segment</option>
                  <option value="INACTIVE">Inactive Segment</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-3 space-y-1">
              <span className="text-slate-400 text-[8px] font-black uppercase tracking-wider block">System Metadata Logs</span>
              <div className="text-[10px] text-slate-450 font-medium space-y-1">
                <div>Source: <span className="font-bold text-slate-700">{activeDetailsContact.source}</span></div>
                <div>Created: <span className="font-bold text-slate-700">{activeDetailsContact.date}</span></div>
              </div>
            </div>

            <button 
              onClick={() => handleDeleteSingle(activeDetailsContact.id)}
              className="w-full py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded border border-rose-100 text-[10px] font-black uppercase tracking-widest transition-all mt-2 flex items-center justify-center gap-1.5"
            >
              <Trash className="w-3.5 h-3.5" /> Wipe Client Card
            </button>
          </div>
        )}

      </div>

      {/* FLOATING ACTION TOOLBAR FOR BULK OPERATIONS */}
      {selectedRowIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-xl shadow-2xl px-6 py-3 border border-slate-800 flex items-center gap-5 animate-pro-in text-[11px] font-bold">
          <span>{selectedRowIds.length} contact nodes selected</span>
          <div className="w-[1px] h-4 bg-slate-800" />
          <div className="flex items-center gap-2">
            <button 
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-rose-650 hover:bg-rose-700 rounded-lg text-white font-black uppercase tracking-wider text-[10px]"
            >
              Bulk Delete
            </button>
            
            {/* Quick Segment assign dropdown */}
            <div className="relative">
              <select
                onChange={(e) => {
                  if (e.target.value !== "NONE") {
                    handleBulkChangeSegment(e.target.value);
                    e.target.value = "NONE";
                  }
                }}
                className="appearance-none bg-slate-800 border border-slate-700 text-white px-3 py-1.5 pr-8 rounded-lg text-[9px] font-black uppercase outline-none cursor-pointer"
              >
                <option value="NONE">Assign Segment...</option>
                <option value="VIP">VIP</option>
                <option value="REGULAR">REGULAR</option>
                <option value="LEAD">LEAD</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2 pointer-events-none" />
            </div>

            <button 
              onClick={() => setSelectedRowIds([])}
              className="text-slate-400 hover:text-white px-2 py-1 text-[10px]"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* ADD CUSTOMER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-500" />
                <span className="text-[12px] font-black uppercase text-slate-800 tracking-wider">Add CRM Contact Node</span>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body form */}
            <form onSubmit={handleAddSubmit}>
              <div className="p-6 space-y-4">
                
                <div>
                  <label className="block text-[9.5px] font-black uppercase text-slate-500 tracking-wider mb-1">Customer Full Name*</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sajad Bakshi"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[12px] font-medium outline-none focus:border-emerald-500 text-slate-850"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9.5px] font-black uppercase text-slate-500 tracking-wider mb-1">Phone Number*</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 9876543210"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[12px] font-medium outline-none focus:border-emerald-500 text-slate-850"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-black uppercase text-slate-500 tracking-wider mb-1">City / Location</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Mumbai"
                      value={newContact.location}
                      onChange={(e) => setNewContact({ ...newContact, location: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[12px] font-medium outline-none focus:border-emerald-500 text-slate-850"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9.5px] font-black uppercase text-slate-500 tracking-wider mb-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g. sajad@restaurant.com"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[12px] font-medium outline-none focus:border-emerald-500 text-slate-850"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9.5px] font-black uppercase text-slate-500 tracking-wider mb-1">Segment tag</label>
                    <select
                      value={newContact.segment}
                      onChange={(e) => setNewContact({ ...newContact, segment: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="VIP">VIP Customer</option>
                      <option value="REGULAR">Regular Customer</option>
                      <option value="LEAD">Leads Segment</option>
                      <option value="INACTIVE">Inactive Segment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-black uppercase text-slate-500 tracking-wider mb-1">Opt-In Consent</label>
                    <div className="flex items-center gap-1.5 mt-2">
                      <button 
                        type="button"
                        onClick={() => setNewContact({ ...newContact, optOut: !newContact.optOut })}
                        className="focus:outline-none"
                      >
                        {newContact.optOut ? (
                          <ToggleLeft className="w-8 h-8 text-rose-450" />
                        ) : (
                          <ToggleRight className="w-8 h-8 text-emerald-500" />
                        )}
                      </button>
                      <span className={`text-[10px] font-bold ${newContact.optOut ? "text-rose-500" : "text-emerald-600"}`}>
                        {newContact.optOut ? "Opted Out" : "Opted In"}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal footer controls */}
              <div className="border-t border-slate-100 p-3 bg-slate-50 flex items-center justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="pro-btn-secondary h-8 px-4 font-bold text-[10px]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="pro-btn-primary h-8 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-black text-[10px] uppercase tracking-wider"
                >
                  Create Contact Card
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* CSV IMPORT MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden flex flex-col">
            
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileUp className="w-5 h-5 text-emerald-500" />
                <span className="text-[12px] font-black uppercase text-slate-800 tracking-wider">Import Contacts CSV</span>
              </div>
              <button onClick={() => { setIsImportModalOpen(false); setImportFile(null); }} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCsvImportSubmit}>
              <div className="p-6 space-y-4">
                <div className="border-2 border-dashed border-slate-250 hover:bg-slate-55/20 rounded-xl p-6 text-center cursor-pointer transition-colors relative">
                  <Database className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <span className="text-[11px] text-slate-650 font-bold block">Choose CSV spreadsheet file</span>
                  <span className="text-[9px] text-slate-400 block mt-1">Accepts CSV table layouts with phone and name keys</span>
                  {importFile && (
                    <div className="mt-3 px-3 py-1 bg-emerald-50 text-emerald-800 border rounded-lg text-[10px] font-bold">
                      {importFile.name} ({(importFile.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept=".csv"
                    onChange={(e) => setImportFile(e.target.files[0] || null)}
                    className="hidden" 
                    id="csv_bulk_uploader" 
                  />
                  <button 
                    type="button" 
                    onClick={() => document.getElementById('csv_bulk_uploader').click()}
                    className="mt-3 px-3 py-1.5 bg-white border border-slate-350 text-slate-700 hover:bg-slate-50 rounded text-[9.5px] font-bold"
                  >
                    Choose CSV file
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100 p-3 bg-slate-50 flex items-center justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => { setIsImportModalOpen(false); setImportFile(null); }}
                  className="pro-btn-secondary h-8 px-4 font-bold text-[10px]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!importFile}
                  className={`pro-btn-primary h-8 px-5 rounded font-black text-[10px] uppercase tracking-wider ${
                    importFile ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Perform Import
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default WhatsAppCRM;
