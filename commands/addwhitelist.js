const {
  getWhitelist,
  saveWhitelist,
  normalizeNumber,
  getText
} = require('../Utils/helper');

async function addWhitelistCommand(sock, chatId, message) {
  try {
    // ❌ allow ONLY bot account messages
    if (!message.key.fromMe) {
      return sock.sendMessage(chatId, {
        text: '❌ This command can only be used by the bot owner'
      }, { quoted: message });
    }

    // ❌ block group (optional but recommended)
    if (chatId.endsWith('@g.us')) {
      return sock.sendMessage(chatId, {
        text: '❌ Use this command in private chat'
      }, { quoted: message });
    }

    // ✅ get text
    const text = getText(message);
    const args = text.trim().split(/\s+/);

    let number = normalizeNumber(args[1]);

    // ❌ invalid input
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

    // ✅ add
    whitelist[number] = true;
    saveWhitelist(whitelist);

    await sock.sendMessage(chatId, {
      text: `✅ ${number} added to whitelist`
    }, { quoted: message });

  } catch (err) {
    console.error("ADD WHITELIST ERROR:", err);

    await sock.sendMessage(chatId, {
      text: '❌ Failed to add whitelist'
    }, { quoted: message });
  }
}

module.exports = addWhitelistCommand;
