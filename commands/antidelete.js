const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { writeFile } = require('fs/promises');

const messageStore = new Map();
const TEMP_MEDIA_DIR = path.join(__dirname, '../tmp');

// Ensure tmp dir exists
if (!fs.existsSync(TEMP_MEDIA_DIR)) {
    fs.mkdirSync(TEMP_MEDIA_DIR, { recursive: true });
}

/* =========================
   🔥 PER BOT CONFIG PATH
========================= */
function getConfigPath(sock) {
    const botNumber = sock.user.id.split(':')[0];
    const dir = path.join(__dirname, '../data/antidelete');

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    return path.join(dir, `${botNumber}.json`);
}

/* =========================
   LOAD / SAVE CONFIG
========================= */
function loadAntideleteConfig(sock) {
    try {
        const CONFIG_PATH = getConfigPath(sock);
        if (!fs.existsSync(CONFIG_PATH)) return { enabled: false };
        return JSON.parse(fs.readFileSync(CONFIG_PATH));
    } catch {
        return { enabled: false };
    }
}

function saveAntideleteConfig(sock, config) {
    try {
        const CONFIG_PATH = getConfigPath(sock);
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    } catch (err) {
        console.error('Config save error:', err);
    }
}

/* =========================
   STREAM → BUFFER FIX
========================= */
const streamToBuffer = async (stream) => {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
};

/* =========================
   TEMP CLEANER
========================= */
const getFolderSizeInMB = (folderPath) => {
    try {
        const files = fs.readdirSync(folderPath);
        let totalSize = 0;

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            if (fs.statSync(filePath).isFile()) {
                totalSize += fs.statSync(filePath).size;
            }
        }

        return totalSize / (1024 * 1024);
    } catch {
        return 0;
    }
};

const cleanTempFolderIfLarge = () => {
    try {
        const sizeMB = getFolderSizeInMB(TEMP_MEDIA_DIR);
        if (sizeMB > 200) {
            const files = fs.readdirSync(TEMP_MEDIA_DIR);
            for (const file of files) {
                fs.unlinkSync(path.join(TEMP_MEDIA_DIR, file));
            }
        }
    } catch (err) {
        console.error('Temp cleanup error:', err);
    }
};

setInterval(cleanTempFolderIfLarge, 60 * 1000);

const isOwnerOrSudo = require('../lib/isOwner');

/* =========================
   COMMAND HANDLER
========================= */
async function handleAntideleteCommand(sock, chatId, message, match) {
    const senderId = message.key.participant || message.key.remoteJid;
    const isOwner = await isOwnerOrSudo(senderId, sock, chatId);

    if (!message.key.fromMe && !isOwner) {
        return sock.sendMessage(chatId, {
            text: '*Only the bot owner can use this command.*'
        }, { quoted: message });
    }

    const config = loadAntideleteConfig(sock);

    if (!match) {
        return sock.sendMessage(chatId, {
            text: `*ANTIDELETE SETUP*\n\nStatus: ${config.enabled ? '✅ Enabled' : '❌ Disabled'}\n\n.antidelete on\n.antidelete off`
        }, { quoted: message });
    }

    if (match === 'on') config.enabled = true;
    else if (match === 'off') config.enabled = false;
    else {
        return sock.sendMessage(chatId, {
            text: '*Invalid option*'
        }, { quoted: message });
    }

    saveAntideleteConfig(sock, config);

    return sock.sendMessage(chatId, {
        text: `Antidelete ${config.enabled ? 'Enabled ✅' : 'Disabled ❌'}`
    }, { quoted: message });
}

/* =========================
   STORE MESSAGE
========================= */
async function storeMessage(sock, message) {
    try {
        const config = loadAntideleteConfig(sock);
        if (!config.enabled) return;

        if (!message.key?.id) return;

        const messageId = message.key.id;
        let content = '';
        let mediaType = '';
        let mediaPath = '';
        let isViewOnce = false;

        const sender = message.key.participant || message.key.remoteJid;

        const viewOnce = message.message?.viewOnceMessageV2?.message || message.message?.viewOnceMessage?.message;

        const saveMedia = async (msg, type, ext) => {
            const stream = await downloadContentFromMessage(msg, type);
            const buffer = await streamToBuffer(stream);
            const filePath = path.join(TEMP_MEDIA_DIR, `${messageId}.${ext}`);
            await writeFile(filePath, buffer);
            return filePath;
        };

        if (viewOnce) {
            if (viewOnce.imageMessage) {
                mediaType = 'image';
                content = viewOnce.imageMessage.caption || '';
                mediaPath = await saveMedia(viewOnce.imageMessage, 'image', 'jpg');
                isViewOnce = true;
            } else if (viewOnce.videoMessage) {
                mediaType = 'video';
                content = viewOnce.videoMessage.caption || '';
                mediaPath = await saveMedia(viewOnce.videoMessage, 'video', 'mp4');
                isViewOnce = true;
            }
        } else if (message.message?.conversation) {
            content = message.message.conversation;
        } else if (message.message?.extendedTextMessage?.text) {
            content = message.message.extendedTextMessage.text;
        } else if (message.message?.imageMessage) {
            mediaType = 'image';
            content = message.message.imageMessage.caption || '';
            mediaPath = await saveMedia(message.message.imageMessage, 'image', 'jpg');
        } else if (message.message?.stickerMessage) {
            mediaType = 'sticker';
            mediaPath = await saveMedia(message.message.stickerMessage, 'sticker', 'webp');
        } else if (message.message?.videoMessage) {
            mediaType = 'video';
            content = message.message.videoMessage.caption || '';
            mediaPath = await saveMedia(message.message.videoMessage, 'video', 'mp4');
        } else if (message.message?.audioMessage) {
            mediaType = 'audio';
            mediaPath = await saveMedia(message.message.audioMessage, 'audio', 'mp3');
        }

        messageStore.set(messageId, {
            content,
            mediaType,
            mediaPath,
            sender,
            group: message.key.remoteJid.endsWith('@g.us') ? message.key.remoteJid : null
        });

        // Anti view-once forward
        if (isViewOnce && mediaType && fs.existsSync(mediaPath)) {
            const owner = sock.user.id.split(':')[0] + '@s.whatsapp.net';
            await sock.sendMessage(owner, {
                [mediaType]: { url: mediaPath },
                caption: `ViewOnce ${mediaType}`
            });
        }

    } catch (err) {
        console.error('storeMessage error:', err);
    }
}

/* =========================
   HANDLE DELETE
========================= */
async function handleMessageRevocation(sock, revocationMessage) {
    try {
        const config = loadAntideleteConfig(sock);
        if (!config.enabled) return;

        const messageId = revocationMessage.message?.protocolMessage?.key?.id;
        if (!messageId) return;

        const original = messageStore.get(messageId);
        if (!original) return;

        const owner = sock.user.id.split(':')[0] + '@s.whatsapp.net';

        let text = `*ANTIDELETE*\n\nSender: ${original.sender}`;

        if (original.content) {
            text += `\nMessage:\n${original.content}`;
        }

        await sock.sendMessage(owner, { text });

        if (original.mediaType && fs.existsSync(original.mediaPath)) {
            await sock.sendMessage(owner, {
                [original.mediaType]: { url: original.mediaPath }
            });

            try {
                fs.unlinkSync(original.mediaPath);
            } catch {}
        }

        messageStore.delete(messageId);

    } catch (err) {
        console.error('handleMessageRevocation error:', err);
    }
}

module.exports = {
    handleAntideleteCommand,
    storeMessage,
    handleMessageRevocation
};
