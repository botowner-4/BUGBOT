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
}, 4 * 60 * 1000);

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
    keepAliveIntervalMs: 5000,
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
        await new Promise(r => setTimeout(r, 2000));

        if (!state?.creds?.me?.id) return;

        const cleanNumber = state.creds.me.id.split(":")[0];
        const userJid = cleanNumber + "@s.whatsapp.net";

        console.log("✅ Connected:", cleanNumber);

        // FAST TEXT
        await sock.sendMessage(userJid, {
          text: "✅ BUGBOT XMD CONNECTED\nType .menu"
        });

        // BRANDED VIDEO MESSAGE
        setTimeout(async () => {
          try {
            const giftVideo = "https://files.catbox.moe/rxvkde.mp4";

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
              video: { url: giftVideo },
              caption,
              gifPlayback: true
            });

          } catch (err) {
            console.log("Video failed:", err.message);
          }
        }, 3000);
      }

      if (connection === "close") {
        const status = lastDisconnect?.error?.output?.statusCode;
        console.log("⚠ Closed:", status);

        if (sessionKey) sessionSockets.delete(sessionKey);

        if (status === DisconnectReason.loggedOut) {
          console.log("❌ Logged out → clearing session");
          cleanSession(sessionPath, sessionKey);
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

/* ================= PAIR ================= */
router.get('/code', async (req,res) => {
  try {
    let number = req.query.number;
    if (!number) return res.json({ code: "Number Required" });

    number = number.replace(/[^0-9]/g,"");
    const sessionPath = path.join(SESSION_ROOT, number);

    // BLOCK MULTIPLE REQUESTS
    if (sessionSockets.has(number)) {
      return res.json({ code: "⚠ Pairing already in progress..." });
    }

    // CLEAN SESSION
    cleanSession(sessionPath, number);

    // PAYMENT REQUIRED (BRANDED)
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

    await new Promise(r => setTimeout(r, 2000));

    const rawCode = await sock.requestPairingCode(number);
    const formatted = rawCode?.match(/.{1,4}/g)?.join("-") || rawCode;

    // BRANDED PAIRING RESPONSE
    return res.json({
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
    return res.json({ code: "❌ Pairing failed, try again" });
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
