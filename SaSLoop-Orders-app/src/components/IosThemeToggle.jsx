import React from 'react';
import { Sun, Moon } from 'lucide-react';

const IosThemeToggle = ({ isDarkMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      type="button"
      className={`relative w-14 h-8 rounded-full p-0.5 transition-all duration-300 ease-in-out border cursor-pointer active:scale-95 ${
        isDarkMode
          ? 'bg-slate-900 border-slate-700 shadow-inner'
          : 'bg-emerald-600 border-emerald-500 shadow-md shadow-emerald-600/30'
      }`}
      title={isDarkMode ? "Switch to Emerald Light Theme" : "Switch to Dark Mode"}
    >
      <div
        className={`w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center transform transition-transform duration-300 ease-in-out ${
          isDarkMode ? 'translate-x-6 text-slate-900' : 'translate-x-0.5 text-amber-500'
        }`}
      >
        {isDarkMode ? <Moon size={13} className="text-slate-900 fill-slate-900" /> : <Sun size={13} className="text-amber-500 fill-amber-400" />}
      </div>
    </button>
  );
};

export default IosThemeToggle;
