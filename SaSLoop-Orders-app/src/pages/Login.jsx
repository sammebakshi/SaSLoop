import React, { useState, useEffect } from 'react';
import { Store, Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { authService } from '../services/api';
import audioEngine from '../services/audioService';
import IosThemeToggle from '../components/IosThemeToggle';

const Login = ({ onLoginSuccess, isDarkMode, onToggleTheme }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Guarantee all cached tokens & native background monitoring are completely wiped on Login screen
  useEffect(() => {
    try {
      localStorage.removeItem('sasloop_orders_token');
      localStorage.removeItem('sasloop_orders_user');
      sessionStorage.clear();
      if (window.AndroidNativeAuth && window.AndroidNativeAuth.clearAuthToken) {
        window.AndroidNativeAuth.clearAuthToken();
      }
    } catch (e) {
      console.error('Error clearing login credentials:', e);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter your Backoffice username and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      audioEngine.initContext();

      const data = await authService.login(username.trim(), password);
      if (data && data.token) {
        localStorage.setItem('sasloop_orders_token', data.token);
        localStorage.setItem('sasloop_orders_user', JSON.stringify(data.user || data));
        onLoginSuccess(data.token, data.user || data);
      } else {
        setError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-emerald-50/60 text-slate-900'} flex flex-col justify-center px-5 py-10 relative overflow-hidden transition-colors duration-200`}>
      {/* Top Bar with iPhone Theme Toggle */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          {isDarkMode ? '🌙 DARK' : '☀️ LIGHT'}
        </span>
        <IosThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
      </div>

      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-block relative">
            <img
              src="/logo.png"
              alt="SaSLoop Logo"
              className="w-20 h-20 object-contain mx-auto drop-shadow-2xl p-1.5 bg-white rounded-3xl border border-emerald-200/50 shadow-2xl"
            />
            <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full shadow-lg uppercase tracking-wider">
              ORDERS LIVE
            </span>
          </div>

          <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-emerald-950'}`}>
            SaSLoop Orders
          </h2>
          <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-emerald-700'}`}>
            Backoffice Access & Real-Time Alert Hub
          </p>
        </div>

        {/* Login Card */}
        <div className={`${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-emerald-100'} backdrop-blur-xl border p-6 rounded-3xl shadow-2xl space-y-5 transition-colors`}>
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-emerald-800'} mb-1.5`}>
                BACKOFFICE USERNAME / PHONE
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter Backoffice username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  required
                  className={`w-full pl-10 pr-4 py-3.5 rounded-2xl ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-emerald-50/50 border-emerald-200 text-emerald-950'} border text-xs font-semibold outline-none focus:border-emerald-500 transition-colors`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-emerald-800'} mb-1.5`}>
                PASSWORD
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  required
                  className={`w-full pl-10 pr-4 py-3.5 rounded-2xl ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-emerald-50/50 border-emerald-200 text-emerald-950'} border text-xs font-semibold outline-none focus:border-emerald-500 transition-colors`}
                />
              </div>
            </div>

            {/* Emerald Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>SIGN IN TO APP</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-slate-800/40">
            <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-emerald-700'} flex items-center justify-center gap-1`}>
              <ShieldCheck size={12} className="text-emerald-500" /> SECURE BACKEND AUTHENTICATION
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
