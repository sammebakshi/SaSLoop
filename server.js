require("dotenv").config();
console.log("SERVER BOOTING... 🚀");

const express = require("express");
const cors = require("cors");
const app = express();
const path = require('path');
const fs = require('fs');
const fileUpload = require("express-fileupload");

const pool = require("./db");

// ======================
// ✅ DEBUG LOGGER
// ======================
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ======================
// ✅ MIDDLEWARE
// ======================
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const xss = require("xss-clean");

// ======================
// ✅ SECURITY MIDDLEWARE
// ======================
app.use(helmet({
    contentSecurityPolicy: false, // Required for React build serving
    crossOriginEmbedderPolicy: false
}));
app.use(xss());
app.use(hpp());

// Global Rate Limiter: 100 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 200, 
    message: "Too many requests from this IP, please try again later."
});
app.use("/api/", limiter); // Apply to all API routes

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(fileUpload());

// ======================
// ✅ API ROUTES (Register BEFORE Static)
// ======================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/master", require("./routes/masterAdminRoutes"));
app.use("/api/business", require("./routes/businessRoutes"));
app.use("/api/whatsapp", require("./routes/whatsappRoutes"));
app.use("/api/instance", require("./routes/whatsappRoutes"));
app.use("/api/catalog", require("./routes/catalogRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/public", require("./routes/publicRoutes"));
app.use("/api/crm", require("./routes/crmRoutes"));

// ======================
// ✅ STATIC ASSETS
// ======================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const buildPath = path.resolve(__dirname, "SaSLoop-dashboard", "build");
app.use(express.static(buildPath));

// ======================
// ✅ ULTIMATE SPA HANDLER (Force Menu Fix)
// ======================
app.get(/^\/(?!api|uploads).*/, (req, res) => {
    // If it's an API call that leaked through, error out
    if (req.path.startsWith("/api/")) {
        return res.status(404).json({ error: "API not found" });
    }
    // For ANYTHING else (especially /menu/...), send the React app
    const indexPath = path.join(buildPath, "index.html");
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error("Index Send Fail", err);
            res.status(500).send("Menu interface is offline. Please rebuild the dashboard.");
        }
    });
});

// ======================
// 🚀 START SERVER
// ======================
const { initializeDatabase } = require("./dbInit");
const whatsappManager = require("./whatsappManager");
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT} 🚀`);
    if (!fs.existsSync(path.join(__dirname, "uploads"))) {
        fs.mkdirSync(path.join(__dirname, "uploads"));
    }
    await initializeDatabase();
});