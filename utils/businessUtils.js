/**
 * Checks if the business is currently open based on settings.
 * @param {Object} settings - The settings object from restaurants table.
 * @returns {Object} { isOpen: boolean, openingTime: string, closingTime: string }
 */
function isBusinessOpen(settings) {
    if (!settings || !settings.openingTime || !settings.closingTime) {
        return { isOpen: true }; // Default to open if not configured
    }

    // Use India Time (UTC+5:30) for consistency as requested/implied by user context
    const now = new Date();
    const indiaTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    const hours = String(indiaTime.getUTCHours()).padStart(2, '0');
    const minutes = String(indiaTime.getUTCMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    
    const { openingTime, closingTime } = settings;
    
    // Handle overnight shifts (e.g., 22:00 to 04:00)
    if (openingTime > closingTime) {
        return {
            isOpen: currentTime >= openingTime || currentTime <= closingTime,
            openingTime,
            closingTime
        };
    }

    return {
        isOpen: currentTime >= openingTime && currentTime <= closingTime,
        openingTime,
        closingTime
    };
}

/**
 * Calculates distance between two coordinates in km.
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Validates delivery serviceability and calculates charge.
 */
function getDeliveryDetails(biz, customerLat, customerLon) {
    if (!biz.latitude || !biz.longitude) return { serviceable: true, charge: 0, distance: 0 };
    
    const distance = calculateDistance(biz.latitude, biz.longitude, customerLat, customerLon);
    const radius = parseFloat(biz.delivery_radius_km) || 10;
    
    if (distance > radius) {
        return { serviceable: false, distance, radius };
    }
    
    const tiers = Array.isArray(biz.delivery_tiers) ? biz.delivery_tiers : (typeof biz.delivery_tiers === 'string' ? JSON.parse(biz.delivery_tiers) : []);
    const matchedTier = tiers.find(t => distance >= t.min && distance <= t.max);
    const charge = matchedTier ? parseFloat(matchedTier.charge) : 0;
    
    return { serviceable: true, charge, distance, radius };
}

module.exports = {
    isBusinessOpen,
    calculateDistance,
    getDeliveryDetails
};
