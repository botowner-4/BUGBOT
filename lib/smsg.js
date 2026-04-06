const myfunc = require('./myfunc');

const smsg = (conn, m, store) => {
    // Function implementation for smsg
    if (!m) return m;
    
    let M = Object.create(Object.prototype);
    M = m;
    M.mtype = Object.keys(m.message)[0];
    M.msg = M.mtype === 'ephemeralMessage' 
        ? m.message.ephemeralMessage.message[Object.keys(m.message.ephemeralMessage.message)[0]] 
        : m.message[M.mtype];
    
    M.body = M.msg.text || M.msg.caption || M.msg.contentText || M.msg || '';
    M.from = m.key.fromMe ? conn.user.id : (m.participant || m.key.participant || m.key.remoteJid || '');
    M.isGroup = (m.key.remoteJid || '').endsWith('@g.us');
    M.sender = m.key.fromMe ? conn.user.id : m.participant || m.key.participant || m.key.remoteJid;
    M.chat = m.key.remoteJid;
    
    M.getQuotedObj = () => m.message.extendedTextMessage?.contextInfo?.quotedMessage || null;
    M.reply = (text) => conn.sendMessage(M.chat, { text: text }, { quoted: m });
    
    return M;
};

const fetchBuffer = async (url, options = {}) => {
    try {
        const res = await require('axios').get(url, { responseType: 'arraybuffer', ...options });
        return res.data;
    } catch (err) {
        return err;
    }
};

const delay = (ms) => new Promise(r => setTimeout(r, ms));

module.exports = { smsg, fetchBuffer, delay };
