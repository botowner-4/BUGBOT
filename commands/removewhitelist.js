const {
    getWhitelist,
    saveWhitelist,
    normalizeNumber,
    getText
} = require("../Utils/helper");

async function removeWhitelistCommand(sock, chatId, message) {
    try {
        const text = getText(message);
        const parts = text.trim().split(/\s+/);

        if (!parts[1]) {
            return sock.sendMessage(chatId, {
                text: "❌ Example: .removewhitelist 254712345678"
            }, { quoted: message });
        }

        const number = normalizeNumber(parts[1]);
        const whitelist = getWhitelist();

        if (!number || !whitelist[number]) {
            return sock.sendMessage(chatId, {
                text: `⚠️ ${parts[1]} is not in the whitelist.`
            }, { quoted: message });
        }

        delete whitelist[number];
        saveWhitelist(whitelist);

        await sock.sendMessage(chatId, {
            text: `✅ ${number} removed from whitelist.`
        }, { quoted: message });

    } catch (err) {
        console.error("REMOVE WHITELIST ERROR:", err);
        sock.sendMessage(chatId, {
            text: "❌ Failed to remove number."
        }, { quoted: message });
    }
}

module.exports = removeWhitelistCommand;
