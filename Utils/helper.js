const fs = require("fs");
const path = require("path");

const WHITELIST_FILE = path.join(__dirname, "../whitelist.json");
const PAYMENT_FILE = path.join(__dirname, "../payment.json");

// ensure files exist
function ensureFile(file) {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify({}, null, 2));
    }
}

// whitelist
function getWhitelist() {
    ensureFile(WHITELIST_FILE);
    try {
        return JSON.parse(fs.readFileSync(WHITELIST_FILE, "utf-8"));
    } catch {
        return {};
    }
}

function saveWhitelist(data) {
    fs.writeFileSync(WHITELIST_FILE, JSON.stringify(data, null, 2));
}

// payments
function getPayments() {
    ensureFile(PAYMENT_FILE);
    try {
        return JSON.parse(fs.readFileSync(PAYMENT_FILE, "utf-8"));
    } catch {
        return {};
    }
}

// ✅ whitelist check
function isWhitelisted(senderNumber) {
    const whitelist = getWhitelist();
    const payments = getPayments();

    const OWNER = "254768161116";

    // owner always allowed
    if (senderNumber === OWNER) return true;

    // normal whitelist
    if (whitelist[senderNumber]) return true;

    // payment whitelist
    if (payments[senderNumber]) {
        const user = payments[senderNumber];

        if (user.paid === true) {
            if (!user.expiry) return true;

            const today = new Date();
            const expiry = new Date(user.expiry);

            if (today <= expiry) return true;
        }
    }

    return false;
}

// normalize number
function normalizeNumber(input) {
    if (!input) return null;

    let number = input.replace(/\D/g, "");

    if (number.startsWith("00")) number = number.slice(2);
    if (number.startsWith("0") && number.length === 10) {
        number = "254" + number.slice(1);
    }

    if (number.length < 10 || number.length > 15) return null;

    return number;
}

// message text
function getText(message) {
    return (
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text ||
        message.message?.imageMessage?.caption ||
        message.message?.videoMessage?.caption ||
        ""
    );
}

// sender
function getSender(message) {
    const sender = message.key.participant || message.key.remoteJid;
    return sender.split("@")[0];
}

// JID
function toJid(number) {
    return number + "@s.whatsapp.net";
}

module.exports = {
    getWhitelist,
    saveWhitelist,
    getPayments,
    isWhitelisted,
    normalizeNumber,
    getText,
    getSender,
    toJid
};
