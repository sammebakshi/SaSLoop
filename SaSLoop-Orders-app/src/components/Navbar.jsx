import React from 'react';
import { Volume2, VolumeX, Store, LogOut, Radio } from 'lucide-react';
import IosThemeToggle from './IosThemeToggle';

const Navbar = ({ activeOutlet, isMuted, onToggleMute, onLogout, unreadCount, isDarkMode, onToggleTheme }) => {
  return (
    <header className={`sticky top-0 z-40 ${isDarkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-emerald-100'} backdrop-blur-xl border-b px-4 py-2.5 flex items-center justify-between shadow-lg transition-colors`}>
      {/* Brand & Outlet Info */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src="/logo.png"
            alt="SaSLoop Logo"
            className="w-10 h-10 object-contain rounded-2xl bg-white p-1 border border-emerald-200 shadow-md"
          />
          <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-950"></span>
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className={`font-black text-sm tracking-tight flex items-center gap-1.5 ${isDarkMode ? 'text-white' : 'text-emerald-950'}`}>
              <span>SaSLoop</span>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                ORDERS
              </span>
            </h1>
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce shadow-md shadow-rose-500/30">
                🔥 {unreadCount} NEW
              </span>
            )}
          </div>

          <p className={`text-[11px] font-semibold mt-0.5 flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-emerald-700'}`}>
            <Store size={12} className="text-emerald-500 shrink-0" />
            <span className="truncate max-w-[130px] font-bold">{activeOutlet?.name || 'Main Outlet'}</span>
          </p>
        </div>
      </div>

      {/* Control Buttons & iOS Theme Switcher */}
      <div className="flex items-center gap-2">
        {/* iOS Theme Switcher Toggle */}
        <IosThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />

        {/* Audio Alert Mute / Unmute Toggle */}
        <button
          onClick={onToggleMute}
          className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-1.5 ${
            isMuted
              ? isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black border-emerald-500 shadow-md shadow-emerald-600/30 active:scale-95'
          }`}
          title={isMuted ? 'Unmute Sound Alerts' : 'Mute Sound Alerts'}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className={`p-2.5 rounded-2xl ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:text-rose-600'} border transition-all cursor-pointer active:scale-95`}
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
