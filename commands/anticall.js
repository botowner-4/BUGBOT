const fs = require('fs');
const path = require('path');

// ✅ FIX: Make per-bot instead of global
function getAnticallPath(sock) {
    const botNumber = sock?.user?.id?.split(':')[0] || 'unknown';
    const dir = path.join('./data/anticall');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return path.join(dir, `${botNumber}.json`);
}

function readState(sock) {
    try {
        const anticallPath = getAnticallPath(sock);
        if (!fs.existsSync(anticallPath)) return { enabled: false };
        const raw = fs.readFileSync(anticallPath, 'utf8');
        const data = JSON.parse(raw || '{}');
        return { enabled: !!data.enabled };
    } catch {
        return { enabled: false };
    }
}

function writeState(sock, enabled) {
    try {
        if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });
        const anticallPath = getAnticallPath(sock);
        fs.writeFileSync(anticallPath, JSON.stringify({ enabled: !!enabled }, null, 2));
    } catch {}
}

async function anticallCommand(sock, chatId, message, args) {
    const state = readState(sock);
    const sub = (args || '').trim().toLowerCase();

    if (!sub || (sub !== 'on' && sub !== 'off' && sub !== 'status')) {
        await sock.sendMessage(chatId, { text: '*ANTICALL*\n\n.anticall on  - Enable auto-block on incoming calls\n.anticall off - Disable anticall\n.anticall status - Show current status' }, { quoted: message });
        return;
    }

    if (sub === 'status') {
        await sock.sendMessage(chatId, { text: `Anticall is currently *${state.enabled ? 'ON' : 'OFF'}*.` }, { quoted: message });
        return;
    }

    const enable = sub === 'on';
    writeState(sock, enable);
    await sock.sendMessage(chatId, { text: `Anticall is now *${enable ? 'ENABLED' : 'DISABLED'}*.` }, { quoted: message });
}

module.exports = { anticallCommand, readState };
