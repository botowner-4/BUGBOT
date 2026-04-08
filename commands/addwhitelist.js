const {
  getWhitelist,
  saveWhitelist,
  normalizeNumber,
  getText
} = require('../Utils/helper');

async function addWhitelistCommand(sock, chatId, message) {
  try {
    const text = getText(message);
    const args = text.trim().split(/\s+/);

    // ✅ normalize number
    let number = normalizeNumber(args[1]);

    // ❌ no number provided
    if (!number) {
      return sock.sendMessage(chatId, {
        text: '❌ Usage: .addwhitelist 2547xxxxxxx'
      }, { quoted: message });
    }

    const whitelist = getWhitelist();

    // ⚠️ already exists
    if (whitelist[number]) {
      return sock.sendMessage(chatId, {
        text: `⚠️ ${number} already whitelisted`
      }, { quoted: message });
    }

    // ✅ add to whitelist
    whitelist[number] = true;

    saveWhitelist(whitelist);

    await sock.sendMessage(chatId, {
      text: `✅ ${number} added to whitelist`
    }, { quoted: message });

  } catch (e) {
    console.error("ADD WHITELIST ERROR:", e);

    await sock.sendMessage(chatId, {
      text: '❌ Failed to add whitelist'
    }, { quoted: message });
  }
}

module.exports = addWhitelistCommand;
