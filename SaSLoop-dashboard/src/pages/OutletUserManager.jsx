import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, Trash2, Search, RefreshCw, Filter, Edit3, Key, Shield, Mail, Phone, UserCircle, X, Check, Monitor, Smartphone, Terminal, Settings, Lock, User, Laptop } from "lucide-react";
import API_BASE from "../config";
import StoreAccessManager from "./StoreAccessManager";
import POSAccessManager from "./POSAccessManager";
import MPOSAccessManager from "./MPOSAccessManager";

const formatRegisteredAt = (dateStr) => {
    if (!dateStr) return '---';
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
};

const OutletUserManager = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [activeStoreAccessUserId, setActiveStoreAccessUserId] = useState(null);
    const [activePosAccessUserId, setActivePosAccessUserId] = useState(null);
    const [activeMposAccessUserId, setActiveMposAccessUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [designations, setDesignations] = useState([]);
    const [outlets, setOutlets] = useState([]);
    const [clusters, setClusters] = useState([]);
    const [isOutletsDropdownOpen, setIsOutletsDropdownOpen] = useState(false);
    const [isWarehouseDropdownOpen, setIsWarehouseDropdownOpen] = useState(false);

    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    const activeOutletId = sessionStorage.getItem("impersonate_id") || loggedInUser.id;

    const getSelectedOutletName = (targetId) => {
        const found = outlets.find(o => String(o.user_id) === String(targetId || activeOutletId));
        return found?.name || loggedInUser.business_name || "Current Outlet";
    };

    const [formData, setFormData] = useState({
        parent_user_id: activeOutletId || "",
        username: "",
        password: "",
        name: "",
        phone: "",
        email: "",
        designation_id: "",
        user_type: "POS Billing",
        status: "active",
        city: "",
        sub_locality: "",
        address: "",
        web_access: false,
        mac_address: "",
        verify_mac_ip: false,
        cluster_id: "",
        language_preference: "en",
        copy_settings_user_id: "",
        copy_pos_access: false,
        copy_mpos_access: false,
        copy_store_access: false,
        assigned_outlets: [],
        select_all_outlets: false,
        assigned_warehouses: [],
        select_all_warehouses: false
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [notification, setNotification] = useState(null); // Keep for errors
    const [showSuccess, setShowSuccess] = useState(false);
    const [confirmation, setConfirmation] = useState(null); // { title, message, onConfirm }

    const fetchOutlets = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/brand/outlets`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setOutlets(Array.isArray(data) ? data : []);
        } catch (e) { console.error(e); }
    };

    const fetchClusters = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/brand/clusters`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setClusters(Array.isArray(data) ? data : []);
        } catch (e) { console.error(e); }
    };

    const fetchDesignations = async () => {
        try {
            const impersonateId = sessionStorage.getItem("impersonate_id");
            let url = `${API_BASE}/api/brand/designations`;
            const params = new URLSearchParams();
            if (impersonateId) {
                params.append("target_user_id", impersonateId);
                params.append("outlet_id", impersonateId);
            }
            if (params.toString()) url += `?${params.toString()}`;

            const res = await fetch(url, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            const data = await res.json();
            setDesignations(Array.isArray(data) ? data : []);
        } catch (e) { console.error(e); }
    };

    const fetchUsers = async () => {
        try {
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
            const res = await fetch(`${API_BASE}/api/brand/users${targetParam}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { 
        fetchUsers(); 
        fetchDesignations();
        fetchOutlets();
        fetchClusters();
    }, []);
    
    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => setShowSuccess(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    const handleDelete = (id) => {
        setConfirmation({
            title: "Delete Personnel Identity",
            message: "Are you sure you want to permanently delete this identity? This action will remove the user and all associated logs immediately.",
            onConfirm: async () => {
                try {
                    const res = await fetch(`${API_BASE}/api/brand/users/${id}`, {
                        method: "DELETE",
                        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                    });
                    if (res.ok) {
                        setShowSuccess(true);
                        fetchUsers();
                    } else {
                        const errorData = await res.json();
                        setNotification({ type: "error", message: `Deletion Failed: ${errorData.error}` });
                    }
                } catch (e) { 
                    setNotification({ type: "error", message: "Network Error: Failed to reach security gateway." });
                }
                setConfirmation(null);
            }
        });
    };

    const handleEdit = async (user) => {
        let assignedOutlets = [];
        try {
            const res = await fetch(`${API_BASE}/api/brand/users/${user.id}/store-access`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.ok) {
                const data = await res.json();
                assignedOutlets = data.assignedOutletIds || [];
            }
        } catch (e) {
            console.error("Failed to fetch store access details", e);
        }

        setFormData({
            parent_user_id: user.parent_user_id || activeOutletId || "",
            username: user.username || "",
            password: "",
            name: user.name || "",
            phone: user.phone || "",
            email: user.email || "",
            designation_id: user.designation_id || "",
            user_type: user.user_type || "POS Billing",
            status: user.status || "active",
            city: user.city || "",
            sub_locality: user.sub_locality || "",
            address: user.address || "",
            web_access: !!user.web_access,
            mac_address: user.mac_address || "",
            verify_mac_ip: !!user.verify_mac_ip,
            cluster_id: user.cluster_id || "",
            language_preference: user.language_preference || "en",
            copy_settings_user_id: "",
            copy_pos_access: false,
            copy_mpos_access: false,
            copy_store_access: false,
            assigned_outlets: assignedOutlets,
            select_all_outlets: false,
            assigned_warehouses: user.staff_permissions?.assigned_warehouses || [],
            select_all_warehouses: false
        });
        setEditId(user.id);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const url = isEditing ? `${API_BASE}/api/brand/users/${editId}` : `${API_BASE}/api/brand/users`;
            const method = isEditing ? "PUT" : "POST";

            const userBody = {
                parent_user_id: formData.parent_user_id || impersonateId,
                username: formData.username,
                password: formData.password,
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                designation_id: formData.designation_id,
                user_type: formData.user_type,
                status: formData.status,
                city: formData.city,
                sub_locality: formData.sub_locality,
                address: formData.address,
                web_access: formData.web_access,
                mac_address: formData.mac_address,
                verify_mac_ip: formData.verify_mac_ip,
                language_preference: formData.language_preference,
                target_user_id: impersonateId,
                staff_permissions: {
                    assigned_warehouses: formData.assigned_warehouses
                }
            };

            const res = await fetch(url, {
                method: method,
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(userBody)
            });
            if (res.ok) {
                const savedUser = await res.json();
                const userId = savedUser.id || editId;

                // 1. Save multi-store access
                const finalOutletIds = formData.select_all_outlets
                    ? outlets.map(o => o.user_id)
                    : formData.assigned_outlets;

                if (finalOutletIds.length > 0) {
                    await fetch(`${API_BASE}/api/brand/users/${userId}/store-access`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        },
                        body: JSON.stringify({ outlet_ids: finalOutletIds })
                    });
                }

                // 2. Handle Copy access settings if selected
                if (formData.copy_settings_user_id) {
                    const srcUserId = formData.copy_settings_user_id;

                    if (formData.copy_pos_access) {
                        const posRes = await fetch(`${API_BASE}/api/brand/users/${srcUserId}/pos-access`, {
                            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                        });
                        if (posRes.ok) {
                            const posData = await posRes.json();
                            await fetch(`${API_BASE}/api/brand/users/${userId}/pos-access`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                                },
                                body: JSON.stringify({ pos_access: posData.pos_access })
                            });
                        }
                    }

                    if (formData.copy_mpos_access) {
                        const mposRes = await fetch(`${API_BASE}/api/brand/users/${srcUserId}/mpos-access`, {
                            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                        });
                        if (mposRes.ok) {
                            const mposData = await mposRes.json();
                            await fetch(`${API_BASE}/api/brand/users/${userId}/mpos-access`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                                },
                                body: JSON.stringify({ mpos_access: mposData.mpos_access })
                            });
                        }
                    }

                    if (formData.copy_store_access) {
                        // 1. Copy multi-outlet access
                        const srcStoreRes = await fetch(`${API_BASE}/api/brand/users/${srcUserId}/store-access`, {
                            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                        });
                        if (srcStoreRes.ok) {
                            const srcStoreData = await srcStoreRes.json();
                            const assignedIds = srcStoreData.assignedOutletIds || [];
                            await fetch(`${API_BASE}/api/brand/users/${userId}/store-access`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                                },
                                body: JSON.stringify({ outlet_ids: assignedIds })
                            });
                        }

                        // 2. Copy module-level access permissions
                        const srcModuleRes = await fetch(`${API_BASE}/api/brand/users/${srcUserId}/module-access`, {
                            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                        });
                        if (srcModuleRes.ok) {
                            const srcModuleData = await srcModuleRes.json();
                            await fetch(`${API_BASE}/api/brand/users/${userId}/module-access`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                                },
                                body: JSON.stringify({ store_modules: srcModuleData.store_modules })
                            });
                        }
                    }
                }

                setShowSuccess(true);
                setIsModalOpen(false);
                setIsEditing(false);
                setEditId(null);
                setFormData({
                    parent_user_id: activeOutletId || "",
                    username: "",
                    password: "",
                    name: "",
                    phone: "",
                    email: "",
                    designation_id: "",
                    user_type: "POS Billing",
                    status: "active",
                    city: "",
                    sub_locality: "",
                    address: "",
                    web_access: false,
                    mac_address: "",
                    verify_mac_ip: false,
                    cluster_id: "",
                    language_preference: "en",
                    copy_settings_user_id: "",
                    copy_pos_access: false,
                    copy_mpos_access: false,
                    copy_store_access: false,
                    assigned_outlets: [],
                    select_all_outlets: false,
                    assigned_warehouses: [],
                    select_all_warehouses: false
                });
                fetchUsers();
            } else {
                const errorData = await res.json();
                setNotification({ type: "error", message: `Operation Failed: ${errorData.error}` });
            }
        } catch (err) { 
            setNotification({ type: "error", message: "Network Error: Failed to reach orchestration server." });
        }
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center justify-between bg-white dark:bg-[#1e2129] p-3 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                        <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="pro-heading">Manage Users</h2>
                        <p className="pro-subheading">Manage staff and login credentials</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchUsers} className="h-9 px-4 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync
                    </button>
                    <button 
                        onClick={() => {
                            setIsEditing(false);
                            setEditId(null);
                            setFormData({
                                parent_user_id: activeOutletId || "",
                                username: "",
                                password: "",
                                name: "",
                                phone: "",
                                email: "",
                                designation_id: "",
                                user_type: "POS Billing",
                                status: "active",
                                city: "",
                                sub_locality: "",
                                address: "",
                                web_access: false,
                                mac_address: "",
                                verify_mac_ip: false,
                                cluster_id: "",
                                language_preference: "en",
                                copy_settings_user_id: "",
                                copy_pos_access: false,
                                copy_mpos_access: false,
                                copy_store_access: false,
                                assigned_outlets: [],
                                select_all_outlets: false,
                                assigned_warehouses: [],
                                select_all_warehouses: false
                            });
                            setIsModalOpen(true);
                        }}
                        className="h-9 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-md shadow-emerald-600/10"
                    >
                        <Plus className="w-3.5 h-3.5" /> Add User
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1e2129] p-3 rounded-lg border border-slate-200 dark:border-white/5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 flex-1">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Filter personnel by name or identity..." className="bg-transparent text-[11px] font-bold text-slate-600 dark:text-slate-300 outline-none w-full uppercase placeholder:text-slate-300 dark:placeholder:text-slate-600" />
                </div>
                <button className="p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-md text-slate-400 transition-all"><Filter className="w-4 h-4" /></button>
            </div>

            {loading ? (
                <div className="bg-white dark:bg-[#1e2129] rounded-lg border border-slate-200 dark:border-white/5 py-32 text-center shadow-sm">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Scanning Credential Vaults...</p>
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-[#1e2129] rounded-lg border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
                    <table className="pro-table">
                        <thead>
                            <tr>
                                <th>Action</th>
                                <th>#</th>
                                <th>Name</th>
                                <th>Outlet Name</th>
                                <th>Mobile</th>
                                <th>Username</th>
                                <th>Access Code</th>
                                <th>Designation</th>
                                <th>User Type</th>
                                <th>MPOS App Version</th>
                                <th>POS Exe Version</th>
                                <th>Registered At</th>
                                <th>Active</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {users.map((u, idx) => (
                                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {/* Reference compliance action container group */}
                                            <div className="flex items-center gap-2 bg-slate-800 dark:bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded shadow-sm">
                                                {/* 1st Option: Manage User Details */}
                                                <button 
                                                    onClick={() => handleEdit(u)} 
                                                    title="Manage User Details" 
                                                    className="text-white/80 hover:text-white transition-all active:scale-90"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </button>

                                                {/* 2nd Option: Manage Your Store Access Level */}
                                                <button 
                                                    onClick={() => setActiveStoreAccessUserId(u.id)} 
                                                    title="Manage Your Store Access Level" 
                                                    className="text-white/80 hover:text-white transition-all active:scale-90"
                                                >
                                                    <Key className="w-3.5 h-3.5" />
                                                </button>

                                                {/* 3rd Option: Manage SaSloop POS Access Level */}
                                                <button 
                                                    onClick={() => setActivePosAccessUserId(u.id)} 
                                                    title="Manage SaSloop POS Access Level" 
                                                    className="text-white/80 hover:text-white transition-all active:scale-90"
                                                >
                                                    <Monitor className="w-3.5 h-3.5" />
                                                </button>

                                                {/* 4th Option: Manage SaSloop MPOS Access Level */}
                                                <button 
                                                    onClick={() => setActiveMposAccessUserId(u.id)} 
                                                    title="Manage SaSloop MPOS Access Level" 
                                                    className="text-white/80 hover:text-white transition-all active:scale-90"
                                                >
                                                    <Smartphone className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            {/* Separation Trash/Delete button */}
                                            <button 
                                                onClick={() => handleDelete(u.id)} 
                                                title="Delete User" 
                                                className="p-1.5 bg-slate-100 dark:bg-white/5 hover:bg-rose-600 hover:text-white rounded text-slate-400 transition-all border border-slate-200 dark:border-white/10 shadow-sm active:scale-90"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[11px] font-bold text-slate-400">{idx + 1}</td>
                                    <td className="px-6 py-4 text-[12px] font-bold text-slate-800 dark:text-slate-200">{u.name}</td>
                                    <td className="px-6 py-4 text-[11px] font-medium text-slate-600 dark:text-slate-400">{u.outlet_name || 'Global Cluster'}</td>
                                    <td className="px-6 py-4 text-[11px] font-medium text-slate-600 dark:text-slate-400">{u.phone || 'N/A'}</td>
                                    <td className="px-6 py-4 text-[11px] font-medium text-slate-600 dark:text-slate-400">{u.username}</td>
                                    <td className="px-6 py-4 text-[11px] font-medium text-slate-600 dark:text-slate-400">{u.access_code || '---'}</td>
                                    <td className="px-6 py-4 text-[11px] font-medium text-slate-600 dark:text-slate-400">{u.designation_name || 'Unassigned'}</td>
                                    <td className="px-6 py-4 text-[11px] font-medium text-slate-600 dark:text-slate-400">{u.user_type}</td>
                                    <td className="px-6 py-4 text-[11px] font-medium text-slate-600 dark:text-slate-400">{u.staff_permissions?.mpos_app_version || '---'}</td>
                                    <td className="px-6 py-4 text-[11px] font-medium text-slate-600 dark:text-slate-400">{u.staff_permissions?.pos_exe_version || '---'}</td>
                                    <td className="px-6 py-4 text-[11px] font-medium text-slate-600 dark:text-slate-400">{formatRegisteredAt(u.created_at)}</td>
                                    <td className="px-6 py-4">
                                        {u.status === 'active' ? (
                                            <span className="px-2.5 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-black tracking-wider shadow-sm uppercase">YES</span>
                                        ) : (
                                            <span className="px-2.5 py-0.5 rounded bg-rose-500 text-white text-[9px] font-black tracking-wider shadow-sm uppercase">NO</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                <td colSpan="13" className="py-32 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 dark:border-white/10 flex items-center justify-center">
                                                <UserCircle className="w-10 h-10 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Registry Vacant</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">No Personnel Credentials provisioned</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {/* Provision Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#12151e] w-full max-w-6xl rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xl overflow-visible flex flex-col">
                        <div className="p-4 bg-slate-50 dark:bg-[#181d2a] border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                            <h3 className="text-[13px] font-black text-slate-800 dark:text-white uppercase tracking-widest">{isEditing ? 'Update User' : 'Add User'}</h3>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Column 1 */}
                            <div className="space-y-4">
                                {/* Outlet Name */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Outlet Name: <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        readOnly 
                                        value={getSelectedOutletName(formData.parent_user_id)} 
                                        className="w-full bg-slate-50 dark:bg-[#1a1d26]/50 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700/60 rounded-md px-3 py-2 text-[12px] font-bold cursor-not-allowed focus:outline-none" 
                                    />
                                </div>

                                {/* User Type */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">User Type: <span className="text-red-500">*</span></label>
                                    <select required value={formData.user_type} onChange={e => setFormData({...formData, user_type: e.target.value})} className="w-full bg-white dark:bg-[#1a1d26] text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/60 rounded-md px-3 py-2 text-[12px] focus:outline-none focus:ring-1 focus:ring-emerald-500">
                                        <option value="">Select User Type</option>
                                        <option value="POS Billing">POS Billing</option>
                                        <option value="OrderHub (Captain / OrderX / KDS / TMS)">OrderHub (Captain / OrderX / KDS / TMS)</option>
                                        <option value="Delivery Boy">Delivery Boy</option>
                                        <option value="Waiter">Waiter</option>
                                        <option value="Self Order Kiosk">Self Order Kiosk</option>
                                        <option value="Call Center">Call Center</option>
                                        <option value="Passcode">Passcode</option>
                                    </select>
                                </div>

                                {/* Designation */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Designation: <span className="text-red-500">*</span></label>
                                    <select required value={formData.designation_id} onChange={e => setFormData({...formData, designation_id: e.target.value})} className="w-full bg-white dark:bg-[#1a1d26] text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/60 rounded-md px-3 py-2 text-[12px] focus:outline-none focus:ring-1 focus:ring-emerald-500">
                                        <option value="">Select Type</option>
                                        {designations.map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* City */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">City:</label>
                                    <input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-white dark:bg-[#1a1d26] text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/60 rounded-md px-3 py-2 text-[12px] focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Enter City" />
                                </div>

                                {/* Active Checkbox */}
                                <div className="flex items-center gap-2 pt-2">
                                    <input type="checkbox" id="user-active" checked={formData.status === 'active'} onChange={e => setFormData({...formData, status: e.target.checked ? 'active' : 'inactive'})} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer" />
                                    <label htmlFor="user-active" className="text-[11px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">Active</label>
                                </div>

                                {/* Verify System Login with MAC IP Address Checkbox */}
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="user-verify-mac" checked={formData.verify_mac_ip} onChange={e => setFormData({...formData, verify_mac_ip: e.target.checked})} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer" />
                                    <label htmlFor="user-verify-mac" className="text-[11px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">Verify System Login with MAC IP Address</label>
                                </div>

                                {/* Address */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Address</label>
                                    <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows={3} className="w-full bg-white dark:bg-[#1a1d26] text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/60 rounded-md px-3 py-2 text-[12px] focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Enter Address" />
                                </div>
                            </div>

                            {/* Column 2 */}
                            <div className="space-y-4">
                                {/* Username */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Username: <span className="text-red-500">*</span></label>
                                    <input required disabled={isEditing} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className={`w-full text-slate-900 border border-slate-300 rounded-md px-3 py-2 text-[12px] focus:outline-none focus:ring-1 focus:ring-emerald-500 ${isEditing ? 'bg-slate-100 dark:bg-slate-800/50 cursor-not-allowed text-slate-500 dark:text-slate-400 font-bold' : 'bg-white dark:bg-[#1a1d26] dark:text-slate-100'}`} placeholder="Enter Username" />
                                </div>

                                {/* Name */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Name: <span className="text-red-500">*</span></label>
                                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white dark:bg-[#1a1d26] text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/60 rounded-md px-3 py-2 text-[12px] focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Enter Name" />
                                </div>

                                {/* Sub Locality */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Sub Locality:</label>
                                    <input value={formData.sub_locality} onChange={e => setFormData({...formData, sub_locality: e.target.value})} className="w-full bg-white dark:bg-[#1a1d26] text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/60 rounded-md px-3 py-2 text-[12px] focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Enter Sub Locality" />
                                </div>

                                {/* Web Access Checkbox */}
                                <div className="flex items-center gap-2 pt-2">
                                    <input type="checkbox" id="user-web-access" checked={formData.web_access} onChange={e => setFormData({...formData, web_access: e.target.checked})} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer" />
                                    <label htmlFor="user-web-access" className="text-[11px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">Web Access</label>
                                </div>

                                {/* MAC Address */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">MAC Address</label>
                                    <input value={formData.mac_address} onChange={e => setFormData({...formData, mac_address: e.target.value})} className="w-full bg-white dark:bg-[#1a1d26] text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/60 rounded-md px-3 py-2 text-[12px] focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Search/Add a MAC Address" />
                                </div>

                                {/* Assign Another Outlet */}
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Assign Another Outlet</label>
                                        <div className="flex items-center gap-1">
                                            <input 
                                                type="checkbox" 
                                                id="select-all-outlets"
                                                checked={formData.select_all_outlets}
                                                onChange={e => {
                                                    const checked = e.target.checked;
                                                    setFormData({
                                                        ...formData,
                                                        select_all_outlets: checked,
                                                        assigned_outlets: checked ? outlets.map(o => o.user_id) : []
                                                    });
                                                }}
                                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3 h-3 cursor-pointer"
                                            />
                                            <label htmlFor="select-all-outlets" className="text-[9px] font-bold text-slate-500 dark:text-slate-400 cursor-pointer select-none uppercase tracking-wide">Select All Outlets</label>
                                        </div>
                                    </div>
                                    {/* Custom Multi-Select Dropdown */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsOutletsDropdownOpen(!isOutletsDropdownOpen);
                                                setIsWarehouseDropdownOpen(false);
                                            }}
                                            className="w-full bg-white dark:bg-[#1a1d26] text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/60 rounded-md px-3 py-2 text-[12px] flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        >
                                            <span className="truncate text-slate-500 dark:text-slate-400 font-medium">
                                                {formData.assigned_outlets.length > 0 
                                                    ? `${formData.assigned_outlets.length} outlet(s) selected` 
                                                    : "Select option"}
                                            </span>
                                            <span className="text-slate-400 text-[10px]">▼</span>
                                        </button>
                                        {isOutletsDropdownOpen && (
                                            <div className="absolute z-[110] left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-[#1a1d26] border border-slate-300 dark:border-slate-700 rounded-md shadow-lg p-2 text-slate-900 dark:text-slate-100 text-[12px] space-y-1">
                                                {outlets.map(o => {
                                                    const isChecked = formData.assigned_outlets.includes(o.user_id);
                                                    return (
                                                        <label key={o.user_id} className="flex items-center gap-2 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded cursor-pointer select-none">
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={() => {
                                                                    if (isChecked) {
                                                                        setFormData({
                                                                            ...formData,
                                                                            assigned_outlets: formData.assigned_outlets.filter(id => id !== o.user_id)
                                                                        });
                                                                    } else {
                                                                        setFormData({
                                                                            ...formData,
                                                                            assigned_outlets: [...formData.assigned_outlets, o.user_id]
                                                                        });
                                                                    }
                                                                }}
                                                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                                                            />
                                                            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">{o.name}</span>
                                                        </label>
                                                    );
                                                })}
                                                {outlets.length === 0 && (
                                                    <div className="p-2 text-center text-slate-400 dark:text-slate-500 text-[11px]">No outlets found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Cluster */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Cluster</label>
                                    <select value={formData.cluster_id} onChange={e => setFormData({...formData, cluster_id: e.target.value})} className="w-full bg-white dark:bg-[#1a1d26] text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/60 rounded-md px-3 py-2 text-[12px] focus:outline-none focus:ring-1 focus:ring-emerald-500">
                                        <option value="">Select Cluster</option>
                                        {clusters.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Language Preference */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Language Preference</label>
                                    <select value={formData.language_preference} onChange={e => setFormData({...formData, language_preference: e.target.value})} className="w-full bg-white dark:bg-[#1a1d26] text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/60 rounded-md px-3 py-2 text-[12px] focus:outline-none focus:ring-1 focus:ring-emerald-500">
                                        <option value="en">English</option>
                                        <option value="hi">Hindi</option>
                                        <option value="ar">Arabic</option>
                                    </select>
                                </div>
                            </div>

                            {/* Column 3 */}
                            <div className="space-y-4">
                                {/* Password */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Password: <span className="text-red-500">*</span></label>
                                    <input required={!isEditing} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-white dark:bg-[#1a1d26] text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/60 rounded-md px-3 py-2 text-[12px] focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Enter Password" />
                                    {isEditing && <p className="text-[9px] text-rose-500 font-bold uppercase tracking-wider">Leave this field blank to keep your existing password</p>}
                                </div>

                                {/* Phone */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Phone: <span className="text-red-500">*</span></label>
                                    <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white dark:bg-[#1a1d26] text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/60 rounded-md px-3 py-2 text-[12px] focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Enter Phone" />
                                </div>

                                {/* Email */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Email:</label>
                                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white dark:bg-[#1a1d26] text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/60 rounded-md px-3 py-2 text-[12px] focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Enter Email" />
                                </div>

                                {/* Shift Time */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Shift Time</label>
                                    <input value={formData.shift_time} onChange={e => setFormData({...formData, shift_time: e.target.value})} className="w-full bg-white dark:bg-[#1a1d26] text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/60 rounded-md px-3 py-2 text-[12px] focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Enter Shift Time" />
                                </div>

                                {/* Copy Access Settings User */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Copy Access Settings User:</label>
                                    <select value={formData.copy_settings_user_id} onChange={e => setFormData({...formData, copy_settings_user_id: e.target.value})} className="w-full bg-white dark:bg-[#1a1d26] text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/60 rounded-md px-3 py-2 text-[12px] focus:outline-none focus:ring-1 focus:ring-emerald-500">
                                        <option value="">Select User</option>
                                        {users.filter(u => u.id !== editId).map(u => (
                                            <option key={u.id} value={u.id}>{u.name} ({u.username})</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Copy Access Settings Checkboxes */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Copy Access Settings:</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <input type="checkbox" id="copy-pos" checked={formData.copy_pos_access} onChange={e => setFormData({...formData, copy_pos_access: e.target.checked})} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer" />
                                            <label htmlFor="copy-pos" className="text-[10px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">SaSLoop Main</label>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <input type="checkbox" id="copy-mpos" checked={formData.copy_mpos_access} onChange={e => setFormData({...formData, copy_mpos_access: e.target.checked})} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer" />
                                            <label htmlFor="copy-mpos" className="text-[10px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">SaSLoop App</label>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <input type="checkbox" id="copy-store" checked={formData.copy_store_access} onChange={e => setFormData({...formData, copy_store_access: e.target.checked})} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer" />
                                            <label htmlFor="copy-store" className="text-[10px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">Outlet Access Level</label>
                                        </div>
                                    </div>
                                </div>

                                {/* Assign Another Warehouse */}
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Assign Another Warehouse</label>
                                        <div className="flex items-center gap-1">
                                            <input 
                                                type="checkbox" 
                                                id="select-all-warehouses"
                                                checked={formData.select_all_warehouses}
                                                onChange={e => {
                                                    const checked = e.target.checked;
                                                    setFormData({
                                                        ...formData,
                                                        select_all_warehouses: checked,
                                                        assigned_warehouses: checked ? ["Central Warehouse"] : []
                                                    });
                                                }}
                                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3 h-3 cursor-pointer"
                                            />
                                            <label htmlFor="select-all-warehouses" className="text-[9px] font-bold text-slate-500 dark:text-slate-400 cursor-pointer select-none uppercase tracking-wide">Select All</label>
                                        </div>
                                    </div>
                                    {/* Custom Multi-Select Dropdown for Warehouses */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsWarehouseDropdownOpen(!isWarehouseDropdownOpen);
                                                setIsOutletsDropdownOpen(false);
                                            }}
                                            className="w-full bg-white dark:bg-[#1a1d26] text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/60 rounded-md px-3 py-2 text-[12px] flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        >
                                            <span className="truncate text-slate-500 dark:text-slate-400 font-medium">
                                                {formData.assigned_warehouses.length > 0 
                                                    ? `${formData.assigned_warehouses.length} warehouse(s) selected` 
                                                    : "Warehouse"}
                                            </span>
                                            <span className="text-slate-400 text-[10px]">▼</span>
                                        </button>
                                        {isWarehouseDropdownOpen && (
                                            <div className="absolute z-[110] left-0 right-0 mt-1 bg-white dark:bg-[#1a1d26] border border-slate-300 dark:border-slate-700 rounded-md shadow-lg p-2 text-slate-900 dark:text-slate-100 text-[12px] space-y-1">
                                                <label className="flex items-center gap-2 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded cursor-pointer select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.assigned_warehouses.includes("Central Warehouse")}
                                                        onChange={() => {
                                                            const isChecked = formData.assigned_warehouses.includes("Central Warehouse");
                                                            if (isChecked) {
                                                                setFormData({
                                                                    ...formData,
                                                                    assigned_warehouses: formData.assigned_warehouses.filter(w => w !== "Central Warehouse")
                                                                });
                                                            } else {
                                                                setFormData({
                                                                    ...formData,
                                                                    assigned_warehouses: [...formData.assigned_warehouses, "Central Warehouse"]
                                                                });
                                                            }
                                                        }}
                                                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                                                    />
                                                    <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">Central Warehouse</span>
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-[#181d2a] border-t border-slate-200 dark:border-slate-800/80 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="bg-[#d32f2f] hover:bg-[#b71c1c] text-white text-[11px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-md transition-colors shadow-lg shadow-rose-600/10">Cancel</button>
                            <button type="submit" className="bg-[#0e5c3e] hover:bg-[#0c4e34] text-white text-[11px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-md transition-colors shadow-lg shadow-emerald-600/10">{isEditing ? 'Update' : 'Create'}</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Success Dialogue - Centered & Auto-dismiss */}
            {showSuccess && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#1e2129] w-full max-w-xs rounded-xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden p-10 text-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-emerald-500/5">
                            <Check className="w-12 h-12" />
                        </div>
                        <h4 className="text-[20px] font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">Success !</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em]">Registry Updated Successfully</p>
                    </div>
                </div>
            )}

            {/* Error Notification Dialogue */}
            {notification && notification.type === 'error' && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#1e2129] w-full max-w-sm rounded-xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden p-6 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-rose-100 text-rose-600">
                            <X className="w-8 h-8" />
                        </div>
                        <h4 className="text-[14px] font-bold text-slate-800 dark:text-white uppercase tracking-tight mb-2">Attention</h4>
                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-wide leading-relaxed">{notification.message}</p>
                        <button 
                            onClick={() => setNotification(null)}
                            className="w-full py-2.5 bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/20 text-white dark:text-white rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] transition-all"
                        >
                            Acknowledge
                        </button>
                    </div>
                </div>
            )}

            {/* Custom Confirmation Dialogue */}
            {confirmation && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#1e2129] w-full max-w-md rounded-xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 rounded-lg text-rose-600">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-[14px] font-bold text-slate-800 dark:text-white uppercase tracking-tight">{confirmation.title}</h4>
                                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wide leading-relaxed">{confirmation.message}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmation(null)} className="flex-1 py-2.5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] transition-all">Abort</button>
                            <button onClick={confirmation.onConfirm} className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-lg shadow-rose-600/20">Confirm Deletion</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Store Access Manager Modal */}
            {activeStoreAccessUserId && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#12151e] w-full max-w-6xl h-[90vh] rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
                        <StoreAccessManager userId={activeStoreAccessUserId} onClose={() => setActiveStoreAccessUserId(null)} />
                    </div>
                </div>
            )}

            {/* POS Access Manager Modal */}
            {activePosAccessUserId && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#12151e] w-full max-w-6xl h-[90vh] rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
                        <POSAccessManager userId={activePosAccessUserId} onClose={() => setActivePosAccessUserId(null)} />
                    </div>
                </div>
            )}

            {/* MPOS Access Manager Modal */}
            {activeMposAccessUserId && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#12151e] w-full max-w-6xl h-[90vh] rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
                        <MPOSAccessManager userId={activeMposAccessUserId} onClose={() => setActiveMposAccessUserId(null)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default OutletUserManager;
