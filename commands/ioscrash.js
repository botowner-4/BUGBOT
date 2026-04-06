const { sendIOSCrash } = require('../lib/bugfunctions')

async function ioscrashCommand(sock, chatId, message) {
  try {
    const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || []
    
    if (mentionedJid.length === 0) {
      await sock.sendMessage(chatId, {
        text: '❌ Usage: .ioscrash @user'
      }, { quoted: message })
      return
    }
    
    const target = mentionedJid[0]
    
    await sock.sendMessage(chatId, {
      text: `📱 Sending iOS crash...`
    }, { quoted: message })
    
    await sendIOSCrash(sock, target)
    
    await sock.sendMessage(chatId, {
      text: `✅ iOS crash sent!`
    }, { quoted: message })
    
  } catch (error) {
    console.error('iOS Crash Command Error:', error.message)
    await sock.sendMessage(chatId, {
      text: `❌ Error: ${error.message}`
    }, { quoted: message }).catch(() => {})
  }
}

module.exports = ioscrashCommand;
