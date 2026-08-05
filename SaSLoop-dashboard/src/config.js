// =====================================================
// API Base URL — Single source of truth
// In production (Nginx), frontend & backend are on
// the same domain, so we use relative /api paths.
// In local dev (localhost:3000), we point to :5000.
// In Capacitor (mobile app), we use the ngrok tunnel.
// =====================================================

const isCapacitor = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();

const PRODUCTION_URL = "https://backend.sasloop.in";

const getApiBase = () => {
  if (isCapacitor) return PRODUCTION_URL;
  if (typeof window === 'undefined') return PRODUCTION_URL;

  const hostname = window.location.hostname;
  const port = window.location.port;

  // Local development server running on port 3000/3001/etc or LAN IP
  if (port === "3000" || port === "3001" || hostname === "localhost" || hostname === "127.0.0.1" || hostname.startsWith("192.168.") || hostname.startsWith("10.")) {
    return `http://${hostname}:5000`;
  }

  // Live production build
  return PRODUCTION_URL;
};

const API_BASE = getApiBase();

export default API_BASE;

// Helper for mobile detection (used in App.js)
export const isMobileDevice = () => {
  if (isCapacitor) return true;
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor;
  return /android|iphone|ipad|ipod|mobile/i.test(ua) || window.innerWidth <= 768;
};

