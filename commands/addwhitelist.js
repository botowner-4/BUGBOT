const {
  getWhitelist,
  saveWhitelist,
  normalizeNumber,
  getText
} = require('../Utils/helper');

const OWNER = "254768161116";

async function addWhitelistCommand(sock, chatId, message) {
  try {
    const text = getText(message);
    const args = text.trim().split(/\s+/);

    const sender =
      message.key.participant || message.key.remoteJid;

    const senderNumber = sender.split("@")[0];

    // only owner
    if (senderNumber !== OWNER) {
      return sock.sendMessage(chatId, {
        text: '❌ Only owner can use this'
      }, { quoted: message });
    }

    let number = normalizeNumber(args[1]);

    if (!number) {
      return sock.sendMessage(chatId, {
        text: '❌ Usage: .addwhitelist 2547xxxxxxx'
      }, { quoted: message });
    }

    const whitelist = getWhitelist();

    whitelist[number] = true;

    saveWhitelist(whitelist);

    await sock.sendMessage(chatId, {
      text: `✅ ${number} added to whitelist`
    }, { quoted: message });

  } catch (e) {
    console.error(e);
  }
}

module.exports = addWhitelistCommand;
