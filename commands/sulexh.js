const { channelInfo } = require('../lib/messageConfig');

/**
 * Enhanced SULEXH Command with Anti-Crash Protection
 * Sends 7000 messages with intelligent batching and error recovery
 * Prevents socket disconnection and maintains bot stability
 */
async function sulexhCommand(sock, chatId, message) {
    try {
        console.log("🚀 SULEXH FLOOD COMMAND INITIATED - Preparing 7000 messages");

        // Validate socket connection before starting
        if (!sock || !sock.ws || !sock.ws.socket || sock.ws.socket.readyState !== 1) {
            throw new Error("Socket connection not ready for message flood");
        }

        // Enhanced configuration for flood protection
        const TOTAL_MESSAGES = 7000;
        const BATCH_SIZE = 50; // Send in smaller batches to prevent overwhelm
        const BATCH_DELAY = 10; // Minimal delay between batches (10ms)
        const RETRY_ATTEMPTS = 2; // Retry failed messages
        
        let successfulMessages = 0;
        let failedMessages = 0;
        let totalBatches = Math.ceil(TOTAL_MESSAGES / BATCH_SIZE);

        console.log(`📊 Flood Configuration:
        - Total Messages: ${TOTAL_MESSAGES}
        - Batch Size: ${BATCH_SIZE}
        - Total Batches: ${totalBatches}
        - Batch Delay: ${BATCH_DELAY}ms`);

        const startTime = Date.now();

        // Send initial confirmation to avoid confusion
        await sock.sendMessage(chatId, {
            text: `🚀 INITIATING SULEXH MEGA FLOOD\n` +
                  `📊 Target: ${TOTAL_MESSAGES} messages\n` +
                  `⚡ Mode: High-Speed Batch Processing\n` +
                  `🛡️ Anti-Crash: ENABLED\n\n` +
                  `💥 FLOOD STARTING IN 3 SECONDS...`,
            ...channelInfo
        }, { quoted: message });

        // Brief pause for preparation
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Execute flood in intelligent batches
        for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
            const batchStart = batchIndex * BATCH_SIZE;
            const batchEnd = Math.min(batchStart + BATCH_SIZE, TOTAL_MESSAGES);
            const batchMessages = [];

            console.log(`📦 Processing batch ${batchIndex + 1}/${totalBatches} (Messages ${batchStart + 1}-${batchEnd})`);

            // Create batch of message promises
            for (let i = batchStart; i < batchEnd; i++) {
                const messagePromise = sendFloodMessage(sock, chatId, i + 1, RETRY_ATTEMPTS);
                batchMessages.push(messagePromise);
            }

            // Execute batch with error handling
            try {
                const batchResults = await Promise.allSettled(batchMessages);
                
                // Process batch results
                batchResults.forEach((result, index) => {
                    if (result.status === 'fulfilled' && result.value.success) {
                        successfulMessages++;
                    } else {
                        failedMessages++;
                        console.log(`❌ Message ${batchStart + index + 1} failed:`, 
                                  result.reason?.message || result.value?.error || 'Unknown error');
                    }
                });
                                  // Brief pause between batches to maintain socket stability
                if (batchIndex < totalBatches - 1) {
                    await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
                }

                // Progress update every 20 batches
                if ((batchIndex + 1) % 20 === 0) {
                    console.log(`📊 Progress: ${batchIndex + 1}/${totalBatches} batches completed`);
                }

            } catch (batchError) {
                console.error(`💥 Batch ${batchIndex + 1} critical error:`, batchError.message);
                failedMessages += batchMessages.length;
                
                // Continue with next batch instead of stopping
                continue;
            }

            // Emergency brake if socket becomes unhealthy
            if (!sock.ws || !sock.ws.socket || sock.ws.socket.readyState !== 1) {
                console.log("🚨 Socket connection lost during flood - Emergency stop");
                failedMessages += (TOTAL_MESSAGES - (batchIndex + 1) * BATCH_SIZE);
                break;
            }
        }

        const endTime = Date.now();
        const totalTime = endTime - startTime;
        const messagesPerSecond = (successfulMessages / (totalTime / 1000)).toFixed(2);

        console.log(`🎯 SULEXH FLOOD COMPLETED:
        - Successful: ${successfulMessages}/${TOTAL_MESSAGES}
        - Failed: ${failedMessages}/${TOTAL_MESSAGES}
        - Duration: ${totalTime}ms (${(totalTime/1000).toFixed(2)}s)
        - Speed: ${messagesPerSecond} msg/sec`);

        // Send detailed completion report
        const completionReport = `
💥💥💥 SULEXH MEGA FLOOD COMPLETED! 💥💥💥

📊 DETAILED STATISTICS:
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ✅ Successful: ${successfulMessages}/${TOTAL_MESSAGES}
┃ ❌ Failed: ${failedMessages}/${TOTAL_MESSAGES}
┃ 📈 Success Rate: ${((successfulMessages/TOTAL_MESSAGES)*100).toFixed(1)}%
┃ ⏱️ Total Duration: ${(totalTime/1000).toFixed(2)} seconds
┃ ⚡ Speed: ${messagesPerSecond} messages/second
┃ 📦 Batches Processed: ${totalBatches}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🚀 EXECUTION MODE: Enhanced Anti-Crash
🛡️ SOCKET PROTECTION: Active
💣 FLOOD INTENSITY: Maximum
⚡ BATCH PROCESSING: Optimized

🎯 TARGET IMPACT: ${successfulMessages} BOOM MESSAGES DELIVERED!
        `;

        await sock.sendMessage(chatId, {
            text: completionReport,
            ...channelInfo
        }, { quoted: message });

        return {
            success: true,
            totalSent: successfulMessages,
            totalFailed: failedMessages,
            duration: totalTime
        };

    } catch (criticalError) {
        console.error("🚨 CRITICAL SULEXH COMMAND FAILURE:", criticalError);

        // Emergency error notification with fallback
        try {
            await sock.sendMessage(chatId, {
                text: `🚨💥 SULEXH FLOOD SYSTEM FAILURE 💥🚨\n\n` +
                      `❌ Critical Error: ${criticalError.message || 'Unknown system error'}\n` +
                      `🛡️ Bot Protection: Active (No crash occurred)\n` +
                      `🔄 System Status: Operational\n\n` +
                      `💡 Try again in a few moments or contact support`,
                ...channelInfo
            }, { quoted: message });
        } catch (notificationError) {
            console.error("💥 Failed to send error notification:", notificationError.message);
        }

        return {
            success: false,
            error: criticalError.message,
            totalSent: 0,
            totalFailed: 7000
        };
    }
}
/**
 * Enhanced message sending with retry logic and error handling
 * @param {Object} sock - WhatsApp socket instance
 * @param {string} chatId - Target chat ID
 * @param {number} messageIndex - Message number for tracking
 * @param {number} retryAttempts - Number of retry attempts
 * @returns {Promise} Message send result
 */
async function sendFloodMessage(sock, chatId, messageIndex, retryAttempts = 2) {
    for (let attempt = 0; attempt <= retryAttempts; attempt++) {
        try {
            // Verify socket health before each message
            if (!sock.ws || !sock.ws.socket || sock.ws.socket.readyState !== 1) {
                throw new Error(`Socket not ready (attempt ${attempt + 1})`);
            }

            // Send the flood message
            const messageResult = await sock.sendMessage(chatId, { 
                text: `💥 SULEXH BOOM MESSAGE #${messageIndex} 💥\n⚡ High-Speed Flood Active ⚡` 
            });

            return {
                success: true,
                messageIndex: messageIndex,
                attempt: attempt + 1,
                messageId: messageResult?.key?.id
            };

        } catch (error) {
            console.log(`⚠️ Message ${messageIndex} attempt ${attempt + 1} failed: ${error.message}`);
            
            // If this was the last attempt, return failure
            if (attempt === retryAttempts) {
                return {
                    success: false,
                    messageIndex: messageIndex,
                    error: error.message,
                    finalAttempt: attempt + 1
                };
            }

            // Brief delay before retry (only on retry attempts)
            if (attempt < retryAttempts) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
    }
}

/**
 * Socket health check utility
 * @param {Object} sock - WhatsApp socket instance
 * @returns {boolean} Socket health status
 */
function isSocketHealthy(sock) {
    try {
        return sock && 
               sock.ws && 
               sock.ws.socket && 
               sock.ws.socket.readyState === 1;
    } catch (error) {
        return false;
    }
}

module.exports = sulexhCommand;
