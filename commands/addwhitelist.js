const {
    getWhitelist,
    saveWhitelist,
    normalizeNumber,
    getText
} = require("../utils/helper");

async function addWhitelistCommand(sock, chatId, message) {
    try {
        const text = getText(message);
        const parts = text.trim().split(/\s+/);

        if (!parts[1]) {
            return sock.sendMessage(chatId, {
                text: "❌ Example: .addwhitelist 254712345678"
            }, { quoted: message });
        }

        const number = normalizeNumber(parts[1]);

        if (!number) {
            return sock.sendMessage(chatId, {
                text: "❌ Invalid number. Use international format (e.g., 254712345678)"
            }, { quoted: message });
        }

        const whitelist = getWhitelist();

        if (whitelist[number]) {
            return sock.sendMessage(chatId, {
                text: `⚠️ ${number} is already whitelisted.`
            }, { quoted: message });
        }

        whitelist[number] = true;
        saveWhitelist(whitelist);

        await sock.sendMessage(chatId, {
            text: `✅ ${number} added to whitelist.`
        }, { quoted: message });

    } catch (err) {
        console.error("ADD WHITELIST ERROR:", err);
        sock.sendMessage(chatId, {
            text: "❌ Failed to add number."
        }, { quoted: message });
    }
}

module.exports = addWhitelistCommand;
