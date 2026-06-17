import React, { useState, useEffect } from "react";
import { 
  User, Mail, MapPin, Shield, 
  Moon, Sun, Camera, Save,
  Eye, EyeOff, Upload,
  UserCircle, Settings, MessageSquare, PhoneCall, Languages, ShieldCheck
} from "lucide-react";
import API_BASE from "../config";

const Profile = () => {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
        phone: "",
        whatsapp_number: "",
        username: "",
        id: "",
        logo_url: "",
        settings: {
            smsBrandFooter: false,
            whatsappActive: false,
            hostobookActive: false,
            language: "English",
            enable2FA: false
        }
    });

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("PROFILE");
    const [showPassword, setShowPassword] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") !== "light");
    const [message, setMessage] = useState(null);
    const [whatsappPicUrl, setWhatsappPicUrl] = useState(null);
    const [whatsappPicLoading, setWhatsappPicLoading] = useState(false);
    const [whatsappPicUploading, setWhatsappPicUploading] = useState(false);

    const fetchWhatsappPic = async () => {
        setWhatsappPicLoading(true);
        try {
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/whatsapp/profile-pic${targetParam}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setWhatsappPicUrl(data.profile_picture_url);
            }
        } catch (e) {
            console.error("Failed to fetch WhatsApp profile picture:", e);
        } finally {
            setWhatsappPicLoading(false);
        }
    };

    const handleWhatsappPicChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setWhatsappPicUploading(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const token = localStorage.getItem("token");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
            const res = await fetch(`${API_BASE}/api/whatsapp/profile-pic${targetParam}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });
            if (res.ok) {
                const data = await res.json();
                setWhatsappPicUrl(data.profile_picture_url);
                showToast("success", "WhatsApp profile picture updated successfully!");
            } else {
                const err = await res.json();
                showToast("error", err.error || "Failed to update WhatsApp profile picture.");
            }
        } catch (e) {
            console.error("WhatsApp photo upload error:", e);
            showToast("error", "Error uploading image to WhatsApp.");
        } finally {
            setWhatsappPicUploading(false);
        }
    };

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/auth/profile${targetParam}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const settings = data.business_details?.settings || {};
                setProfile({
                    name: data.name || "",
                    email: data.email || "",
                    address: data.address || "",
                    password: "",
                    phone: data.phone || "",
                    whatsapp_number: data.whatsapp_number || "",
                    username: data.username || "",
                    id: data.id || "",
                    logo_url: data.business_details?.logo_url || data.logo_url || "",
                    settings: {
                        smsBrandFooter: settings.smsBrandFooter || false,
                        whatsappActive: settings.whatsappActive || false,
                        hostobookActive: settings.hostobookActive || false,
                        language: settings.language || "English",
                        enable2FA: settings.enable2FA || false,
                    }
                });
            }
        } catch (e) {
            console.error("Failed to fetch profile:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (profile.settings?.whatsappActive) {
            fetchWhatsappPic();
        } else {
            setWhatsappPicUrl(null);
        }
    }, [profile.settings?.whatsappActive]);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/catalog/upload`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });
            if (res.ok) {
                const data = await res.json();
                setProfile(prev => ({
                    ...prev,
                    logo_url: data.url
                }));
                showToast("success", "Photo uploaded successfully!");
            } else {
                showToast("error", "Failed to upload logo.");
            }
        } catch (e) {
            console.error("Photo upload error:", e);
            showToast("error", "Error uploading logo file.");
        }
    };

    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        try {
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/auth/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    target_user_id: impersonateId || undefined,
                    name: profile.name,
                    email: profile.email,
                    address: profile.address,
                    password: profile.password || undefined,
                    phone: profile.phone,
                    whatsapp_number: profile.whatsapp_number,
                    logo_url: profile.logo_url,
                    settings: profile.settings
                })
            });
            if (res.ok) {
                showToast("success", "Profile configuration updated successfully!");
                fetchProfile();
            } else {
                const err = await res.json();
                showToast("error", err.error || "Failed to update profile config.");
            }
        } catch (e) {
            console.error(e);
            showToast("error", "Network error updating profile.");
        }
    };

    const showToast = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleSettingToggle = (key) => {
        setProfile(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                [key]: !prev.settings[key]
            }
        }));
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="animate-pulse text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
                    Loading Profile Parameters...
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Identity Card */}
                <div className="lg:col-span-4">
                    <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl p-8 flex flex-col items-center text-center space-y-6 shadow-xl relative overflow-hidden group">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-slate-100 dark:border-slate-800 p-1 hover:border-emerald-600 dark:hover:border-emerald-500 transition-all duration-500">
                                <div className="w-full h-full rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden relative">
                                    {profile.logo_url ? (
                                        <img src={profile.logo_url.startsWith('http') ? profile.logo_url : `${API_BASE}${profile.logo_url}`} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserCircle className="w-20 h-20 text-slate-400 dark:text-slate-600" />
                                    )}
                                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white">
                                        <Camera className="w-6 h-6" />
                                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-[18px] font-black text-slate-800 dark:text-white uppercase tracking-tight">{profile.name || "Enterprise Member"}</h2>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{profile.username || "Member"}</p>
                        </div>

                        <div className="w-full border-t border-slate-100 dark:border-white/5 pt-6 space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">TMPOS ID</span>
                                <span className="text-[11px] font-black text-slate-800 dark:text-white tracking-tighter">{profile.id || "000000"}</span>
                            </div>
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Username</span>
                                <span className="text-[11px] font-black text-slate-800 dark:text-white tracking-tighter">{profile.username || "member"}</span>
                            </div>
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Email</span>
                                <span className="text-[11px] font-black text-slate-600 dark:text-slate-400 tracking-tighter truncate max-w-[150px]">{profile.email || "support@sasloop.ai"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Configuration Matrix */}
                <div className="lg:col-span-8">
                    <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-xl overflow-hidden flex flex-col h-full">
                        {/* Tab Headers */}
                        <div className="flex border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black/20">
                            {[
                                { id: "PROFILE", label: "Profile" },
                                { id: "SETTINGS", label: "Settings" }
                            ].map(tab => (
                                <button 
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                                        activeTab === tab.id 
                                            ? 'bg-emerald-800 text-white' 
                                            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleUpdate} className="p-8 space-y-8 flex-1">
                            {activeTab === "PROFILE" && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Name</label>
                                            <div className="relative group">
                                                <input 
                                                    type="text" 
                                                    value={profile.name} 
                                                    onChange={e => setProfile({...profile, name: e.target.value})}
                                                    className="w-full h-11 px-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-600 transition-all" 
                                                />
                                                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Email</label>
                                            <div className="relative group">
                                                <input 
                                                    type="email" 
                                                    value={profile.email} 
                                                    onChange={e => setProfile({...profile, email: e.target.value})}
                                                    className="w-full h-11 px-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-600 transition-all" 
                                                />
                                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Contact Number (Bill)</label>
                                            <div className="relative group">
                                                <input 
                                                    type="text" 
                                                    value={profile.phone} 
                                                    onChange={e => setProfile({...profile, phone: e.target.value})}
                                                    className="w-full h-11 px-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-600 transition-all" 
                                                />
                                                <PhoneCall className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">WhatsApp Business Number</label>
                                            <div className="relative group">
                                                <input 
                                                    type="text" 
                                                    value={profile.whatsapp_number} 
                                                    onChange={e => setProfile({...profile, whatsapp_number: e.target.value})}
                                                    className="w-full h-11 px-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-600 transition-all" 
                                                />
                                                <MessageSquare className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Address</label>
                                        <div className="relative group">
                                            <textarea 
                                                value={profile.address} 
                                                onChange={e => setProfile({...profile, address: e.target.value})}
                                                className="w-full h-24 p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-600 transition-all resize-none" 
                                                placeholder="Enter physical location..." 
                                            />
                                            <MapPin className="absolute right-4 top-4 w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Password</label>
                                            <div className="relative group">
                                                <input 
                                                    type={showPassword ? "text" : "password"} 
                                                    value={profile.password}
                                                    onChange={e => setProfile({...profile, password: e.target.value})}
                                                    placeholder="Password" 
                                                    className="w-full h-11 px-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-600 transition-all" 
                                                />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 hover:text-slate-800 dark:hover:text-white transition-colors">
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            <p className="text-[8.5px] font-bold text-rose-500 uppercase tracking-wider px-1">Leave this field blank to keep your existing password</p>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between p-1">
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] font-bold text-slate-800 dark:text-white uppercase tracking-tight">Enable 2FA</p>
                                                    <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Multi-factor identity security</p>
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleSettingToggle("enable2FA")}
                                                    className={`w-10 h-5 rounded-full p-0.5 relative transition-all duration-300 ${
                                                        profile.settings.enable2FA ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-white/10'
                                                    }`}
                                                >
                                                    <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                                                        profile.settings.enable2FA ? 'translate-x-5' : 'translate-x-0'
                                                    }`} />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between p-1">
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] font-bold text-slate-800 dark:text-white uppercase tracking-tight">Theme</p>
                                                    <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Toggle dark / light spectrum</p>
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setDarkMode(!darkMode)}
                                                    className={`w-10 h-5 rounded-full p-0.5 relative transition-all duration-300 ${
                                                        darkMode ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-white/10'
                                                    }`}
                                                >
                                                    <div className={`w-4 h-4 rounded-full bg-white shadow-md flex items-center justify-center transform transition-transform duration-300 ${
                                                        darkMode ? 'translate-x-5' : 'translate-x-0'
                                                    }`}>
                                                        {darkMode ? <Moon className="w-2.5 h-2.5 text-blue-500" /> : <Sun className="w-2.5 h-2.5 text-amber-500" />}
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Photo</label>
                                        <div className="flex items-center gap-4">
                                            <label className="px-6 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer shadow-sm">
                                                <Upload className="w-4 h-4" /> Choose File
                                                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                                            </label>
                                            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase">
                                                {selectedFile ? selectedFile.name : "No file chosen"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "SETTINGS" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/50 dark:border-white/5">
                                        <div className="space-y-0.5 pr-4">
                                            <p className="text-[11px] font-bold text-slate-800 dark:text-white uppercase tracking-tight">Show the brand name in the footer of all SMS messages.</p>
                                            <p className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Append outlet identity suffix to outgoing text packages</p>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => handleSettingToggle("smsBrandFooter")}
                                            className={`w-10 h-5 rounded-full p-0.5 relative flex-shrink-0 transition-all duration-300 ${
                                                profile.settings.smsBrandFooter ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-white/10'
                                            }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                                                profile.settings.smsBrandFooter ? 'translate-x-5' : 'translate-x-0'
                                            }`} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/50 dark:border-white/5">
                                        <div className="space-y-0.5 pr-4">
                                            <p className="text-[11px] font-bold text-slate-800 dark:text-white uppercase tracking-tight">Activate WhatsApp Messaging</p>
                                            <p className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Trigger automated transactional alerts & marketing campaigns via WhatsApp</p>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => handleSettingToggle("whatsappActive")}
                                            className={`w-10 h-5 rounded-full p-0.5 relative flex-shrink-0 transition-all duration-300 ${
                                                profile.settings.whatsappActive ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-white/10'
                                            }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                                                profile.settings.whatsappActive ? 'translate-x-5' : 'translate-x-0'
                                            }`} />
                                        </button>
                                    </div>
                                    
                                    {profile.settings.whatsappActive && (
                                        <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/50 dark:border-white/5 space-y-4 animate-in fade-in duration-300">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-full border-2 border-slate-200 dark:border-white/10 p-0.5 overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                    {whatsappPicLoading ? (
                                                        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                                    ) : whatsappPicUrl ? (
                                                        <img src={whatsappPicUrl} alt="WhatsApp Profile" className="w-full h-full object-cover rounded-full" />
                                                    ) : (
                                                        <MessageSquare className="w-8 h-8 text-slate-400 dark:text-slate-600" />
                                                    )}
                                                </div>
                                                <div className="space-y-1 flex-1">
                                                    <p className="text-[11px] font-bold text-slate-800 dark:text-white uppercase tracking-tight">WhatsApp Profile Picture</p>
                                                    <p className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                        Recommended 640x640px JPEG/PNG (max 5MB)
                                                    </p>
                                                    <div className="flex items-center gap-3 pt-1">
                                                        <label className={`px-4 py-1.5 bg-emerald-800 hover:bg-emerald-950 text-[9px] font-black text-white uppercase tracking-widest rounded cursor-pointer transition-all flex items-center gap-1.5 shadow ${whatsappPicUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                                            {whatsappPicUploading ? (
                                                                <>Updating...</>
                                                            ) : (
                                                                <>
                                                                    <Upload className="w-3.5 h-3.5" /> Change WhatsApp Picture
                                                                </>
                                                            )}
                                                            <input 
                                                                type="file" 
                                                                accept="image/jpeg, image/png" 
                                                                className="hidden" 
                                                                onChange={handleWhatsappPicChange} 
                                                                disabled={whatsappPicUploading}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/50 dark:border-white/5">
                                        <div className="space-y-0.5 pr-4">
                                            <p className="text-[11px] font-bold text-slate-800 dark:text-white uppercase tracking-tight">Activate Hostobook Integration</p>
                                            <p className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Connect database with Hostobook accounting analytics engine</p>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => handleSettingToggle("hostobookActive")}
                                            className={`w-10 h-5 rounded-full p-0.5 relative flex-shrink-0 transition-all duration-300 ${
                                                profile.settings.hostobookActive ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-white/10'
                                            }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                                                profile.settings.hostobookActive ? 'translate-x-5' : 'translate-x-0'
                                            }`} />
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Language</label>
                                        <div className="relative group">
                                            <select 
                                                value={profile.settings.language}
                                                onChange={e => setProfile({
                                                    ...profile,
                                                    settings: {
                                                        ...profile.settings,
                                                        language: e.target.value
                                                    }
                                                })}
                                                className="w-full h-11 px-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-600 transition-all cursor-pointer appearance-none"
                                            >
                                                <option className="text-slate-900">English</option>
                                                <option className="text-slate-900">Spanish</option>
                                                <option className="text-slate-900">Arabic</option>
                                                <option className="text-slate-900">Hindi</option>
                                            </select>
                                            <Languages className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-600 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                                <button type="submit" className="px-10 py-3 bg-emerald-800 text-white rounded-lg font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-950 transition-all shadow-xl active:scale-95 flex items-center gap-3">
                                    <Save className="w-4 h-4" /> Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Platform Footer */}
            <div className="border-t border-slate-100 dark:border-white/5 py-4 flex flex-col md:flex-row items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                <p>Copyright © 2026-2027 <span className="text-blue-500">Powered by SaSLoop ERP | AI Technology</span>. All Rights Reserved.</p>
                <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <p>Version: <span className="text-slate-500 dark:text-slate-400">11.7.0</span></p>
                    <p className="text-blue-500/60 cursor-pointer">support@sasloop.ai</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
