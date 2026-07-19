// Pulse: Designation Update logic synchronized ✅ - Schema Refresh 2026-05-31 23:20
require("dotenv").config({ path: require('path').join(__dirname, '.env') });
// Pulse: Designation Update logic synchronized ✅
console.log("SERVER BOOTING... 🚀");
console.log("📍 CWD:", process.cwd());
console.log("📍 ENV PATH:", require('path').join(process.cwd(), '.env'));
console.log("📍 ENV EXISTS:", require('fs').existsSync(require('path').join(process.cwd(), '.env')));

const express = require("express");
const cors = require("cors");
const app = express();
app.set('trust proxy', 1);
const path = require('path');
const fs = require('fs');
const fileUpload = require("express-fileupload");

// ======================
// 🛡️ EXPRESS 5 COMPATIBILITY PATCH (Ghost Hunter)
// ======================
const originalGet = app.get.bind(app);
app.get = function(path, ...args) {
    if (path === '*') {
        console.warn("🚨 [EXPRESS 5 PATCH] Intercepted and fixed a '*' route. Auto-converting to Regex.");
        console.trace("📍 Trace to find the culprit:");
        return originalGet(/.*/, ...args);
    }
    return originalGet(path, ...args);
};

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
    'http://localhost:5173',
    'http://localhost:5174',
    'https://sasloop.in',
    'https://www.sasloop.in',
    'https://backend.sasloop.in',
    'https://www.backend.sasloop.in',
    'http://80.225.240.191',
    'https://80.225.240.191',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin === 'null' || origin === 'file://' || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            console.error(`🚫 [CORS BLOCKED] Origin: ${origin}`);
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

// Diagnostic Route for POS Console Errors
app.post("/api/pos/log-error", (req, res) => {
    console.error("❌ [FRONTEND ERROR]:", req.body);
    const fs = require('fs');
    const path = require('path');
    const logMsg = `[${new Date().toISOString()}] POS FRONTEND ERROR: ${JSON.stringify(req.body)}\n`;
    fs.appendFileSync(path.join(__dirname, 'error.log'), logMsg);
    res.json({ success: true });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/master", require("./routes/masterAdminRoutes"));
app.use("/api/business/catalog", require("./routes/catalogRoutes"));
app.use("/api/business-data/catalog", require("./routes/catalogRoutes"));
app.use("/api/business", require("./routes/businessRoutes"));
app.use("/api/whatsapp", require("./routes/whatsappRoutes"));
app.use("/api/instance", require("./routes/whatsappRoutes"));
app.use("/api/catalog", require("./routes/catalogRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/pre-orders", require("./routes/preOrderRoutes"));
app.use("/api/kots", require("./routes/kotRoutes"));
app.use("/api/waiters", require("./routes/waiterRoutes"));
app.use("/api/tally", require("./routes/tallyRoutes"));
app.use("/api/discounts", require("./routes/discountRoutes"));
app.use("/api/additional-charges", require("./routes/additionalChargeRoutes"));



app.use("/api/public", require("./routes/publicRoutes"));
app.use("/api/crm", require("./routes/crmRoutes"));
app.use("/api/reservations", require("./routes/reservationRoutes"));
app.use("/api/delivery", require("./routes/deliveryRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/pos", require("./routes/posRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/brand", require("./routes/brandRoutes"));
app.use("/api/option-groups", require("./routes/optionGroupRoutes"));

// ======================
// 📝 STANDALONE TASKS REGISTRY API
// ======================
app.get("/api/tasks-backlog", (req, res) => {
    const tasksFilePath = path.join(__dirname, "tasks_data.json");
    if (fs.existsSync(tasksFilePath)) {
        res.sendFile(tasksFilePath);
    } else {
        res.json({ pages: [], activePageId: null });
    }
});

app.post("/api/tasks-backlog", (req, res) => {
    const tasksFilePath = path.join(__dirname, "tasks_data.json");
    try {
        fs.writeFileSync(tasksFilePath, JSON.stringify(req.body, null, 2), "utf8");
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


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
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, path) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

// ======================
// 🎨 DESIGN & ASSETS (Prioritized)
// ======================
// Resolve build path relative to server.js
let buildPath = path.join(__dirname, "SaSLoop-dashboard", "build");
if (!fs.existsSync(buildPath)) {
    buildPath = path.join(__dirname, "SaSLoop-dashboard", "build_new");
}
if (!fs.existsSync(buildPath)) {
    const altPath = path.join(__dirname, "..", "SaSLoop-dashboard", "build");
    if (fs.existsSync(altPath)) buildPath = altPath;
}
if (!fs.existsSync(buildPath)) {
    const distPath = path.join(__dirname, "dist");
    if (fs.existsSync(distPath)) buildPath = distPath;
}

console.log("🚀 FINAL FRONTEND PATH:", buildPath);

// Debugger to see why CSS/JS might be failing
app.use((req, res, next) => {
    if (req.path.includes('.') && !req.path.startsWith('/api')) {
        const fullPath = path.join(buildPath, req.path);
        const exists = fs.existsSync(fullPath);
        console.log(`[ASSET CHECK] ${exists ? '✅' : '❌'} ${req.path} -> ${fullPath}`);
    }
    next();
});

if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath, {
        index: false, // Don't serve index.html here, let SPA handler do it
        immutable: true,
        maxAge: '1y'
    }));
    console.log("✅ Dashboard Assets Mounted!");
}

// ======================
// ✅ ULTIMATE SPA HANDLER (Reliable Navigation)
// ======================
// 3. Otherwise, serve index.html for all other routes (SPA) - Express 5.x Regex Syntax
app.get(/.*/, (req, res, next) => {
    // 1. Skip if it's an API or Uploads request
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
        return next();
    }

    // 2. Skip if it's a direct file request (contains a dot like .css, .js, .png)
    if (req.path.includes('.')) {
        return next();
    }

    // 3. Otherwise, serve index.html for all other routes (SPA)
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.sendFile(indexPath);
    } else {
        res.status(500).send("Dashboard build missing. Please run: npm run build-frontend");
    }
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