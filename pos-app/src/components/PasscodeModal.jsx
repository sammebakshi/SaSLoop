import React, { useState, useEffect, useRef } from 'react';
import { X, Delete, Lock, ShieldCheck, Loader2 } from 'lucide-react';
import { posService } from '../services/api';
import { toast } from 'react-toastify';

const PasscodeModal = ({ isOpen, onClose, onSuccess, actionKey, actionName, isDark = false }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPasscode('');
      setError('');
      setLoading(false);
      // Auto-focus input for physical keyboard entry
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyPress = (char) => {
    if (loading) return;
    setPasscode(prev => prev + char);
    setError('');
  };

  const handleBackspace = () => {
    if (loading) return;
    setPasscode(prev => prev.slice(0, -1));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;
    if (!passcode.trim()) {
      setError('Please enter a passcode.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Verify passcode with the backend
      const res = await posService.verifyPasscode(passcode, actionKey);

      if (res.data && res.data.success) {
        // 2. Audit-log the authorized activity
        try {
          await posService.logPasscode({
            activity: actionName,
            requested_permission: actionKey,
            passcode: passcode,
            authorized_by: res.data.authorized_by,
            pos_billing: 'POS Terminal'
          });
        } catch (logErr) {
          console.warn("Failed to log passcode activity:", logErr);
        }

        toast.success(`Authorized by ${res.data.authorized_by}`);
        onSuccess();
      } else {
        setError(res.data.error || 'Incorrect or unauthorized passcode.');
        setPasscode('');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Verification failed. Try again.');
      setPasscode('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className={`w-80 p-6 rounded-2xl border shadow-2xl flex flex-col items-center select-none ${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500">Security Clearance</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <p className="text-[10px] text-center font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-4">
          Enter authorized passcode for:<br />
          <span className="text-slate-705 dark:text-slate-200 font-extrabold normal-case text-xs block mt-1">{actionName}</span>
        </p>

        {/* Masked Passcode Input Box */}
        <form onSubmit={handleSubmit} className="w-full mb-4">
          <input
            ref={inputRef}
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            disabled={loading}
            placeholder="••••••••"
            className={`w-full text-center tracking-widest text-lg font-bold py-2 rounded-xl border outline-none transition-all ${
              isDark
                ? 'bg-[#0d1117] border-gray-800 text-white focus:border-emerald-500'
                : 'bg-slate-55 border-slate-250 text-slate-800 focus:border-emerald-500'
            }`}
          />
        </form>

        {/* Error Message */}
        {error && (
          <p className="text-[9px] font-black text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-md text-center w-full uppercase tracking-wider mb-4 animate-pulse">
            {error}
          </p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              type="button"
              disabled={loading}
              onClick={() => handleKeyPress(String(num))}
              className={`h-11 text-sm font-extrabold rounded-xl transition-all active:scale-95 flex items-center justify-center ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              {num}
            </button>
          ))}
          {/* Backspace */}
          <button
            type="button"
            disabled={loading}
            onClick={handleBackspace}
            className={`h-11 rounded-xl transition-all active:scale-95 flex items-center justify-center ${
              isDark ? 'bg-white/5 hover:bg-white/10 text-rose-455' : 'bg-slate-100 hover:bg-slate-200 text-rose-600'
            }`}
          >
            <Delete className="w-5 h-5" />
          </button>
          {/* Zero */}
          <button
            type="button"
            disabled={loading}
            onClick={() => handleKeyPress('0')}
            className={`h-11 text-sm font-extrabold rounded-xl transition-all active:scale-95 flex items-center justify-center ${
              isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            0
          </button>
          {/* Verify Button */}
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="h-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white flex items-center justify-center transition-all shadow-[0_4px_12px_rgba(16,172,132,0.2)] disabled:bg-emerald-500/50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
          </button>
        </div>

        <button
          onClick={onClose}
          disabled={loading}
          className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-slate-650 dark:hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PasscodeModal;
