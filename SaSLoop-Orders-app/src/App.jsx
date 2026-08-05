import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import SoundAlertBanner from './components/SoundAlertBanner';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Reservations from './pages/Reservations';
import Settings from './pages/Settings';
import audioEngine from './services/audioService';
import { reservationService } from './services/api';


const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem('sasloop_orders_token'));
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sasloop_orders_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeOutlet, setActiveOutlet] = useState(() => ({
    id: user?.id || 1,
    name: user?.name || user?.business_name || 'Main Restaurant'
  }));

  const [activeTab, setActiveTab] = useState('orders');
  const [isMuted, setIsMuted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [alertType, setAlertType] = useState('order');
  
  // Theme state: Emerald (light mode) by default, or Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('sasloop_theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('theme-dark');
      localStorage.setItem('sasloop_theme', 'dark');
    } else {
      document.documentElement.classList.remove('theme-dark');
      localStorage.setItem('sasloop_theme', 'emerald');
    }
  }, [isDarkMode]);

  // Request audio & system notification permissions on first user click anywhere
  useEffect(() => {
    const unlockAudio = () => {
      audioEngine.initContext();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  const handleLoginSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    setActiveOutlet({
      id: newUser.id || 1,
      name: newUser.name || newUser.business_name || 'Main Restaurant'
    });
    audioEngine.initContext();
    if (window.AndroidNativeAuth && window.AndroidNativeAuth.saveAuthToken) {
      window.AndroidNativeAuth.saveAuthToken(newToken, String(newUser.id || newUser.bizId || 1));
    }
  };

  useEffect(() => {
    if (token && window.AndroidNativeAuth && window.AndroidNativeAuth.saveAuthToken) {
      window.AndroidNativeAuth.saveAuthToken(token, String(user?.id || user?.bizId || 1));
    } else if (!token && window.AndroidNativeAuth && window.AndroidNativeAuth.clearAuthToken) {
      window.AndroidNativeAuth.clearAuthToken();
    }
  }, [token, user]);

  // 🔔 Continuous Background Polling for New Table Bookings & Sound Alerts
  const seenResIdsRef = useRef(new Set());
  const isFirstResCheckRef = useRef(true);

  useEffect(() => {
    if (!token) return;

    const checkBackgroundReservations = async () => {
      try {
        const data = await reservationService.getReservations(activeOutlet?.id);
        let list = Array.isArray(data) ? data : (data.reservations || []);

        const isFirstCheck = isFirstResCheckRef.current;
        if (isFirstCheck) {
          isFirstResCheckRef.current = false;
        }

        const newPending = list.filter(r => {
          const isPending = String(r.status || '').toUpperCase().includes('PENDING');
          const isNew = !seenResIdsRef.current.has(r.id);
          return isPending && isNew;
        });

        if (newPending.length > 0) {
          newPending.forEach(r => seenResIdsRef.current.add(r.id));
          handleNewReservationAlert(newPending.length);
        }
      } catch (e) {
        console.error('Background reservation check error:', e);
      }
    };

    checkBackgroundReservations();
    const resInterval = setInterval(checkBackgroundReservations, 3000);
    return () => clearInterval(resInterval);
  }, [token, activeOutlet?.id, isMuted]);


  const handleLogout = () => {
    audioEngine.stopAlertLoop();
    if (window.AndroidNativeAuth && window.AndroidNativeAuth.clearAuthToken) {
      try {
        window.AndroidNativeAuth.clearAuthToken();
      } catch (e) {
        console.error("Error clearing native auth token:", e);
      }
    }
    localStorage.removeItem('sasloop_orders_token');
    localStorage.removeItem('sasloop_orders_user');
    setToken(null);
    setUser(null);
  };

  const handleNewOrderAlert = (count) => {
    setUnreadCount((prev) => prev + count);
    setAlertType('order');
    if (!isMuted) {
      audioEngine.startAlertLoop('🚨 New Order Arrived!', `${count} new order received. Tap to view details.`);
    }
  };

  const handleNewReservationAlert = (count) => {
    setUnreadCount((prev) => prev + count);
    setAlertType('reservation');
    if (!isMuted) {
      audioEngine.startAlertLoop('🍽️ New Table Booking!', `${count} table reservation received. Tap to review.`);
    }
  };

  const handleAcknowledgeAlerts = () => {
    setUnreadCount(0);
    audioEngine.stopAlertLoop();
  };

  const handleToggleMute = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme} />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'theme-dark bg-slate-950 text-slate-100' : 'bg-white text-slate-950'} flex flex-col font-sans max-w-md md:max-w-xl mx-auto shadow-2xl relative border-x ${isDarkMode ? 'border-slate-900' : 'border-slate-200'} transition-colors duration-200`}>
      {/* Top Header Navbar with iPhone Theme Switcher */}
      <Navbar
        activeOutlet={activeOutlet}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onLogout={handleLogout}
        unreadCount={unreadCount}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Floating Sound Alert Ringing Banner */}
      <SoundAlertBanner
        count={unreadCount}
        type={alertType}
        onAcknowledge={handleAcknowledgeAlerts}
      />

      {/* Main Tab Content View */}
      <main className="flex-1">
        {activeTab === 'orders' && (
          <Orders
            activeOutlet={activeOutlet}
            onNewOrderAlert={handleNewOrderAlert}
            onAcknowledgeAlerts={handleAcknowledgeAlerts}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'reservations' && (
          <Reservations
            activeOutlet={activeOutlet}
            onNewReservationAlert={handleNewReservationAlert}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'settings' && (
          <Settings
            user={user}
            activeOutlet={activeOutlet}
            onOutletChange={setActiveOutlet}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onLogout={handleLogout}
            isDarkMode={isDarkMode}
          />
        )}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (unreadCount > 0) handleAcknowledgeAlerts();
        }}
        unreadOrdersCount={activeTab !== 'orders' ? unreadCount : 0}
        unreadReservationsCount={activeTab !== 'reservations' ? 0 : 0}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default App;
