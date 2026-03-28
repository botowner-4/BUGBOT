/* ===================================== */
/*        BUGFIXED SULEXH BOT           */
/*  Never Sleep, Gift Startup, Crash Safe*/
/* ===================================== */

const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const axios = require('axios');
const app = express();
const __path = process.cwd();

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 10000;

// =====================================
// Routes (your existing bot modules)
const serverQR = require('./bugbotqr');
const codePair = require('./pair'); // your improved pair.js with gift startup
const receiveRoute = require('./receive');

require('events').EventEmitter.defaultMaxListeners = 500;

// Mount routers
app.use('/bugbotqr', serverQR);
app.use('/pair', codePair);
app.use('/receive', receiveRoute);

// =====================================
// Serve static assets (CSS/JS/images)
app.use(express.static(path.join(__path, 'public')));

// =====================================
// Homepage
app.get('/', async (req, res) => {
    res.sendFile(path.join(__path, 'botowner4page.html'));
});

// =====================================
// Health check for UptimeRobot / Render
app.get('/health', (req, res) => {
    res.json({
        status: "OK",
        message: "BUGFIXED XMD Bot is alive ✅",
        timestamp: new Date().toISOString()
    });
});

// Optional quick alive check
app.get('/alive', (req, res) => res.send("Bot Alive"));

// =====================================
// Self-ping to keep bot awake (optional backup)
setInterval(async () => {
    try {
        const res = await axios.get(`http://localhost:${PORT}/health`);
        console.log('✅ Self-ping successful:', res.data.status);
    } catch (err) {
        console.log('❌ Self-ping failed:', err.message);
    }
}, 4 * 60 * 1000); // every 4 minutes

// =====================================
// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log("BUGFIXED XMD Server Running ✅");
    console.log(`Homepage => http://localhost:${PORT}/`);
    console.log(`Health check => http://localhost:${PORT}/health`);
});

module.exports = app;
