const fs = require('fs');
const path = require('path');

function readJsonSafe(filePath, fallback) {
    try {
        if (fs.existsSync(filePath)) {
            const txt = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(txt);
        }
        return fallback;
    } catch (_) {
        return fallback;
    }
}

const isOwnerOrSudo = require('../lib/isOwner');

async function settingsCommand(sock, chatId, message) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        const isOwner = await isOwnerOrSudo(senderId, sock, chatId);
        
        if (!message.key.fromMe && !isOwner) {
            await sock.sendMessage(chatId, { text: 'Only bot owner can use this command!' }, { quoted: message });
            return;
        }

        // ✅ FIX 1: Extract bot number from sock.user.id
        const botNumber = sock.user?.id?.split(':')[0] || 'unknown';
        const dataDir = './data';

        // ✅ FIX 2: Use path.join with actual bot number instead of <number> placeholder
        const mode = readJsonSafe(path.join(dataDir, 'messageCount', `${botNumber}.json`), { isPublic: true });
        const autoStatus = readJsonSafe(path.join(dataDir, 'autoStatus', `${botNumber}.json`), { enabled: false });
        const autoread = readJsonSafe(path.join(dataDir, 'autoread', `${botNumber}.json`), { enabled: false });
        const autotyping = readJsonSafe(path.join(dataDir, 'autotyping', `${botNumber}.json`), { enabled: false });
        const autorecording = readJsonSafe(path.join(dataDir, 'autorecording', `${botNumber}.json`), { enabled: false });
        // ✅ FIX 3: alwaysoffline uses 'alwaysOffline' property, not 'enabled'
        const alwaysoffline = readJsonSafe(path.join(dataDir, 'alwaysoffline', `${botNumber}.json`), { alwaysOffline: false });
        const pmblocker = readJsonSafe(path.join(dataDir, 'pmblocker', `${botNumber}.json`), { enabled: false });
        const anticall = readJsonSafe(path.join(dataDir, 'anticall', `${botNumber}.json`), { enabled: false });
        const autolikestatus = readJsonSafe(path.join(dataDir, 'autolikestatus', `${botNumber}.json`), { enabled: false });
        const antiedit = readJsonSafe(path.join(dataDir, 'antiedit', `${botNumber}.json`), { enabled: false });
        const userGroupData = readJsonSafe(path.join(dataDir, 'userGroupData.json'), {
            antilink: {}, antibadword: {}, welcome: {}, goodbye: {}, chatbot: {}, antitag: {}
        });
        const autoReaction = Boolean(userGroupData.autoReaction);

        const groupId = chatId.endsWith('@g.us') ? chatId : null;
        const antilinkOn = groupId ? Boolean(userGroupData.antilink && userGroupData.antilink[groupId]) : false;
        const antibadwordOn = groupId ? Boolean(userGroupData.antibadword && userGroupData.antibadword[groupId]) : false;
        const welcomeOn = groupId ? Boolean(userGroupData.welcome && userGroupData.welcome[groupId]) : false;
        const goodbyeOn = groupId ? Boolean(userGroupData.goodbye && userGroupData.goodbye[groupId]) : false;
        const chatbotOn = groupId ? Boolean(userGroupData.chatbot && userGroupData.chatbot[groupId]) : false;
        const antitagCfg = groupId ? (userGroupData.antitag && userGroupData.antitag[groupId]) : null;

        const lines = [];
        lines.push('*BOT SETTINGS*');
        lines.push('');
        lines.push(`• Mode: ${mode.isPublic ? 'Public' : 'Private'}`);
        lines.push(`• Auto Status: ${autoStatus.enabled ? 'ON' : 'OFF'}`);
        lines.push(`• Autoread: ${autoread.enabled ? 'ON' : 'OFF'}`);
        lines.push(`• Autotyping: ${autotyping.enabled ? 'ON' : 'OFF'}`);
        lines.push(`• PM Blocker: ${pmblocker.enabled ? 'ON' : 'OFF'}`);
        lines.push(`• Anticall: ${anticall.enabled ? 'ON' : 'OFF'}`);
        lines.push(`• Auto Reaction: ${autoReaction ? 'ON' : 'OFF'}`);
        lines.push(`• Autorecording: ${autorecording.enabled ? 'ON' : 'OFF'}`);
        // ✅ FIX 4: Use correct property 'alwaysOffline'
        lines.push(`• Always Offline: ${alwaysoffline.alwaysOffline ? 'ON' : 'OFF'}`);
        lines.push(`• Autolikestatus: ${autolikestatus.enabled ? 'ON' : 'OFF'}`);
        lines.push(`• Antiedit: ${antiedit.enabled ? 'ON' : 'OFF'}`);
        if (groupId) {
            lines.push('');
            lines.push(`Group: ${groupId}`);
            if (antilinkOn) {
                const al = userGroupData.antilink[groupId];
                lines.push(`• Antilink: ON (action: ${al.action || 'delete'})`);
            } else {
                lines.push('• Antilink: OFF');
            }
            if (antibadwordOn) {
                const ab = userGroupData.antibadword[groupId];
                lines.push(`• Antibadword: ON (action: ${ab.action || 'delete'})`);
            } else {
                lines.push('• Antibadword: OFF');
            }
            lines.push(`• Welcome: ${welcomeOn ? 'ON' : 'OFF'}`);
            lines.push(`• Goodbye: ${goodbyeOn ? 'ON' : 'OFF'}`);
            lines.push(`• Chatbot: ${chatbotOn ? 'ON' : 'OFF'}`);
            if (antitagCfg && antitagCfg.enabled) {
                lines.push(`• Antitag: ON (action: ${antitagCfg.action || 'delete'})`);
            } else {
                lines.push('• Antitag: OFF');
            }
        } else {
            lines.push('');
            lines.push('Note: Per-group settings will be shown when used inside a group.');
        }

        await sock.sendMessage(chatId, { text: lines.join('\n') }, { quoted: message });
    } catch (error) {
        console.error('Error in settings command:', error);
        await sock.sendMessage(chatId, { text: 'Failed to read settings.' }, { quoted: message });
    }
}

module.exports = settingsCommand;
