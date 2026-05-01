require("dotenv").config();
console.log("SERVER BOOTING... 🚀");

const express = require("express");
const cors = require("cors");
const app = express();
app.set('trust proxy', 1);
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

// ======================
// ✅ SECURITY MIDDLEWARE
// ======================
app.use(helmet({
    contentSecurityPolicy: false, // Required for React build serving
    crossOriginEmbedderPolicy: false
}));
app.use(hpp());
// xss-clean removed due to Express 5 incompatibility

// Global Rate Limiter: 2000 requests per 15 minutes per IP (Dashboard Polling requires higher limits)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 2000, 
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        res.status(options.statusCode).json({ error: options.message });
    },
    message: "Too many requests from this IP, please try again later."
});
app.use("/api/", limiter); // Apply to all API routes

// Brute Force Protection for Auth
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Limit each IP to 20 login attempts per hour
    message: "Too many login attempts. Please try again in an hour."
});
app.use("/api/auth/login", authLimiter);

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://sasloop.in',
    'https://www.sasloop.in',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Blocked by CORS Security Policy'));
        }
    },
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(fileUpload({
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    useTempFiles: false
}));

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
app.use("/api/reservations", require("./routes/reservationRoutes"));
app.use("/api/delivery", require("./routes/deliveryRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));


// ======================
// ✅ HEALTH CHECK
// ======================
app.get("/api/health-check", async (req, res) => {
    const health = {
        status: "up",
        time: new Date().toISOString(),
        database: "checking...",
        env: process.env.NODE_ENV || "unknown"
    };
    try {
        const dbCheck = await pool.query("SELECT NOW()");
        if (dbCheck.rows.length > 0) health.database = "connected";
    } catch (err) {
        health.database = "error: " + err.message;
        health.status = "degraded";
    }
    res.json(health);
});

// ======================
// ✅ STATIC ASSETS
// ======================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const buildPath = path.join(__dirname, "SaSLoop-dashboard", "build");
console.log("Checking build path:", buildPath);
if (fs.existsSync(buildPath)) {
    console.log("✅ Build folder found!");
    app.use(express.static(buildPath));
} else {
    console.warn("⚠️ Build folder NOT FOUND at:", buildPath);
}

// ======================
// ✅ ULTIMATE SPA HANDLER (Force Menu Fix)
// ======================
app.get(/^\/(?!api|uploads).*/, (req, res) => {
    if (req.path.startsWith("/api/")) {
        return res.status(404).json({ error: "API not found" });
    }
    
    const indexPath = path.join(buildPath, "index.html");
    if (!fs.existsSync(indexPath)) {
        console.error("❌ index.html missing at:", indexPath);
        return res.status(500).send(`Frontend not built. Please run: npm run build-frontend`);
    }

    res.sendFile(indexPath);
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
    
    // Start Cron Jobs
    whatsappManager.startCartRecoveryCron();
    whatsappManager.startAutoFollowupCron();
    whatsappManager.startBackupCron();
    
    // Log Restart
    try {
        await pool.query("UPDATE system_status SET restart_count = restart_count + 1, last_restart_at = NOW() WHERE id = 1");
        const res = await pool.query("SELECT restart_count FROM system_status WHERE id = 1");
        console.log(`📈 SERVER RESTARTED! Total restarts logged: ${res.rows[0].restart_count}`);
    } catch (err) {
        console.error("Failed to log restart:", err.message);
    }
});