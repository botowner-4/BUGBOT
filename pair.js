require('./settings');
const { handleMessages } = require('./main');
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const pino = require("pino");

const sessionSockets = new Map();

const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    DisconnectReason
} = require("@whiskeysockets/baileys");

/* ======================= */
/* CRASH PROTECTION        */
/* ======================= */
process.on("uncaughtException", err => console.log("❌ Uncaught Exception:", err));
process.on("unhandledRejection", err => console.log("❌ Unhandled Rejection:", err));

/* ======================= */
/* CONFIG                  */
/* ======================= */
const SESSION_ROOT = "./session_pair";
if (!fs.existsSync(SESSION_ROOT)) fs.mkdirSync(SESSION_ROOT, { recursive: true });

/* ======================= */
/* UTILITY: CLEAN SESSION  */
/* ======================= */
function cleanSession(sessionPath) {
    if (fs.existsSync(sessionPath)) {
        try {
            fs.rmSync(sessionPath, { recursive: true, force: true });
        } catch (e) {
            console.log("❌ Session clean error:", e);
        }
    }
}

/* ======================= */
/* UTILITY: TIMEOUT PROMISE */
/* ======================= */
function withTimeout(promise, ms) {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject("Timeout"), ms))
    ]);
}

/* ======================= */
/* SOCKET STARTER           */
/* ======================= */
async function startSocket(sessionPath, sessionKey) {
    const { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const sock = makeWASocket({
        version,
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        keepAliveIntervalMs: 10000,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys)
        },
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    // ✅ Store socket
    if (sessionKey) sessionSockets.set(sessionKey, sock);

    /* ======================= */
    /* MESSAGE HANDLER          */
    /* ======================= */
    sock.ev.on("messages.upsert", async (chatUpdate) => {
        try {
            if (!chatUpdate?.messages?.length) return;
            if (chatUpdate.type !== "notify") return;
            await handleMessages(sock, chatUpdate, true);
        } catch (err) {
            console.log("Runtime handler error:", err);
        }
    });

    sock.ev.on("creds.update", saveCreds);

    /* ======================= */
    /* CONNECTION HANDLER       */
    /* ======================= */
    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;

        try {
            if (connection === "open") {
                console.log("✅ Connected:", sessionKey);

                // ✅ SEND STARTUP GIFT MESSAGE
                try {
                    const giftVideo = "https://files.catbox.moe/rxvkde.mp4";
                    const caption = `
╔════════════════════════════╗
║ 🤖 BUGFIXED SULEXH BUGBOT XMD ║
╚════════════════════════════╝

🌟 SESSION CONNECTED SUCCESSFULLY 🌟
🚀 BOT IS NOW READY TO USE

💡 Type .menu to view commands

📢 Join our WhatsApp Group:
https://chat.whatsapp.com/DG9XlePCVTEJclSejnZwN5?mode=gi_t

📞 Contact BUGBOT Owner: +254768161116
`;

                    const userJid = "123456789@s.whatsapp.net"; // ⚠ Replace with your target JID

                    await sock.sendMessage(userJid, {
                        video: { url: giftVideo },
                        caption: caption,
                        gifPlayback: true,
                        contextInfo: {
                            forwardingScore: 999,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: "120363416402842348@newsletter",
                                newsletterName: "BUGFIXED SULEXH TECH",
                                serverMessageId: 1
                            }
                        }
                    });

                    console.log("✅ Startup gift message sent");

                } catch (err) {
                    console.log("❌ Failed to send startup gift message:", err);
                }
            }

            if (connection === "close") {
                const status = lastDisconnect?.error?.output?.statusCode;
                console.log("⚠ Connection closed:", status);

                if (status === DisconnectReason.loggedOut) {
                    console.log("🗑 Session logged out. Cleaning:", sessionKey);
                    sessionSockets.delete(sessionKey);
                    cleanSession(sessionPath);
                    return;
                }

                console.log("🔄 Reconnecting:", sessionKey);
                if (!sessionSockets.has(sessionKey)) setTimeout(() => startSocket(sessionPath, sessionKey), 5000);
            }

        } catch (err) {
            console.log("Connection handler error:", err);
        }
    });

    sock.ws.on("close", () => {
        console.log("⚠ WS closed, cleaning:", sessionKey);
        sessionSockets.delete(sessionKey);
    });

    return sock;
}

/* ======================= */
/* PAIR PAGE                */
/* ======================= */
router.get('/', (req, res) => res.sendFile(process.cwd() + "/pair.html"));

/* ======================= */
/* BOT STATUS               */
router.get('/alive', (req, res) => res.send("Bot Alive"));

/* ======================= */
/* PAIR CODE API            */
router.get('/code', async (req, res) => {
    try {
        let number = req.query.number;
        if (!number) return res.json({ code: "Number Required" });

        number = number.replace(/[^0-9]/g, '');
        const sessionPath = path.join(SESSION_ROOT, number);

        // 🔥 Force reset old socket
        const oldSock = sessionSockets.get(number);
        if (oldSock) {
            try { oldSock.ws?.close(); } catch {}
            sessionSockets.delete(number);
        }

        // 🔥 Clean broken session
        if (fs.existsSync(sessionPath)) {
            const files = fs.readdirSync(sessionPath);
            if (!files.includes("creds.json")) cleanSession(sessionPath);
        }

        if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true });

        // ✅ Start fresh socket
        const sock = await startSocket(sessionPath, number);
        await new Promise(r => setTimeout(r, 3000));

        // 🔥 Request pairing safely
        const code = await withTimeout(sock.requestPairingCode(number), 10000);
        return res.json({ code: code?.match(/.{1,4}/g)?.join("-") || code });

    } catch (err) {
        console.log("Pairing Error:", err);

        if (req.query.number) cleanSession(path.join(SESSION_ROOT, req.query.number.replace(/[^0-9]/g, '')));
        return res.json({ code: "Service Unavailable" });
    }
});

module.exports = router;
