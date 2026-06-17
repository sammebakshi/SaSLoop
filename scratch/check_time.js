const { isBusinessOpen } = require("../utils/businessUtils");

const now = new Date();
console.log("System local time:", now.toString());
console.log("System ISO (UTC) time:", now.toISOString());
console.log("System getTime():", now.getTime());

const indiaTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
console.log("Shifted IndiaTime UTC representation:", indiaTime.toUTCString());
const currentMinutes = indiaTime.getUTCHours() * 60 + indiaTime.getUTCMinutes();
console.log("Calculated currentMinutes in India:", currentMinutes);

const settings = {
    openingTime: "02:00 AM",
    closingTime: "11:00 PM"
};
console.log("Is open (Settings 02:00 AM - 11:00 PM):", isBusinessOpen(settings));
