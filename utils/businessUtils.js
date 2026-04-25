const axios = require("axios");

/**
 * Native Haversine distance for quick radius checks (Straight line)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (parseFloat(lat2) - parseFloat(lat1)) * Math.PI / 180;
    const dLon = (parseFloat(lon2) - parseFloat(lon1)) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(parseFloat(lat1) * Math.PI / 180) * Math.cos(parseFloat(lat2) * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

/**
 * Real-road distance using OSRM (Open Source Routing Machine)
 */
async function getRoadDistance(lat1, lon1, lat2, lon2) {
    try {
        const url = `http://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
        const response = await axios.get(url, { timeout: 5000 });
        if (response.data && response.data.routes && response.data.routes[0]) {
            const distanceInMeters = response.data.routes[0].distance;
            return distanceInMeters / 1000; // Return in KM
        }
        // Fallback to haversine if OSRM fails
        return calculateDistance(lat1, lon1, lat2, lon2);
    } catch (error) {
        console.error("OSRM Route Error:", error.message);
        return calculateDistance(lat1, lon1, lat2, lon2);
    }
}

function isBusinessOpen(settings) {
    if (!settings || !settings.openingTime || !settings.closingTime) {
        return { isOpen: true };
    }

    const now = new Date();
    // India is UTC+5:30
    const indiaTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    const hours = String(indiaTime.getUTCHours()).padStart(2, '0');
    const minutes = String(indiaTime.getUTCMinutes()).padStart(2, '0');
    const currentTimeStr = `${hours}:${minutes}`;

    const { openingTime, closingTime } = settings;
    
    // Handle overnight shifts (e.g. 18:00 to 02:00)
    if (openingTime > closingTime) {
        const isOpen = currentTimeStr >= openingTime || currentTimeStr <= closingTime;
        return { isOpen, openingTime, closingTime };
    }

    const isOpen = currentTimeStr >= openingTime && currentTimeStr <= closingTime;
    return { isOpen, openingTime, closingTime };
}

async function getDeliveryDetails(biz, customerLat, customerLon) {
    if (!biz.latitude || !biz.longitude) {
        return { serviceable: true, charge: 0, distance: 0, radius: 0 };
    }

    // We use road distance for pricing and radius check
    const distance = await getRoadDistance(biz.latitude, biz.longitude, customerLat, customerLon);
    const radius = parseFloat(biz.delivery_radius_km) || 10;

    const serviceable = distance <= radius;
    let charge = 0;

    if (serviceable) {
        const tiers = typeof biz.delivery_tiers === 'string' ? JSON.parse(biz.delivery_tiers) : (biz.delivery_tiers || []);
        const matched = tiers.find(t => distance >= t.min && distance <= t.max);
        charge = matched ? parseFloat(matched.charge) : 0;
    }

    return { serviceable, charge, distance, radius };
}

module.exports = {
    calculateDistance,
    getRoadDistance,
    isBusinessOpen,
    getDeliveryDetails
};
