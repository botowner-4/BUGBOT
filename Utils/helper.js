const fs = require("fs");
const path = require("path");

const WHITELIST_FILE = path.join(__dirname, "../whitelist.json");

function ensureWhitelistFile() {
    if (!fs.existsSync(WHITELIST_FILE)) {
        fs.writeFileSync(WHITELIST_FILE, JSON.stringify({}, null, 2));
    }
}

function getWhitelist() {
    ensureWhitelistFile();
    try {
        return JSON.parse(fs.readFileSync(WHITELIST_FILE, "utf-8"));
    } catch {
        return {};
    }
}

function saveWhitelist(data) {
    fs.writeFileSync(WHITELIST_FILE, JSON.stringify(data, null, 2));
}

function normalizeNumber(input) {
    if (!input) return null;
    let number = input.replace(/\D/g, "");
    if (number.startsWith("00")) number = number.slice(2);
    if (number.startsWith("0") && number.length === 10) number = "254" + number.slice(1);
    if (number.length < 10 || number.length > 15) return null;
    return number;
}

function getText(message) {
    return (
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text ||
        message.message?.imageMessage?.caption ||
        message.message?.videoMessage?.caption ||
        ""
    );
}

function getSender(message) {
    const sender = message.key.participant || message.key.remoteJid;
    return sender.split("@")[0];
}

module.exports = {
    getWhitelist,
    saveWhitelist,
    normalizeNumber,
    getText,
    getSender
};
