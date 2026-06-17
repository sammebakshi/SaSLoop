import React, { useState, useEffect } from "react";
import { 
  Users, Search, Filter, Download, ChevronDown, 
  ShieldCheck, Plus, X, Trash2, Edit3,
  Calendar, Key, Shield, UserPlus,
  Activity, MoreHorizontal, CheckCircle2, AlertCircle,
  Mail, Settings2, Clock, Check
} from "lucide-react";
import API_BASE from "../config";

const WhatsAppOrgs = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");
  const [toast, setToast] = useState(null);

  // Invite Modal State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newInvite, setNewInvite] = useState({
    name: "",
    email: "",
    role: "AGENT", // ADMIN, SUPERVISOR, AGENT
    phone: ""
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/whatsapp/team`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setMembers(data.map(m => ({
            id: m.id,
            name: m.name || m.username || "Team Member",
            email: m.email,
            phone: m.phone || "Not specified",
            role: (m.role || "AGENT").toUpperCase(),
            status: m.status || "ACTIVE",
            joinedDate: m.joinedDate || "N/A",
            chatsManaged: m.chatsManaged || 0,
            avgResponse: m.avgResponse || "--"
          })));
        } else {
          setMembers(getMockMembers());
        }
      }
    } catch (err) {
      console.error("Error loading team members:", err);
      setMembers(getMockMembers());
    } finally {
      setLoading(false);
    }
  };

  const getMockMembers = () => [
    {
      id: "usr_101",
      name: "Sajad Bakshi",
      email: "sajad@sasloop.com",
      phone: "+919876543210",
      role: "ADMIN",
      status: "ACTIVE",
      joinedDate: "May 01, 2026",
      chatsManaged: 342,
      avgResponse: "1.5 mins"
    },
    {
      id: "usr_102",
      name: "Basit Ali",
      email: "basit@sasloop.com",
      phone: "+918123456789",
      role: "SUPERVISOR",
      status: "ACTIVE",
      joinedDate: "May 10, 2026",
      chatsManaged: 198,
      avgResponse: "4.2 mins"
    },
    {
      id: "usr_103",
      name: "Marwan W. P.",
      email: "marwan@sasloop.com",
      phone: "+917766554433",
      role: "AGENT",
      status: "ACTIVE",
      joinedDate: "May 15, 2026",
      chatsManaged: 512,
      avgResponse: "2.1 mins"
    },
    {
      id: "usr_104",
      name: "Sarah Jenkins",
      email: "sarah.j@sasloop.com",
      phone: "+919988776655",
      role: "AGENT",
      status: "PENDING",
      joinedDate: "Invited May 30, 2026",
      chatsManaged: 0,
      avgResponse: "--"
    }
  ];

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!newInvite.name || !newInvite.email) {
      alert("Name and email are required to invite a team member.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/whatsapp/team/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          name: newInvite.name,
          email: newInvite.email,
          role: newInvite.role,
          phone: newInvite.phone
        })
      });

      if (res.ok) {
        const created = await res.json();
        const formatted = {
          id: created.id,
          name: created.name,
          email: created.email,
          phone: created.phone || "Not specified",
          role: (created.role || "AGENT").toUpperCase(),
          status: created.status || "PENDING",
          joinedDate: created.joinedDate || "N/A",
          chatsManaged: created.chatsManaged || 0,
          avgResponse: created.avgResponse || "--"
        };
        setMembers([...members, formatted]);
        setIsInviteModalOpen(false);
        showToast(`Invitation sent to ${newInvite.email} successfully.`);
        
        setNewInvite({
          name: "",
          email: "",
          role: "AGENT",
          phone: ""
        });
      } else {
        const errData = await res.json();
        showToast(errData.error || "Failed to send invitation.", "error");
      }
    } catch (err) {
      console.error("Error inviting member:", err);
      showToast("Error connecting to invitation service.", "error");
    }
  };

  const handleRoleChange = (id, newRole) => {
    setMembers(members.map(m => {
      if (m.id === id) {
        showToast(`Role updated to ${newRole} for ${m.name}`);
        return { ...m, role: newRole };
      }
      return m;
    }));
  };

  const handleRemoveMember = async (id) => {
    const member = members.find(m => m.id === id);
    if (!member) return;
    if (window.confirm(`Are you sure you want to revoke WhatsApp Marketing access for ${member.name}?`)) {
      try {
        const res = await fetch(`${API_BASE}/api/whatsapp/team/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
          setMembers(members.filter(m => m.id !== id));
          showToast("Access privileges revoked.", "error");
        } else {
          showToast("Failed to revoke member access.", "error");
        }
      } catch (err) {
        console.error("Error removing member:", err);
        showToast("Error connecting to team service.", "error");
      }
    }
  };

  // Filter logs
  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.phone.includes(searchQuery);
    const matchesRole = selectedRoleFilter === "ALL" || m.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
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

      {/* Header section with Stats Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" />
            Team & Permissions
          </h2>
          <p className="text-[11px] text-slate-500">Invite, configure roles and review support performance statistics for team agents.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsInviteModalOpen(true)} 
            className="pro-btn-primary h-9 px-4 font-black flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-sm text-[11px] uppercase tracking-wider"
          >
            <UserPlus className="w-4 h-4" /> Invite Team Member
          </button>
        </div>
      </div>

      {/* Role Limits / Capacity Indicator */}
      <div className="bg-slate-50 border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-[12px] font-bold text-slate-700 uppercase flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> WhatsApp Access Tier Protocol
          </h4>
          <p className="text-[10px] text-slate-400">Your organization seat capacity matches the enterprise tier.</p>
        </div>
        <div className="flex items-center gap-6 text-[11px]">
          <div>
            <span className="text-slate-400 block text-[8px] font-bold uppercase">Active Agents</span>
            <span className="font-bold text-slate-800">{members.filter(m => m.status === 'ACTIVE').length} / 10 seats</span>
          </div>
          <div className="w-[1px] h-6 bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[8px] font-bold uppercase">Invites Pending</span>
            <span className="font-bold text-slate-800">{members.filter(m => m.status === 'PENDING').length} active</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-full md:max-w-xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search agents by name/email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-[11px] font-medium outline-none w-full text-slate-700" 
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          {[
            { label: "All Roles", value: "ALL" },
            { label: "Admin", value: "ADMIN" },
            { label: "Supervisor", value: "SUPERVISOR" },
            { label: "Agents", value: "AGENT" }
          ].map(tab => (
            <button 
              key={tab.value} 
              onClick={() => setSelectedRoleFilter(tab.value)}
              className={`px-3 py-1 text-[10px] font-black uppercase rounded transition-all ${
                selectedRoleFilter === tab.value 
                  ? 'bg-white shadow-sm text-slate-900' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Team Directory Grid */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center text-slate-450">
          <Users className="w-8 h-8 mx-auto mb-2 opacity-35" />
          <p className="text-[11px] font-bold">No team members match the filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <div key={member.id} className="bg-white border border-slate-200/60 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
              <div className="p-4 space-y-4">
                {/* Header profile details */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-[12px] shrink-0">
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[12.5px] font-bold text-slate-800 truncate">{member.name}</h4>
                      <p className="text-[9px] text-slate-400 truncate">{member.email}</p>
                    </div>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase border ${
                    member.status === "ACTIVE" 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                      : "bg-amber-50 text-amber-600 border-amber-100"
                  }`}>
                    {member.status}
                  </span>
                </div>

                {/* Performance telemetry stats */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[10px]">
                  <div>
                    <span className="text-slate-400 text-[8px] font-bold uppercase block">Chats Handled</span>
                    <span className="font-bold text-slate-700">{member.chatsManaged} dialogues</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[8px] font-bold uppercase block">Avg. Response Time</span>
                    <span className="font-bold text-slate-700">{member.avgResponse}</span>
                  </div>
                </div>

                {/* Sub details joined details */}
                <div className="flex justify-between items-center text-[9px] text-slate-450 font-bold border-b border-slate-50 pb-2">
                  <span className="flex items-center gap-0.5"><Calendar className="w-3 h-3 text-slate-350" /> {member.joinedDate}</span>
                  <span className="font-mono">{member.id}</span>
                </div>

                {/* Settings Actions: Role editor dropdown list */}
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <div className="flex items-center gap-1 text-slate-400 font-bold text-[9px] uppercase">
                    <Shield className="w-3.5 h-3.5 text-slate-350" /> Access Privileges:
                  </div>

                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 px-2 py-1 rounded text-[10px] font-black uppercase outline-none cursor-pointer"
                  >
                    <option value="ADMIN">Admin (Full Access)</option>
                    <option value="SUPERVISOR">Supervisor (Campaigns)</option>
                    <option value="AGENT">Agent (Chats Only)</option>
                  </select>
                </div>
              </div>

              {/* Action Toolbar footer */}
              <div className="bg-slate-50 border-t border-slate-100 px-3 py-2 flex items-center justify-end">
                <button 
                  onClick={() => handleRemoveMember(member.id)}
                  disabled={member.role === "ADMIN" && members.filter(m => m.role === "ADMIN").length === 1}
                  className={`p-1 text-slate-400 rounded hover:border-rose-100 hover:text-rose-600 ${
                    member.role === "ADMIN" && members.filter(m => m.role === "ADMIN").length === 1
                      ? "opacity-30 cursor-not-allowed" 
                      : "hover:bg-rose-50"
                  }`}
                  title="Revoke team access privileges"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INVITE TEAM MEMBER MODAL */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-500" />
                <span className="text-[12px] font-black uppercase text-slate-800 tracking-wider">Invite Team Agent</span>
              </div>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleInviteSubmit}>
              <div className="p-6 space-y-4">
                
                <div>
                  <label className="block text-[9.5px] font-black uppercase text-slate-550 tracking-wider mb-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Jane Doe"
                    value={newInvite.name}
                    onChange={(e) => setNewInvite({ ...newInvite, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[12px] font-medium outline-none focus:border-emerald-500 text-slate-850"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-black uppercase text-slate-550 tracking-wider mb-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g. jane@restaurant.com"
                    value={newInvite.email}
                    onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[12px] font-medium outline-none focus:border-emerald-500 text-slate-850"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-black uppercase text-slate-550 tracking-wider mb-1">Phone Number (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. +919876543210"
                    value={newInvite.phone}
                    onChange={(e) => setNewInvite({ ...newInvite, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[12px] font-medium outline-none focus:border-emerald-500 text-slate-850"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-black uppercase text-slate-555 tracking-wider mb-1">Access Role Privilege</label>
                  <select
                    value={newInvite.role}
                    onChange={(e) => setNewInvite({ ...newInvite, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[12px] font-bold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="ADMIN">Admin (Full Dashboard Settings)</option>
                    <option value="SUPERVISOR">Supervisor (Campaigns & Templates)</option>
                    <option value="AGENT">Agent (Chat Desk Live Messages)</option>
                  </select>
                </div>

                <div className="bg-slate-50 border rounded-xl p-3 text-[10px] text-slate-400 leading-snug">
                  <span className="font-bold text-slate-500 block mb-0.5">Role Guidelines:</span>
                  Admin users can configure channel links. Supervisors can design broadcast lists. Agent roles are restricted to the inbox chat terminal only.
                </div>

              </div>

              {/* Modal footer controls */}
              <div className="border-t border-slate-100 p-3 bg-slate-50 flex items-center justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="pro-btn-secondary h-8 px-4 font-bold text-[10px]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="pro-btn-primary h-8 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-black text-[10px] uppercase tracking-wider"
                >
                  Send Invitation
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default WhatsAppOrgs;
