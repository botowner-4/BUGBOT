const { sendCrashMessage } = require('../lib/bugfunctions')

async function bugCommand(sock, chatId, message) {
  try {
    const rawText = message.message?.conversation || 
                   message.message?.extendedTextMessage?.text || ""
    const parts = rawText.trim().split(/\s+/)
    
    // Get mentioned users
    const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || []
    const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage
    
    // Determine target
    let target = null
    if (mentionedJid.length > 0) {
      target = mentionedJid[0]
    } else if (quotedMessage) {
      target = quotedMessage.participant || message.quoted.sender
    } else {
      await sock.sendMessage(chatId, {
        text: '❌ Please mention or quote a user to send bug'
      }, { quoted: message })
      return
    }
    
    // Get bug type (optional argument)
    const bugType = parts[1] || 'xeontext4'
    
    await sock.sendMessage(chatId, {
      text: `⏳ Sending crash bug to @${target.split('@')[0]}...`
    }, { quoted: message })
    
    await sendCrashMessage(sock, target, bugType)
    
    await sock.sendMessage(chatId, {
      text: `✅ Crash bug sent successfully!`
    }, { quoted: message })
    
  } catch (error) {
    console.error('Bug Command Error:', error.message)
    await sock.sendMessage(chatId, {
      text: `❌ Error: ${error.message}`
    }, { quoted: message }).catch(() => {})
  }
}

module.exports = bugCommand;
