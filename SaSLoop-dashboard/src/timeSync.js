// ==========================================
// 🕒 GLOBAL INTERNET TIME SYNC (Safe)
// ==========================================
// Instead of overriding window.Date (which breaks React/instanceof checks),
// we store a time offset and export a helper for components that need internet time.

const _OriginalDateNow = Date.now.bind(Date);

let _internetTimeOffset = parseInt(localStorage.getItem("internet_time_offset") || "0");

// Override only Date.now() — this is safe and doesn't break instanceof or constructors
const _originalNow = Date.now;
Date.now = function() {
  return _originalNow.call(Date) + _internetTimeOffset;
};

// Export a helper to get a corrected Date object using internet time
export function getInternetDate() {
  return new Date(_OriginalDateNow() + _internetTimeOffset);
}

export function getInternetTimeOffset() {
  return _internetTimeOffset;
}

// Perform background fetch to sync time offset
(function syncTime() {
  const apiBase = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "";

  const start = _OriginalDateNow();
  fetch(`${apiBase}/api/public/time`)
    .then(res => {
      if (res.ok) return res.json();
      throw new Error('fail');
    })
    .then(data => {
      const serverTime = new Date(data.time).getTime();
      const lat = (_OriginalDateNow() - start) / 2;
      const offset = serverTime + lat - _OriginalDateNow();
      _internetTimeOffset = offset;
      localStorage.setItem("internet_time_offset", String(offset));
      console.log(`[TIME-SYNC] Server time synchronized. Offset: ${offset}ms`);
    })
    .catch(e => {
      console.warn("[TIME-SYNC] Failed to synchronize server time:", e);
    });
})();
