// ==========================================
// 🕒 GLOBAL INTERNET TIME SYNC & OVERRIDE
// ==========================================
(function() {
  const OriginalDate = window.Date;

  // Define proxy wrapper to override Date constructor and static methods
  const InternetDateWrapper = new Proxy(OriginalDate, {
    construct(target, args) {
      if (args.length === 0) {
        const offset = parseInt(localStorage.getItem("internet_time_offset") || "0");
        return new OriginalDate(OriginalDate.now() + offset);
      }
      return new OriginalDate(...args);
    },
    apply(target, thisArg, args) {
      if (args.length === 0) {
        const offset = parseInt(localStorage.getItem("internet_time_offset") || "0");
        return new OriginalDate(OriginalDate.now() + offset).toString();
      }
      return OriginalDate(...args);
    }
  });

  Object.getOwnPropertyNames(OriginalDate).forEach(prop => {
    if (prop !== 'length' && prop !== 'name' && prop !== 'prototype') {
      InternetDateWrapper[prop] = OriginalDate[prop];
    }
  });

  InternetDateWrapper.now = function() {
    const offset = parseInt(localStorage.getItem("internet_time_offset") || "0");
    return OriginalDate.now() + offset;
  };

  window.Date = InternetDateWrapper;

  // Perform background fetch to sync time offset
  const apiBase = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:5000"
      : "";
      
  const start = OriginalDate.now();
  fetch(`${apiBase}/api/public/time`)
    .then(res => {
      if (res.ok) return res.json();
      throw new Error('fail');
    })
    .then(data => {
      const serverTime = new OriginalDate(data.time).getTime();
      const lat = (OriginalDate.now() - start) / 2;
      const offset = serverTime + lat - OriginalDate.now();
      localStorage.setItem("internet_time_offset", String(offset));
      console.log(`[TIME-SYNC] Server time synchronized. Offset: ${offset}ms`);
    })
    .catch(e => {
      console.warn("[TIME-SYNC] Failed to synchronize server time:", e);
    });
})();
