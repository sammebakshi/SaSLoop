// =====================================================
// API Base URL — Single source of truth
// In production (Nginx), frontend & backend are on
// the same domain, so we use relative /api paths.
// In local dev (localhost:3000), we point to :5000.
// In Capacitor (mobile app), we use the ngrok tunnel.
// =====================================================

// Detect if running inside Capacitor native shell
const isCapacitor = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();

// Ngrok tunnel URL — update this whenever your tunnel restarts
const NGROK_URL = "https://comply-lagged-concave.ngrok-free.dev";

const API_BASE =
  isCapacitor
    ? NGROK_URL                   // native app → always use tunnel/production URL
    : process.env.NODE_ENV === "production"
      ? ""                        // same domain in production → /api/...
      : "http://localhost:5000";  // local dev browser

export default API_BASE;

// Helper for mobile detection (used in App.js)
export const isMobileDevice = () => {
  if (isCapacitor) return true;
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor;
  return /android|iphone|ipad|ipod|mobile/i.test(ua) || window.innerWidth <= 768;
};
