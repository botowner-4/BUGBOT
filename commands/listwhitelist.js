const { getWhitelist } = require("../utils/helper");

async function listWhitelistCommand(sock, chatId, message) {
    try {
        const whitelist = getWhitelist();
        const numbers = Object.keys(whitelist);

        if (numbers.length === 0) {
            return sock.sendMessage(chatId, {
                text: "📭 Whitelist is empty."
            }, { quoted: message });
        }

        let text = "📋 *Whitelisted Numbers:*\n\n";
        numbers.forEach((num, i) => {
            text += `${i + 1}. ${num}\n`;
        });

        await sock.sendMessage(chatId, { text }, { quoted: message });

    } catch (err) {
        console.error("LIST WHITELIST ERROR:", err);
        sock.sendMessage(chatId, {
            text: "❌ Failed to list whitelist."
        }, { quoted: message });
    }
}

module.exports = listWhitelistCommand;
