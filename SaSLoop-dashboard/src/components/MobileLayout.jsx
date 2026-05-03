import React, { useState, useEffect, useCallback, useRef } from "react";
import API_BASE from "../config";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  BookOpen,
  MoreHorizontal,
  LogOut,
  Key,
  Lock,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  CheckCircle2,
  Settings,
  Store,
  Megaphone,
  Bot,
  QrCode,
  LifeBuoy,
  ChevronRight,
  BellDot,
  Bell,
  BarChart3,
  Monitor,
  Globe,
  Shield,
  Activity,
  Users
} from "lucide-react";
import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

// ================================================================
// 🎨 SaSLoop Logo (Mobile Compact)
// ================================================================
const SaSLoopLogo = () => (
  <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">
    <defs>
      <linearGradient id="waGradientM" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="loopGradientM" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#a78bfa" />
        <stop offset="50%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#34d399" />
      </linearGradient>
    </defs>
    <path d="M 18,50 C 18,30 32,16 50,16 C 68,16 82,30 82,50 C 82,70 68,84 50,84 C 44,84 38,82 34,79 L 18,84 L 22,70 C 19.5,64 18,57 18,50 Z"
      stroke="url(#waGradientM)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="rgba(16,185,129,0.05)" />
    <path d="M 36 50 C 36 40, 48 40, 50 50 C 52 60, 64 60, 64 50 C 64 40, 52 40, 50 50 C 48 60, 36 60, 36 50 Z"
      stroke="url(#loopGradientM)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" className="animate-[pulse_2s_ease-in-out_infinite]" />
  </svg>
);

// ================================================================
// 📱 MOBILE LAYOUT — Bottom Tab Navigation
// ================================================================
const MobileLayout = () => {
  const [user, setUser] = useState(null);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [notifCounts, setNotifCounts] = useState({ chats: 0, notifications: 0 });
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem("globalSound") === "true");
  const [waStatus, setWaStatus] = useState("OFFLINE");
  const [activeTab, setActiveTab] = useState(null);

  // Change Password State
  const [isChangePwdOpen, setIsChangePwdOpen] = useState(false);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token || !userData) {
      window.location.href = "/";
      return;
    }
    setUser(JSON.parse(userData));

    // Request Notification Permissions
    if (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.()) {
      LocalNotifications.requestPermissions();
    }
  }, []);

  // Track active tab from URL
  useEffect(() => {
    const path = location.pathname;
    if (path === "/dashboard") setActiveTab("dashboard");
    else if (path === "/orders") setActiveTab("orders");
    else if (path === "/chats") setActiveTab("chats");
    else if (path.startsWith("/business-data")) setActiveTab("menu");
    else setActiveTab("more");
  }, [location.pathname]);

  // Trigger Local Notification
  const triggerNotification = async (title, body) => {
    try {
      if (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.()) {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: title,
              body: body,
              id: 1,
              schedule: { at: new Date(Date.now() + 1000) },
              sound: 'beep.wav',
              attachments: null,
              actionTypeId: "",
              extra: null
            }
          ]
        });
        await Haptics.impact({ style: ImpactStyle.Heavy });
      }
    } catch (e) {
      console.error("Notification trigger error:", e);
    }
  };

  // Reliable oscillator chime
  const playNotification = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      [523.25, 659.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, now + i * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.4);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + i * 0.18);
        osc.stop(now + i * 0.18 + 0.4);
      });
    } catch (e) {
      console.error("Audio Notification Error:", e);
    }
  }, []);

  const lastChatCount = useRef(0);
  const chimeRef = useRef(null);
  const isInitialFetchOrders = useRef(true);
  const isInitialFetchChats = useRef(true);

  // Poll for notification badges
  const fetchBadges = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Fetch pending order count
      const ordersRes = await fetch(`${API_BASE}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        const pending = Array.isArray(data) ? data.filter(o => ["CONFIRMED","PENDING","pending"].includes(o.status)).length : 0;
        
        // Notify if new orders
        if (pending > newOrderCount) {
          triggerNotification("New Order Alert! 📦", `You have ${pending} pending orders.`);
          if (!isInitialFetchOrders.current && soundEnabled) playNotification();
        }
        setNewOrderCount(pending);
        if (isInitialFetchOrders.current) isInitialFetchOrders.current = false;
      }

      // Fetch WhatsApp status
      const statusRes = await fetch(`${API_BASE}/api/instance/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statusRes.ok) {
        const data = await statusRes.json();
        setWaStatus(data.status);
      }
    } catch (e) {
      // silent
    }
  }, [newOrderCount, soundEnabled, playNotification]);

  useEffect(() => {
    fetchBadges();
    const interval = setInterval(fetchBadges, 15000);
    return () => clearInterval(interval);
  }, [fetchBadges]);

  const handleLogout = () => {
    setConfirmDialog({
      message: "Sign out of SaSLoop on this device?",
      onConfirm: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    });
  };

  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const handleChangePasswordSubmit = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    if (!oldPwd || !newPwd || !confirmPwd) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    if (!pwdRegex.test(newPwd)) {
      setErrorMsg("Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol required.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setErrorMsg("Passwords don't match.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword: oldPwd, newPassword: newPwd })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Password changed!");
        setOldPwd(""); setNewPwd(""); setConfirmPwd("");
        setTimeout(() => { setIsChangePwdOpen(false); setSuccessMsg(""); }, 1500);
      } else {
        setErrorMsg(data.error || "Failed to change password");
      }
    } catch (err) {
      setErrorMsg("Server error");
    }
  };

  // ================================================================
  // 🗂️ Tab Configuration
  // ================================================================
  const getTabs = () => {
    const role = user?.role;
    if (role === 'master_admin') {
      return [
        { id: "dashboard", label: "Master", icon: LayoutDashboard, path: "/master-dashboard" },
        { id: "users", label: "Users", icon: Users, path: "/master-dashboard#manage-businesses" },
        { id: "broadcast", label: "Blast", icon: Megaphone, path: "/broadcast" },
        { id: "more", label: "More", icon: MoreHorizontal, action: () => setMoreMenuOpen(true) },
      ];
    } else if (role?.startsWith('admin')) {
      return [
        { id: "dashboard", label: "Admin", icon: LayoutDashboard, path: "/admin-dashboard" },
        { id: "clients", label: "Clients", icon: Users, path: "/admin-dashboard#manage-businesses" },
        { id: "broadcast", label: "Blast", icon: Megaphone, path: "/broadcast" },
        { id: "more", label: "More", icon: MoreHorizontal, action: () => setMoreMenuOpen(true) },
      ];
    } else {
      const baseTabs = [
        { id: "dashboard", label: "Home", icon: LayoutDashboard, path: "/dashboard" },
        { id: "orders", label: "Orders", icon: Package, path: "/orders", badge: newOrderCount },
        { id: "chats", label: "Chats", icon: MessageSquare, path: "/chats", badge: notifCounts.chats },
        { id: "reports", label: "Reports", icon: BarChart3, path: "/reports" },
      ];
      baseTabs.push({ id: "more", label: "More", icon: MoreHorizontal, action: () => setMoreMenuOpen(true) });
      return baseTabs;
    }
  };

  const tabs = getTabs();

  // ================================================================
  // 📋 "More" Menu Items
  // ================================================================
  const getMoreItems = () => {
    const role = user?.role;
    const baseItems = [
      { label: "Change Password", icon: Key, action: () => { setIsChangePwdOpen(true); setMoreMenuOpen(false); } },
      { label: "Sign Out", icon: LogOut, action: () => { handleLogout(); setMoreMenuOpen(false); }, danger: true }
    ];

    if (role === 'master_admin') {
      return [
        { label: "Global Command", icon: Globe, path: "/command-center" },
        { label: "Audit Logs", icon: Shield, path: "/audit-logs" },
        { label: "System Health", icon: Activity, path: "/system-health" },
        { label: "Support Desk", icon: LifeBuoy, path: "/support-desk" },
        { label: "WhatsApp Connect", icon: MessageSquare, path: "/whatsapp-connect" },
        ...baseItems
      ];
    } else if (role?.startsWith('admin')) {
      return [
        { label: "Global Command", icon: Globe, path: "/command-center" },
        { label: "Support Desk", icon: LifeBuoy, path: "/support-desk" },
        { label: "WhatsApp Connect", icon: MessageSquare, path: "/whatsapp-connect" },
        ...baseItems
      ];
    } else {
      return [
        { label: "Business Profile", icon: Store, path: "/setup-business" },
        { label: "AI Bot Setup", icon: Bot, path: "/bot-config" },
        { label: "Broadcast Hub", icon: Megaphone, path: "/broadcast" },
        { label: "Operational Rules", icon: Settings, path: "/business-data/rules" },
        { label: "Freeform Knowledge", icon: BookOpen, path: "/business-data/knowledge" },
        { label: "QR Code Manager", icon: QrCode, path: "/business-data/qr" },
        { label: "Help & Support", icon: LifeBuoy, path: "/support" },
        ...baseItems
      ];
    }
  };

  const moreItems = getMoreItems();

  const handleTabPress = (tab) => {
    if (tab.id === "more") {
      setMoreMenuOpen(true);
    } else if (tab.path) {
      navigate(tab.path);
    }
    // Haptic feedback for native
    if (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.()) {
      Haptics.impact({ style: ImpactStyle.Light });
    }
  };

  const getPageTitle = () => {
    const p = location.pathname;
    if (p === "/dashboard") return "Dashboard";
    if (p === "/orders") return "Live Orders";
    if (p === "/chats") return "Live Chats";
    if (p.includes("/catalog")) return "Menu & Catalog";
    if (p.includes("/rules")) return "Operational Rules";
    if (p.includes("/knowledge")) return "Knowledge Base";
    if (p.includes("/qr")) return "QR Manager";
    if (p.includes("/broadcast")) return "Broadcast Hub";
    if (p.includes("/setup-business")) return "Business Profile";
    if (p.includes("/support")) return "Help & Support";
    return "SaSLoop";
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/whatsapp/notif-counts`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await res.json();
        if (res.ok) {
           if (!isInitialFetchChats.current && data.chats > lastChatCount.current) {
              playNotification();
           }
           lastChatCount.current = data.chats;
           setNotifCounts(data);
           if (isInitialFetchChats.current) isInitialFetchChats.current = false;
        }
      } catch (e) {}
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 5000);
    return () => clearInterval(interval);
  }, [soundEnabled]);

  const markAsRead = async (type) => {
    try {
      await fetch(`${API_BASE}/api/whatsapp/mark-read`, {
        method: 'POST',
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ type })
      });
      setNotifCounts(prev => ({ ...prev, [type]: 0 }));
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 w-full flex flex-col bg-white overflow-hidden font-sans selection:bg-emerald-500/30">

      {/* 📱 MINIMAL TOP BAR */}
      <header className="h-14 flex-shrink-0 flex items-center justify-between px-4 bg-white border-b border-slate-100 z-30 safe-area-top shadow-sm">
        <div className="flex items-center gap-1.5 min-w-0">
          <SaSLoopLogo />
          <span className="text-[9px] font-black text-slate-800 uppercase tracking-tighter truncate">
            {getPageTitle()}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[7px] font-black tracking-wider uppercase border shrink-0 ${
            waStatus === 'CONNECTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}>
            <span className={`w-1 h-1 rounded-full ${waStatus === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'}`} />
            {waStatus === 'CONNECTED' ? 'Live' : 'Off'}
          </div>

          <div className="flex items-center gap-0.5 bg-slate-50 p-0.5 rounded-full border border-slate-100 ml-1">
            {/* Global Sound Toggle */}
            <button 
                onClick={() => {
                    const newVal = !soundEnabled;
                    setSoundEnabled(newVal);
                    localStorage.setItem("globalSound", newVal);
                    if (newVal) playNotification(); 
                }}
                className={`p-1.5 rounded-full transition-all ${soundEnabled ? 'text-emerald-500 bg-white shadow-sm' : 'text-slate-300'}`}
            >
              <Bell className="w-3.5 h-3.5" />
            </button>

            <div className="w-px h-3 bg-slate-200 mx-0.5"></div>

            {/* Chats Notification */}
            <button 
                onClick={() => { navigate("/chats"); markAsRead('chats'); }} 
                className={`p-1.5 rounded-full transition-all relative ${notifCounts.chats > 0 ? 'text-indigo-600' : 'text-slate-300'}`}
            >
               <MessageSquare className="w-3.5 h-3.5" />
               {notifCounts.chats > 0 && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>}
            </button>

            {/* System Alerts Notification */}
            <button 
                onClick={() => { markAsRead('notifications'); }} 
                className={`p-1.5 rounded-full transition-all relative ${notifCounts.notifications > 0 ? 'text-rose-500' : 'text-slate-300'}`}
            >
               <Bot className="w-3.5 h-3.5" />
               {notifCounts.notifications > 0 && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>}
            </button>
          </div>
        </div>
      </header>

      {/* 📄 CONTENT AREA */}
      <main className="flex-1 overflow-y-auto bg-white mobile-safe-scroll relative">
        <div className="min-h-full flex flex-col">
          <Outlet />
        </div>
      </main>

      {/* 📱 SLIM BOTTOM NAV */}
      <nav className="flex-shrink-0 bg-white border-t border-slate-50 safe-area-bottom z-50">
        <div className="flex items-stretch justify-around h-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabPress(tab)}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-all ${isActive ? 'text-emerald-600' : 'text-slate-300'}`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-emerald-50' : ''}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'scale-110' : ''}`} />
                </div>
                <span className={`text-[7px] font-black uppercase tracking-tight ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                  {tab.label}
                </span>
                {isActive && <div className="absolute top-0 w-4 h-0.5 bg-emerald-500 rounded-full" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ============================================ */}
      {/* 📋 "MORE" BOTTOM SHEET */}
      {/* ============================================ */}
      {moreMenuOpen && (
        <div className="fixed inset-0 z-[100]" onClick={() => setMoreMenuOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          {/* Sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] shadow-2xl max-h-[75vh] overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-slate-200 rounded-full" />
            </div>

            {/* User Info Header */}
            <div className="px-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-200">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-sm">{user?.name || "User"}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {user?.email || "Business Account"}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2 overflow-y-auto max-h-[50vh]">
              {moreItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else if (item.path) {
                        navigate(item.path);
                        setMoreMenuOpen(false);
                      }
                    }}
                    className={`w-full flex items-center gap-4 px-6 py-4 transition-all active:bg-slate-50 ${
                      item.danger ? "text-rose-500" : "text-slate-700"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      item.danger ? "bg-rose-50" : "bg-slate-50"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="flex-1 text-left text-sm font-bold">{item.label}</span>
                    {!item.danger && <ChevronRight className="w-4 h-4 text-slate-300" />}
                  </button>
                );
              })}
            </div>

            {/* Bottom Spacer for safe area */}
            <div className="h-8 safe-area-bottom" />
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* 🔐 CHANGE PASSWORD MODAL */}
      {/* ============================================ */}
      {isChangePwdOpen && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => {
            setIsChangePwdOpen(false); setErrorMsg(""); setSuccessMsg("");
          }} />
          <div className="relative w-full max-w-md bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="h-20 bg-gradient-to-br from-slate-900 to-slate-800 relative flex items-center justify-center overflow-hidden">
              <button onClick={() => {
                setIsChangePwdOpen(false); setErrorMsg(""); setSuccessMsg("");
              }} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-20">
                <X className="w-5 h-5" />
              </button>
              <div className="z-10 text-center">
                <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
                  <Key className="w-5 h-5 text-emerald-400" />
                  Change Password
                </h2>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="font-medium">{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="bg-emerald-50 text-emerald-600 text-xs p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-medium">{successMsg}</span>
                </div>
              )}

              {/* Old Password */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  className="w-full py-3.5 pl-11 pr-11 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none text-sm font-medium focus:border-emerald-500 transition-all"
                  type={showOld ? "text" : "password"}
                  placeholder="Old Password"
                  value={oldPwd}
                  onChange={(e) => setOldPwd(e.target.value)}
                />
                <button onClick={() => setShowOld(!showOld)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400" type="button">
                  {showOld ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              {/* New Password */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  className="w-full py-3.5 pl-11 pr-11 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none text-sm font-medium focus:border-emerald-500 transition-all"
                  type={showNew ? "text" : "password"}
                  placeholder="New Password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                />
                <button onClick={() => setShowNew(!showNew)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400" type="button">
                  {showNew ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Meter */}
              {newPwd.length > 0 && (
                <div className="px-1">
                  <div className="flex gap-1 h-1">
                    {[1, 2, 3, 4, 5].map((level) => {
                      const strength = calculateStrength(newPwd);
                      let bgColor = "bg-slate-200";
                      if (level <= strength) {
                        if (strength <= 2) bgColor = "bg-red-400";
                        else if (strength === 3) bgColor = "bg-amber-400";
                        else bgColor = "bg-emerald-500";
                      }
                      return <div key={level} className={`h-full flex-1 rounded-full transition-colors ${bgColor}`} />;
                    })}
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  className="w-full py-3.5 pl-11 pr-11 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none text-sm font-medium focus:border-emerald-500 transition-all"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                />
                <button onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400" type="button">
                  {showConfirm ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              <button
                onClick={handleChangePasswordSubmit}
                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95"
              >
                Update Password
              </button>
            </div>
            <div className="h-6 safe-area-bottom" />
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* ⚠️ CONFIRMATION DIALOG */}
      {/* ============================================ */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDialog(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-rose-500">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2">Confirm</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">{confirmDialog.message}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDialog(null)}
                  className="flex-1 bg-slate-100 text-slate-700 font-bold py-3.5 rounded-xl transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDialog.onConfirm}
                  className="flex-1 bg-rose-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-rose-500/20 active:scale-95"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileLayout;
