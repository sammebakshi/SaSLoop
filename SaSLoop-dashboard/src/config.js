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
    ? NGROK_URL
    : window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:5000"
      : ""; // In production/ngrok, use relative paths (/api/...)

export default API_BASE;

// Helper for mobile detection (used in App.js)
export const isMobileDevice = () => {
  if (isCapacitor) return true;
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor;
  return /android|iphone|ipad|ipod|mobile/i.test(ua) || window.innerWidth <= 768;
};

// Global Fetch Patch: Bypass Ngrok Free Tier HTML Interstitial Warning
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = async function () {
    let [resource, config] = arguments;
    if (!config) config = {};
    if (!config.headers) config.headers = {};
    
    // Convert Headers object to normal object if necessary
    if (config.headers instanceof Headers) {
      config.headers.append('ngrok-skip-browser-warning', 'true');
    } else {
      config.headers['ngrok-skip-browser-warning'] = 'true';
    }
    
    return originalFetch.apply(this, [resource, config]);
  };
}
