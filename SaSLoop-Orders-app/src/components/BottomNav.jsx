import React from 'react';
import { ShoppingBag, Calendar, Settings } from 'lucide-react';

const BottomNav = ({ activeTab, onTabChange, unreadOrdersCount, unreadReservationsCount, isDarkMode }) => {
  const tabs = [
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      badge: unreadOrdersCount,
    },
    {
      id: 'reservations',
      label: 'Bookings',
      icon: Calendar,
      badge: unreadReservationsCount,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: 0,
    },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 ${
      isDarkMode ? 'bg-slate-950/95 border-slate-800' : 'bg-white/95 border-emerald-100'
    } backdrop-blur-xl border-t px-4 py-2 flex items-center justify-around shadow-2xl transition-colors`}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex flex-col items-center py-1.5 px-6 rounded-2xl transition-all cursor-pointer ${
              isActive
                ? isDarkMode
                  ? 'text-emerald-400 font-black bg-emerald-500/10 border border-emerald-500/20'
                  : 'text-emerald-700 font-black bg-emerald-50 border border-emerald-200'
                : isDarkMode
                ? 'text-slate-400 font-bold hover:text-slate-200'
                : 'text-emerald-800/70 font-bold hover:text-emerald-950'
            }`}
          >
            <div className="relative">
              <Icon size={20} className={isActive ? 'stroke-[2.5] text-emerald-600 dark:text-emerald-400' : 'stroke-2'} />
              {tab.badge > 0 && (
                <span className="absolute -top-2 -right-3 bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-rose-500/30">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-1 tracking-tight font-extrabold">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
