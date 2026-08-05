import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Store, User, LogOut, Play, ShieldCheck, Check, Bell } from 'lucide-react';
import { authService } from '../services/api';
import audioEngine from '../services/audioService';

const Settings = ({ user, activeOutlet, onOutletChange, isMuted, onToggleMute, onLogout, isDarkMode }) => {
  const [outlets, setOutlets] = useState([]);
  const [loadingOutlets, setLoadingOutlets] = useState(false);

  useEffect(() => {
    const loadOutlets = async () => {
      setLoadingOutlets(true);
      try {
        const list = await authService.getOutlets();
        if (Array.isArray(list) && list.length > 0) {
          setOutlets(list);
        }
      } catch (e) {
        console.error('Error fetching outlets:', e);
      } finally {
        setLoadingOutlets(false);
      }
    };
    loadOutlets();
  }, []);

  return (
    <div className="pb-24 pt-4 px-4 space-y-6">
      <div className={`border-b pb-3 ${isDarkMode ? 'border-zinc-800' : 'border-slate-200'}`}>
        <h2 className={`font-black text-xl ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>App Settings & Controls</h2>
        <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Configure alert sounds, switch active outlet, and manage session</p>
      </div>

      {/* Audio Sound Alert Test & Toggle Card */}
      <div className={`rounded-3xl p-5 space-y-4 border transition-all ${
        isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-900 shadow-md'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-orange-500/20 text-orange-500 border border-orange-500/30">
            <Bell size={22} />
          </div>
          <div>
            <h3 className={`font-extrabold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Sound Chime Alert Engine</h3>
            <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Continuous ringing sound when new orders arrive</p>
          </div>
        </div>

        <div className={`flex items-center justify-between pt-2 border-t ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}`}>
          <div>
            <span className={`text-xs font-bold block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Alert Sound Status</span>
            <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-zinc-500' : 'text-slate-500'}`}>
              {isMuted ? 'Muted (Silent Mode)' : 'Active (Rings on New Item)'}
            </span>
          </div>

          <button
            onClick={onToggleMute}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center gap-2 ${
              isMuted
                ? isDarkMode
                  ? 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white'
                  : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900'
                : 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/30'
            }`}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span>{isMuted ? 'Unmute Sound' : 'Mute Sound'}</span>
          </button>
        </div>

        <button
          onClick={() => audioEngine.testSound()}
          className={`w-full py-3 rounded-2xl font-extrabold text-xs border transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
            isDarkMode
              ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
          }`}
        >
          <Play size={14} className="text-orange-500 fill-orange-500" />
          <span>Test Alert Ringtone Volume</span>
        </button>
      </div>

      {/* Outlet Switcher Card */}
      <div className={`rounded-3xl p-5 space-y-3 border transition-all ${
        isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-900 shadow-md'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-500 border border-blue-500/30">
            <Store size={22} />
          </div>
          <div>
            <h3 className={`font-extrabold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Active Restaurant Outlet</h3>
            <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Select which outlet feed to monitor</p>
          </div>
        </div>

        {loadingOutlets ? (
          <p className={`text-xs py-2 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>Loading brand outlets...</p>
        ) : outlets.length > 0 ? (
          <div className="space-y-2 pt-1">
            {outlets.map((o) => (
              <button
                key={o.id}
                onClick={() => onOutletChange(o)}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  activeOutlet?.id === o.id
                    ? 'bg-orange-500/10 border-orange-500 text-orange-600 font-extrabold'
                    : isDarkMode
                      ? 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-white font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 font-semibold'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Store size={16} className={activeOutlet?.id === o.id ? 'text-orange-500' : isDarkMode ? 'text-zinc-500' : 'text-slate-400'} />
                  <span className="text-xs">{o.name || `Outlet #${o.id}`}</span>
                </div>
                {activeOutlet?.id === o.id && <Check size={16} className="text-orange-500" />}
              </button>
            ))}
          </div>
        ) : (
          <div className={`p-3 rounded-2xl border text-xs font-semibold ${
            isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            Current Active Outlet: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{activeOutlet?.name || 'Main Restaurant'}</strong>
          </div>
        )}
      </div>

      {/* User Profile & Account */}
      <div className={`rounded-3xl p-5 space-y-4 border transition-all ${
        isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-900 shadow-md'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
            <User size={22} />
          </div>
          <div>
            <h3 className={`font-extrabold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Backoffice Account</h3>
            <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Logged in account session details</p>
          </div>
        </div>

        <div className={`rounded-2xl p-3.5 space-y-2 border text-xs font-semibold ${
          isDarkMode ? 'bg-zinc-950/60 border-zinc-850 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <div className="flex justify-between">
            <span className={isDarkMode ? 'text-zinc-500' : 'text-slate-400'}>Username:</span>
            <span className={`font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user?.username || user?.email || 'Backoffice Staff'}</span>
          </div>
          <div className="flex justify-between">
            <span className={isDarkMode ? 'text-zinc-500' : 'text-slate-400'}>User ID:</span>
            <span className={`font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user?.id || 1}</span>
          </div>
          <div className="flex justify-between">
            <span className={isDarkMode ? 'text-zinc-500' : 'text-slate-400'}>App Version:</span>
            <span className="text-emerald-500 font-bold">v1.0.0 Live</span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full py-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 font-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <LogOut size={16} />
          <span>Sign Out from App</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
