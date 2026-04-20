import React, { useState, useEffect, useRef, useCallback } from "react";
import API_BASE from "../config";
import { Link, useLocation, Outlet } from "react-router-dom";
import { 
  LayoutDashboard, 
  MenuSquare, 
  ShoppingBag, 
  Users, 
  Settings,
  LogOut,
  Store,
  Menu,
  Key,
  Lock,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  CheckCircle2,
  Megaphone,
  Bot,
  MessageSquare,
  BookOpen,
  Shield,
  LifeBuoy,
  Package,
  Activity,
  Smartphone,
  Bell,
  BarChart3
} from "lucide-react";

const SaSLoopLogo = () => (
  <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1.5 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">
    <defs>
      <linearGradient id="waGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="loopGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#a78bfa" />
        <stop offset="50%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#34d399" />
      </linearGradient>
    </defs>

    {/* WhatsApp Chat Bubble Silhouette */}
    <path d="M 18,50 C 18,30 32,16 50,16 C 68,16 82,30 82,50 C 82,70 68,84 50,84 C 44,84 38,82 34,79 L 18,84 L 22,70 C 19.5,64 18,57 18,50 Z" 
          stroke="url(#waGradient)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="rgba(16,185,129,0.05)" />

    {/* Automation / AI Loop Core */}
    <path d="M 36 50 C 36 40, 48 40, 50 50 C 52 60, 64 60, 64 50 C 64 40, 52 40, 50 50 C 48 60, 36 60, 36 50 Z" 
          stroke="url(#loopGradient)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" className="animate-[pulse_2s_ease-in-out_infinite]" />
  </svg>
);

// ── Web Audio API notification chime ────────
let audioCtx = null;
let audioUnlocked = false;

function ensureAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  audioUnlocked = true;
  return audioCtx;
}

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const [waStatus, setWaStatus] = useState("OFFLINE");
  
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
  const [manageUsersOpen, setManageUsersOpen] = useState(false);
  const [businessDataOpen, setBusinessDataOpen] = useState(false);
  
  const location = useLocation();

  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem("globalSound") === "true");
  const lastChatCount = useRef(0);
  const lastOrderCount = useRef(0);
  const isInitialFetch = useRef(true);

  // Reliable oscillator chime
  const playNotification = useCallback(() => {
     if (!soundEnabled) return;
     try {
        const ctx = ensureAudioContext();
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
  }, [soundEnabled]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token || !userData) {
      window.location.href = "/";
      return;
    }
    setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    const impersonateId = sessionStorage.getItem("impersonate_id");
    if (user && (user.role === 'user' || impersonateId)) {
      const checkStatus = async () => {
        try {
          const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
          const reqOpt = { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } };
          
          const p1 = fetch(`${API_BASE}/api/instance/status${targetParam}`, reqOpt);
          const p2 = fetch(`${API_BASE}/api/whatsapp/notif-counts`, reqOpt);
          const p3 = fetch(`${API_BASE}/api/orders`, reqOpt);

          const [res1, res2, res3] = await Promise.all([p1, p2, p3].map(p => p.catch(() => null)));
          
          if (res1 && res1.ok) {
            setWaStatus((await res1.json()).status);
          }
          if (res2 && res2.ok) {
            const data2 = await res2.json();
            if (!isInitialFetch.current && data2.chats > lastChatCount.current) { playNotification(); }
            lastChatCount.current = data2.chats;
          }
          if (res3 && res3.ok) {
            const data3 = await res3.json();
             const pending = Array.isArray(data3) ? data3.filter(o => ["CONFIRMED","PENDING","pending"].includes(o.status)).length : 0;
             if (!isInitialFetch.current && pending > lastOrderCount.current) { playNotification(); }
             lastOrderCount.current = pending;
          }

          if (isInitialFetch.current) {
             isInitialFetch.current = false;
          }
        } catch (err) {}
      };
      checkStatus();
      const interval = setInterval(checkStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [user, playNotification]);

  const handleLogout = () => {
    setConfirmDialog({
      message: "Are you sure you want to sign out? Any unsaved changes in open windows will be lost.",
      onConfirm: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
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
      setErrorMsg("Password must be at least 8 characters with 1 capital, 1 small, 1 numeric and 1 symbol.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setErrorMsg("New password and confirm password do not match.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword: oldPwd, newPassword: newPwd }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Password changed successfully!");
        setOldPwd("");
        setNewPwd("");
        setConfirmPwd("");
        setTimeout(() => {
          setIsChangePwdOpen(false);
          setSuccessMsg("");
        }, 1500);
      } else {
        setErrorMsg(data.error || data.message || "Failed to change password");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Server error");
    }
  };

  const getNavItems = (role) => {
    if (role === 'master_admin') {
        return [
          { name: "Master Dashboard", path: "/master-dashboard", icon: LayoutDashboard },
          { name: "Manage Users", path: "#", icon: Users, isDropdown: true, isOpenState: manageUsersOpen, setOpenState: setManageUsersOpen, subItems: [
              { name: "Add Admin", path: "/master-dashboard#add-admin" },
              { name: "Add Business", path: "/master-dashboard#add-business" },
              { name: "Manage Admins", path: "/master-dashboard#manage-admins" },
              { name: "Manage Businesses", path: "/master-dashboard#manage-businesses" },
          ]},
          { name: "Audit Logs", path: "/audit-logs", icon: Shield },
          { name: "System Health", path: "/system-health", icon: Activity },
          { name: "Broadcast Hub", path: "/broadcast", icon: MenuSquare },
          { name: "Support Desk", path: "/support-desk", icon: LifeBuoy },
          { name: "WhatsApp Connect", path: "/whatsapp-connect", icon: MessageSquare },
          { name: "Platform Settings", path: "/platform-settings", icon: Settings },
        ];
    } else if (role && role.startsWith('admin')) {
        return [
          { name: "Admin Dashboard", path: "/admin-dashboard", icon: LayoutDashboard },
          { name: "Manage Clients", path: "#", icon: Users, isDropdown: true, isOpenState: manageUsersOpen, setOpenState: setManageUsersOpen, subItems: [
              { name: "Add Business", path: "/admin-dashboard#add-business" },
              { name: "View All Businesses", path: "/admin-dashboard#manage-businesses" },
          ]},
          { name: "WhatsApp Connect", path: "/whatsapp-connect", icon: MessageSquare },
          { name: "Support Desk", path: "/support-desk", icon: LifeBuoy },
        ];
    } else { // business user
        return [
          { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
          { name: "Broadcast Hub", path: "/broadcast", icon: Megaphone },
          { name: "Business Data", path: "#", icon: BookOpen, isDropdown: true, isOpenState: businessDataOpen, setOpenState: setBusinessDataOpen, subItems: [
              { name: "Manage Profile", path: "/setup-business" },
              { name: "Operational Rules", path: "/business-data/rules" },
              { name: "Freeform Knowledge", path: "/business-data/knowledge" },
              { name: "Menu & Catalog", path: "/business-data/catalog" },
              { name: "QR Code Manager", path: "/business-data/qr" },
          ]},
          { name: "Live Chats", path: "/chats", icon: MessageSquare },
          { name: "Order Board", path: "/orders", icon: Package },
          { name: "Reports", path: "/reports", icon: BarChart3 },
          { name: "Customer Growth", path: "/crm", icon: Users },
          { name: "Mobile App Hub", path: "/mobile-app", icon: Smartphone },
          { name: "Help & Support", path: "/support", icon: LifeBuoy },
        ];
    }
  };

  const navItems = getNavItems(user?.role);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'master_admin': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="h-screen w-full bg-white text-slate-600 flex overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transform transition-all duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${desktopSidebarCollapsed ? 'lg:w-[72px]' : 'lg:w-[240px]'} w-[240px]`}>
        <div className={`h-14 flex flex-shrink-0 items-center justify-end border-b border-slate-200 px-5`}>
            {/* Empty space matching topbar height, can add a collapse button here later */}
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
          <div className={`px-2 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${desktopSidebarCollapsed ? 'lg:opacity-0' : 'lg:opacity-100'}`}>Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            if (item.isDropdown) {
               const isOpen = item.isOpenState;
               const setOpen = item.setOpenState;
               
               return (
                  <div key={item.name} className="space-y-1">
                     <button
                        onClick={() => setOpen(!isOpen)}
                        className={`w-full group flex items-center py-2 text-[13px] font-medium rounded-lg transition-colors overflow-hidden ${
                           isOpen 
                             ? 'bg-emerald-500/5 text-emerald-500' 
                             : 'text-slate-400 hover:bg-slate-100/50 hover:text-slate-700'
                         } ${desktopSidebarCollapsed ? 'lg:px-0 lg:justify-center' : 'px-3'}`}
                     >
                        <div className="flex items-center">
                           <Icon className={`h-4 w-4 shrink-0 transition-all duration-300 ${isOpen ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-400'} ${desktopSidebarCollapsed ? 'mr-0' : 'mr-2.5'}`} />
                           <span className={`whitespace-nowrap transition-all duration-300 ${desktopSidebarCollapsed ? 'lg:w-0 lg:opacity-0' : 'lg:w-auto lg:opacity-100'}`}>{item.name}</span>
                        </div>
                     </button>
                     {isOpen && !desktopSidebarCollapsed && (
                        <div className="pl-9 space-y-1 mt-1">
                           {item.subItems.map(sub => {
                              const isSubActive = location.pathname + location.hash === sub.path;
                              return (
                                 <Link 
                                    key={sub.name}
                                    to={sub.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`block py-1.5 text-xs transition-colors font-semibold ${isSubActive ? 'text-emerald-500' : 'text-slate-500 hover:text-emerald-400'}`}
                                 >
                                    {sub.name}
                                 </Link>
                              );
                           })}
                        </div>
                     )}
                  </div>
               );
            }

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                title={desktopSidebarCollapsed ? item.name : ""}
                className={`group flex items-center py-2 text-[13px] font-medium rounded-lg transition-colors overflow-hidden ${
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : 'text-slate-400 hover:bg-slate-100/50 hover:text-slate-700'
                } ${desktopSidebarCollapsed ? 'lg:px-0 lg:justify-center' : 'px-3'}`}
              >
                <Icon className={`h-4 w-4 shrink-0 transition-all duration-300 ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-400'} ${desktopSidebarCollapsed ? 'mr-0' : 'mr-2.5'}`} />
                <span className={`whitespace-nowrap transition-all duration-300 ${desktopSidebarCollapsed ? 'lg:w-0 lg:opacity-0' : 'lg:w-auto lg:opacity-100'}`}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-200 space-y-1 overflow-hidden">
           <button
              onClick={() => setIsChangePwdOpen(true)}
              title={desktopSidebarCollapsed ? "Change Password" : ""}
              className={`flex items-center w-full py-2 text-[13px] font-medium text-slate-400 rounded-lg hover:bg-slate-100 hover:text-emerald-400 transition-colors ${desktopSidebarCollapsed ? 'lg:px-0 lg:justify-center' : 'px-3 justify-start'}`}
           >
              <Key className={`h-4 w-4 opacity-70 shrink-0 transition-all duration-300 ${desktopSidebarCollapsed ? 'mr-0' : 'mr-2'}`} />
              <span className={`whitespace-nowrap transition-all duration-300 ${desktopSidebarCollapsed ? 'lg:w-0 lg:opacity-0' : 'lg:w-auto lg:opacity-100'}`}>Change Password</span>
           </button>
           <button
              onClick={handleLogout}
              title={desktopSidebarCollapsed ? "Sign out" : ""}
              className={`flex items-center w-full py-2 text-[13px] font-medium text-slate-400 rounded-lg hover:bg-slate-100 hover:text-red-400 transition-colors ${desktopSidebarCollapsed ? 'lg:px-0 lg:justify-center' : 'px-3 justify-start'}`}
           >
              <LogOut className={`h-4 w-4 opacity-70 shrink-0 transition-all duration-300 ${desktopSidebarCollapsed ? 'mr-0' : 'mr-2'}`} />
              <span className={`whitespace-nowrap transition-all duration-300 ${desktopSidebarCollapsed ? 'lg:w-0 lg:opacity-0' : 'lg:w-auto lg:opacity-100'}`}>Sign out</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50 relative">
        {/* Impersonation Banner */}
        {sessionStorage.getItem('impersonate_id') && (
           <div className="h-10 bg-indigo-600 text-white flex items-center justify-center gap-4 px-4 shadow-inner relative z-[60]">
              <div className="flex items-center gap-2">
                 <Shield className="w-3.5 h-3.5 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Viewing Dashboard As: <span className="bg-white text-indigo-600 px-2 py-0.5 rounded ml-1">{sessionStorage.getItem('impersonate_name')}</span></span>
              </div>
              <button 
                onClick={() => {
                   sessionStorage.removeItem('impersonate_id');
                   sessionStorage.removeItem('impersonate_name');
                   window.location.href = user.role === 'master_admin' ? '/master-dashboard' : '/admin-dashboard';
                }}
                className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-[10px] font-bold border border-white/20 transition-all uppercase tracking-tighter"
              >
                Exit Preview
              </button>
           </div>
        )}

        {/* Topbar */}
        <header className="relative h-14 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 bg-white/50 backdrop-blur-md border-b border-slate-200 z-10">
          {/* Centered dynamic Page Title */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden sm:block">
            <h1 className="font-semibold text-slate-700 capitalize text-[15px] tracking-wide whitespace-nowrap">
              {location.pathname.replace('/', '').replace('-', ' ') || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center">
            <button 
              className="p-1.5 -ml-1.5 mr-2 text-slate-400 hover:bg-slate-100 rounded-md transition-colors"
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  setDesktopSidebarCollapsed(!desktopSidebarCollapsed);
                } else {
                  setSidebarOpen(!sidebarOpen);
                }
              }}
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* App Name after hamburger */}
            <div className="flex items-center mr-4">
              <div className="scale-75 -ml-2 -mr-1">
                <SaSLoopLogo />
              </div>
              <span className="text-base font-bold text-slate-800 tracking-wide">SaS Loop AI</span>
            </div>


          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center gap-4">
                
                {(user.role === 'user' || sessionStorage.getItem('impersonate_id')) && (
                  <div className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase border ${waStatus === 'CONNECTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`} title="WhatsApp Gateway">
                    {waStatus === 'CONNECTED' ? (
                       <><Bot className="w-3.5 h-3.5" /> <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" /> Linked</>
                    ) : (
                       <><Bot className="w-3.5 h-3.5 opacity-50" /> <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" /> Offline</>
                    )}
                  </div>
                )}

                {(user.role === 'user' || sessionStorage.getItem('impersonate_id')) && (
                   <button 
                       onClick={() => {
                           ensureAudioContext();
                           const newVal = !soundEnabled;
                           setSoundEnabled(newVal);
                           localStorage.setItem("globalSound", newVal);
                           if (newVal) playNotification(); 
                       }}
                       className={`p-1.5 rounded-md transition-all border ${soundEnabled ? 'text-emerald-500 hover:bg-emerald-50 border-emerald-200' : 'text-slate-400 hover:bg-slate-100 border-transparent'}`}
                       title={soundEnabled ? "Notifications On" : "Notifications Off"}
                   >
                     <Bell className="w-4 h-4" />
                   </button>
                )}

                <button 
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors border border-transparent hover:border-rose-500/20"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 overflow-auto bg-slate-50/50 custom-scrollbar p-4 lg:p-6 relative">
          <div className="max-w-[1600px] mx-auto h-full flex flex-col">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Change Password Modal */}
      {isChangePwdOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" onClick={() => {
             setIsChangePwdOpen(false);
             setErrorMsg("");
             setSuccessMsg("");
          }} />
          <div className="relative w-full max-w-[420px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden transform transition-all">
            {/* Header */}
            <div className="h-28 bg-gradient-to-br from-slate-900 to-slate-800 relative flex items-center justify-center overflow-hidden">
              <button 
                onClick={() => {
                   setIsChangePwdOpen(false);
                   setErrorMsg("");
                   setSuccessMsg("");
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2694&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
              <div className="z-10 text-center">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
                   <Key className="w-6 h-6 text-emerald-400" />
                   Change Password
                </h2>
                <p className="text-emerald-400 font-mono text-xs mt-1 uppercase tracking-widest truncate max-w-full px-4">
                   Secure your account
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="p-8 pb-10 space-y-5">
              {/* Info UI instead of alerts */}
              {errorMsg && (
                <div className="bg-red-50 text-red-600 text-[13px] p-3 rounded-xl border border-red-100 flex items-start gap-2 animate-[pulse_0.4s_ease-in-out]">
                   <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                   <span className="font-medium">{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="bg-emerald-50 text-emerald-600 text-[13px] p-3 rounded-xl border border-emerald-100 flex items-center gap-2 animate-[pulse_0.4s_ease-in-out]">
                   <CheckCircle2 className="w-4 h-4 shrink-0" />
                   <span className="font-medium">{successMsg}</span>
                </div>
              )}

              {/* Old Password */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  className="w-full py-4 pl-12 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 outline-none text-sm font-medium focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                  type={showOld ? "text" : "password"}
                  placeholder="Old Password"
                  value={oldPwd}
                  onChange={(e) => setOldPwd(e.target.value)}
                />
                <button 
                  onClick={() => setShowOld(!showOld)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  type="button"
                >
                  {showOld ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>

              {/* New Password & Meter */}
              <div className="space-y-2">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    className="w-full py-4 pl-12 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 outline-none text-sm font-medium focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                    type={showNew ? "text" : "password"}
                    placeholder="New Password"
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                  />
                  <button 
                    onClick={() => setShowNew(!showNew)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    type="button"
                  >
                    {showNew ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Strength Meter */}
                {newPwd.length > 0 && (
                  <div className="px-2 pt-1">
                    <div className="flex gap-1 h-1.5 w-full">
                      {[1, 2, 3, 4, 5].map((level) => {
                         const strength = calculateStrength(newPwd);
                         let bgColor = "bg-slate-200";
                         if (level <= strength) {
                           if (strength <= 2) bgColor = "bg-red-400";
                           else if (strength === 3) bgColor = "bg-amber-400";
                           else if (strength === 4) bgColor = "bg-emerald-400";
                           else if (strength === 5) bgColor = "bg-emerald-500";
                         }
                         return (
                           <div key={level} className={`h-full flex-1 rounded-full transition-colors duration-300 ${bgColor}`} />
                         );
                      })}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium tracking-wide mt-1.5 text-right uppercase">
                      {calculateStrength(newPwd) <= 2 && "Weak"}
                      {calculateStrength(newPwd) === 3 && "Fair"}
                      {calculateStrength(newPwd) === 4 && "Good"}
                      {calculateStrength(newPwd) === 5 && "Strong"}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  className="w-full py-4 pl-12 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 outline-none text-sm font-medium focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                />
                <button 
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  type="button"
                >
                  {showConfirm ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleChangePasswordSubmit}
                  className="w-full bg-white hover:bg-slate-100 text-slate-900 font-semibold py-4 rounded-2xl transition-all shadow-[0_4px_14px_0_rgba(15,23,42,0.2)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG */}
      {confirmDialog && (
         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setConfirmDialog(null)} />
           <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-8 text-center">
                 <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500">
                    <AlertCircle className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Wait a second...</h3>
                 <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">{confirmDialog.message}</p>
                 <div className="flex gap-3">
                    <button 
                       onClick={() => setConfirmDialog(null)}
                       className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl transition-all active:scale-95"
                    >
                       Cancel
                    </button>
                    <button 
                       onClick={confirmDialog.onConfirm}
                       className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-rose-500/20 active:scale-95"
                    >
                       Sign out
                    </button>
                 </div>
              </div>
           </div>
         </div>
      )}

    </div>
  );
};

export default Layout;