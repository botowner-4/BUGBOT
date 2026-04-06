/**
 * smsg.js - Standardized Message Handler
 * Converts raw WhatsApp messages into easy-to-use format
 */

const axios = require('axios');

/**
 * Standardize WhatsApp messages
 */
const smsg = (conn, m, store = {}) => {
    // Create clean message object
    let M = Object.create(Object.prototype);
    M = m;
    
    // Get message type (textMessage, imageMessage, etc.)
    M.mtype = Object.keys(m.message)[0];
    
    // Get actual message content
    M.msg = M.mtype === 'ephemeralMessage' 
        ? m.message.ephemeralMessage.message[Object.keys(m.message.ephemeralMessage.message)[0]]
        : m.message[M.mtype];
    
    // Extract text body
    M.body = M.msg?.text || M.msg?.caption || M.msg?.contentText || M.msg || '';
    
    // Who sent it?
    M.from = m.key.fromMe ? conn.user.id : (m.participant || m.key.participant || m.key.remoteJid || '');
    
    // Is it a group message?
    M.isGroup = (m.key.remoteJid || '').endsWith('@g.us');
    
    // Sender number
    M.sender = m.key.fromMe ? conn.user.id : m.participant || m.key.participant || m.key.remoteJid;
    
    // Chat ID
    M.chat = m.key.remoteJid;
    
    // Get quoted (replied) message
    M.getQuotedObj = () => m.message.extendedTextMessage?.contextInfo?.quotedMessage || null;
    
    // Quick reply function
    M.reply = (text) => conn.sendMessage(M.chat, { text }, { quoted: m });
    
    // Get mentioned users
    M.getMentioned = () => m.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
    
    return M;
};

/**
 * Download file as buffer
 */
const fetchBuffer = async (url, options = {}) => {
    try {
        const res = await axios.get(url, { 
            responseType: 'arraybuffer', 
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            ...options 
        });
        return res.data;
    } catch (err) {
        console.error('fetchBuffer error:', err.message);
        throw err;
    }
};

/**
 * Sleep/delay function
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = { smsg, fetchBuffer, delay };
