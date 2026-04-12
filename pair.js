require('./settings');
require('./lib/bugconfig');
const { handleMessages } = require('./main');

const fs = require('fs');
const path = require('path');
const express = require("express");
const router = express.Router();
const pino = require("pino");
const axios = require("axios");

const sessionSockets = new Map();
global.pairStatus = {};

/* ================= BAILEYS ================= */
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  DisconnectReason
} = require("@whiskeysockets/baileys");

/* ================= CRASH PROTECTION ================= */
process.on("uncaughtException", err => console.log("❌ Uncaught:", err));
process.on("unhandledRejection", err => console.log("❌ Rejection:", err));

/* ================= ANTI SLEEP ================= */
const APP_URL = process.env.APP_URL || "https://bugbot-1-8b2q.onrender.com";
setInterval(async () => {
  try {
    await axios.get(APP_URL);
    console.log("🔄 Ping");
  } catch {}
}, 60 * 1000);

/* ================= CONFIG ================= */
const SESSION_ROOT = "./session_pair";
if (!fs.existsSync(SESSION_ROOT)) fs.mkdirSync(SESSION_ROOT, { recursive: true });

/* ================= STORAGE ================= */
let whitelist = {};
let paidNumbers = {};

const WHITELIST_FILE = "./whitelist.json";
if (fs.existsSync(WHITELIST_FILE))
  whitelist = JSON.parse(fs.readFileSync(WHITELIST_FILE));

const PAYMENT_FILE = "./payments.json";
if (fs.existsSync(PAYMENT_FILE))
  paidNumbers = JSON.parse(fs.readFileSync(PAYMENT_FILE));

const saveWhitelist = () =>
  fs.writeFileSync(WHITELIST_FILE, JSON.stringify(whitelist, null, 2));

const savePayments = () =>
  fs.writeFileSync(PAYMENT_FILE, JSON.stringify(paidNumbers, null, 2));

/* ================= CLEAN SESSION ================= */
function cleanSession(sessionPath, number) {
  try {
    if (sessionSockets.has(number)) {
      try { sessionSockets.get(number).logout(); } catch {}
      try { sessionSockets.get(number).end?.(); } catch {}
      sessionSockets.delete(number);
    }

    if (fs.existsSync(sessionPath)) {
      fs.rmSync(sessionPath, { recursive: true, force: true });
    }

    fs.mkdirSync(sessionPath, { recursive: true });

  } catch (err) {
    console.log("Cleanup error:", err);
  }
}

/* ================= SOCKET ================= */
async function startSocket(sessionPath, sessionKey) {
  const { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

  const sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    keepAliveIntervalMs: 20000,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys)
    },
    browser: ["Ubuntu","Chrome","20.0.04"]
  });

  if (sessionKey) sessionSockets.set(sessionKey, sock);

  sock.ev.on("messages.upsert", async (chatUpdate) => {
    try {
      if (!chatUpdate?.messages?.length) return;
      if (chatUpdate.type !== "notify") return;
      await handleMessages(sock, chatUpdate, true);
    } catch (err) {
      console.log("Message error:", err);
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    try {
      if (connection === "open") {
        await new Promise(r => setTimeout(r, 1500));

        if (!state?.creds?.registered) return;

        const cleanNumber = state.creds.me.id.split(":")[0];
        const userJid = cleanNumber + "@s.whatsapp.net";

        console.log("✅ Connected:", cleanNumber);

        if (global.pairStatus[sessionKey]) {
          global.pairStatus[sessionKey].status = "success";
        }

        await sock.sendMessage(userJid, {
          text: "✅ BUGBOT XMD CONNECTED\nType .menu"
        });

        setTimeout(async () => {
          try {
            const caption = `
╔════════════════════════════╗
║ 🤖 BUGFIXED SULEXH BOT ║
╚════════════════════════════╝

🌟 SESSION CONNECTED SUCCESSFULLY
🚀 BOT READY TO USE
💡 Type .menu
📢 Group: https://chat.whatsapp.com/DG9XlePCVTEJclSejnZwN5
📞 Owner: +254768161116
`;

            await sock.sendMessage(userJid, {
              video: { url: "https://files.catbox.moe/rxvkde.mp4" },
              caption,
              gifPlayback: true
            });

          } catch (err) {
            console.log("Video failed:", err.message);
          }
        }, 2000);
      }

      if (connection === "close") {
        const status = lastDisconnect?.error?.output?.statusCode;
        console.log("⚠ Closed:", status);

        if (sessionKey) sessionSockets.delete(sessionKey);

        if (status === DisconnectReason.loggedOut) {
          cleanSession(sessionPath, sessionKey);
        } else {
          setTimeout(() => startSocket(sessionPath, sessionKey), 3000);
        }
      }

    } catch (err) {
      console.log("Connection error:", err);
    }
  });

  return sock;
}

/* ================= ROUTES ================= */
router.get('/', (req,res) =>
  res.sendFile(process.cwd()+"/pair.html")
);

router.get('/alive', (req,res) =>
  res.send("Bot Alive")
);

/* ================= STATUS ================= */
router.get('/status', (req,res) => {
  let number = req.query.number;
  if (!number) return res.json({ status: "unknown" });

  number = number.replace(/[^0-9]/g,"");
  const data = global.pairStatus[number];

  if (!data) return res.json({ status: "none" });

  return res.json(data);
});

/* ================= PAIR ================= */
router.get('/code', async (req,res) => {
  try {
    let number = req.query.number;
    if (!number) return res.json({ code: "Number Required" });

    number = number.replace(/[^0-9]/g,"");
    const sessionPath = path.join(SESSION_ROOT, number);

    // allow retry
    if (sessionSockets.has(number)) {
      try {
        const oldSock = sessionSockets.get(number);
        try { oldSock.end?.(); } catch {}
        try { oldSock.ws?.close(); } catch {}
        sessionSockets.delete(number);
      } catch {}
    }

    // clean only if no session exists
    if (!fs.existsSync(path.join(sessionPath, "creds.json"))) {
      cleanSession(sessionPath, number);
    }

    // payment check
    if (!whitelist[number] && !paidNumbers[number]) {
      const message = `
╔════════════════════════════╗
║ 🤖 BUGFIXED SULEXH BOT ║
╠════════════════════════════╣
║ 💳 PAYMENT REQUIRED        ║
║ Amount: KSH 200           ║
║ Number: 254110782928      ║
╠════════════════════════════╣
║ Pay via MPESA to activate ║
║ your bot session.         ║
╚════════════════════════════╝

📌 After payment, retry pairing.
`;
      return res.json({
        code: message,
        copyable: "254110782928"
      });
    }

    const sock = await startSocket(sessionPath, number);

    // wait until socket ready
    await new Promise(resolve => {
      let done = false;
      sock.ev.on("connection.update", (u) => {
        if (!done && (u.qr || u.connection === "connecting")) {
          done = true;
          resolve();
        }
      });
      setTimeout(resolve, 5000);
    });

    // generate pairing code with retry
    let rawCode;
    for (let i = 0; i < 3; i++) {
      try {
        rawCode = await sock.requestPairingCode(number);
        if (rawCode) break;
      } catch {
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    const formatted = rawCode?.match(/.{1,4}/g)?.join("-") || rawCode;

    // store status
    global.pairStatus[number] = {
      status: "waiting",
      code: formatted,
      expires: Date.now() + 60000
    };

    // expire after 1 min
    setTimeout(() => {
      if (global.pairStatus[number]?.status === "waiting") {
        global.pairStatus[number].status = "expired";
      }
    }, 60000);

    return res.json({
      status: "waiting",
      code: `
╔════════════════════════════╗
║ 🤖 BUGFIXED SULEXH BOT ║
╚════════════════════════════╝

🔑 YOUR PAIRING CODE:
${formatted}

📲 Open WhatsApp → Linked Devices
➡ Enter the code above

💡 Powered by BUGBOT XMD
`,
      raw: formatted
    });

  } catch (err) {
    console.log("Pair error:", err);
    return res.json({ status: "error", code: null });
  }
});

/* ================= PAYMENT ================= */
router.post('/sms', express.json(), (req,res)=>{
  let { number, amount } = req.body;

  if (!number || !amount)
    return res.status(400).send("Missing");

  number = number.replace(/[^0-9]/g,"");

  if (amount >= 200) {
    paidNumbers[number] = true;
    whitelist[number] = true;

    savePayments();
    saveWhitelist();

    console.log("✅ Payment approved:", number);
  }

  res.send("OK");
});

module.exports = router;
