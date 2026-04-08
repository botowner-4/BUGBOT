const fs = require('fs');
const settings = require('../settings');

async function helpCommand(sock, chatId, message) {
  try {
    const videoPath = './assets/tiktokio.com1773559733_p0JOPHudQO0K6WDVT4KK.mp4';
    let videoBuffer;

    try {
      videoBuffer = fs.readFileSync(videoPath);
    } catch (err) {
      console.warn(`⚠️ Video not found at ${videoPath}, sending text-only menu.`);
    }

    const helpMessage = `
> 𝐁𝐎𝐎𝐓𝐈𝐍𝐆 𝓤𝐋𝐓𝐑𝐀_𝓒𝐎𝐑𝐄.𝐒𝐘𝐒 ...
> 𝓛𝓸𝓪𝓭𝓲𝓷𝓰 𝓒𝓸𝓼𝓶𝓲𝓬 𝓜𝐨𝐝𝐮𝐥𝐞𝓼 ...
> 𝓣𝓻𝓪𝓷𝓼𝓬𝓮𝓷𝓭𝓲𝓷𝓰 𝓛𝓲𝓶𝐢𝐭𝓼...
> 𝓐𝓬𝓽𝓲𝓿𝓪𝓽𝓲𝓷𝓰 𝓐𝐋𝐈𝐕𝐄 𝓣𝐄𝐑𝐌𝐈𝐍𝐀𝐋 ...

[▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒] 10%
[▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒] 27%
[▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒] 58%
[▓▓▓▓▓▓▓▓▒▒▒▒▒▒] 87%
[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100% ✅

✨ 𝓐𝓘 𝓒𝓸𝓻𝓮 : 𝐎𝐌𝐍𝐈𝐕𝐄𝐑𝐒𝐄 𝐋𝐈𝐕𝐄
🌌 𝓒𝓸𝓼𝓶𝓲𝓬 𝓟𝓸𝔀𝓮𝓻 : ∞∞∞∞
💀 𝓐𝓾𝓽𝐇 𝓛𝐞𝓿𝐞𝐥 : ☠️ BUGBOT v15+
📡 𝓝𝐞𝓽𝔀𝓸𝓻𝐤 : MULTIDEVICE
🛡️ 𝓕𝓲𝓻𝐞𝐰𝐚𝐥𝐥 : UNBREAKABLE
⏱ 𝓤𝓟𝓣𝐈𝓜𝐄 : ${process.uptime().toFixed(0)}s
🔓 𝓐𝓒𝐂𝐄𝓢𝐒 : UNLIMITED

╔════════════════════════════════════════════╗
║ 👁️ 𝓢𝓤𝓛𝓔𝓧𝓗 BUGBOT TERMINAL v15.0 ║
╠════════════════════════════════════════════╣
║ 👤 𝓤𝓢𝓔𝓡 : ${message.pushName || "User"}
║ 👑 𝓡𝐀𝐍𝐊 : ☠️ BUGBOT v15+
║ 📍 𝓛𝐎𝐂𝐀𝐓𝐈𝐎𝐍 : Nairobi, KE
║ 🕒 𝓣𝐈𝐌𝐄 : ${new Date().toLocaleTimeString()}
║ ⚡ 𝓜𝓞𝐃𝐄 : ${settings.mode || "Public"}
╚════════════════════════════════════════════╝

╭────────────────────────────⬣
│ 🧠 𝓖𝐄𝐍𝐄𝐑𝐀𝐋 𝓒𝓸𝓡𝐄
├────────────────────────────
│ ✦ .help
│ ✦ .menu
│ ✦ .alive
│ ✦ .ping
│ ✦ .owner
│ ✦ .fact
│ ✦ .joke
│ ✦ .quote
│ ✦ .weather <city>
│ ✦ .news
│ ✦ .tts <text>
│ ✦ .attp <text>
│ ✦ .lyrics <song>
│ ✦ .8ball <question>
│ ✦ .groupinfo
│ ✦ .staff
│ ✦ .admins
│ ✦ .vv
│ ✦ .announcement
│ ✦ .antiedit on/off
│ ✦ .dpdownload
│ ✦ .alwaysoffline on/off
│ ✦ .autostatuslike on/off
│ ✦ .v
│ ✦ .trt <text> <lang>
│ ✦ .ss <link>
│ ✦ .jid
│ ✦ .url
│ ✦ .quran menu
│ ✦ .Hadith
│ ✦ .βƲǤΜЄИƲ
╰────────────────────────────⬣

╭────────────────────────────⬣
│ ☠️ 𝓖𝐎𝐃+ 𝓑𝐔𝐆 𝓔𝐍𝐆𝐈𝐍𝐄
├────────────────────────────
│ ✦ .bug @user
│ ✦ .spamcrash @user
│ ✦ .ioscrash
│ ✦ .pair
│ ✦ .user
│ ✦ .depair
│ ✦ .REALITY BYPASS
╰────────────────────────────⬣

╭────────────────────────────⬣
│ 🛡️ 𝓐𝐃𝐌𝐈𝐍 𝓟𝐎𝐖𝐄𝐑
├────────────────────────────
│ ✦ .ban@254
│ ✦ .promote@91
│ ✦ .demote@234
│ ✦ .mute <minutes>
│ ✦ .unmute
│ ✦ .delete
│ ✦ .del
│ ✦ .kick @user
│ ✦ .warnings @user
│ ✦ .warn @user
│ ✦ .antilink
│ ✦ .antibadword
│ ✦ .clear
│ ✦ .tag <message>
│ ✦ .tagall
│ ✦ .tagnotadmin
│ ✦ .hidetag <message>
│ ✦ .chatbot
│ ✦ .resetlink
│ ✦ .antitag on/off
│ ✦ .welcome on/off
│ ✦ .goodbye on/off
│ ✦ .setgdesc
│ ✦ .setgname
│ ✦ .setgpp
╰────────────────────────────⬣

╭────────────────────────────⬣
│ 👑 𝓞𝓦𝐍𝐄𝐑 𝓜𝐎𝐃𝐔𝐋𝐄
├────────────────────────────
│ ✦ .mode public
│ ✦ .mode private
│ ✦ .clearsession
│ ✦ .antidelete
│ ✦ .cleartmp
│ ✦ .update
│ ✦ .settings
│ ✦ .setpp
│ ✦ .autoreact
│ ✦ .autostatus
│ ✦ .autostatus react
│ ✦ .autotyping
│ ✦ .autorecording
│ ✦ .alwaysonline
│ ✦ .autoread
│ ✦ .anticall
│ ✦ .pmblocker
│ ✦ .pmblocker setmsg
│ ✦ .setmention
│ ✦ .mention
╰────────────────────────────⬣

╭────────────────────────────⬣
│ 🎨 𝓘𝐌𝐀𝐆𝐄 𝓛𝐀𝐁 — 𝓒𝐎𝐒𝐌𝐈𝐂
├────────────────────────────
│ ✦ .sticker
│ ✦ .simage
│ ✦ .blur
│ ✦ .removebg
│ ✦ .remini
│ ✦ .crop
│ ✦ .meme
│ ✦ .take
│ ✦ .emojimix
│ ✦ .tgsticker
│ ✦ .igs
│ ✦ .igsc
╰────────────────────────────⬣

╭────────────────────────────⬣
│ 📥 𝓓𝐎𝓦𝐍𝐋𝐎𝐀𝐃 𝓗𝐔𝐁 — 𝓘𝐍𝐅𝐈𝐍𝐈𝐓𝐄
├────────────────────────────
│ ✦ .play <song>
│ ✦ .song <song>
│ ✦ .spotify
│ ✦ .instagram
│ ✦ .facebook
│ ✦ .tiktok
│ ✦ .video
│ ✦ .ytmp4
│ ✦ .mediafire
│ ✦ .apk
╰────────────────────────────⬣

╭────────────────────────────⬣
│ 🎮 𝓕𝐔𝐍 𝓩𝐎𝐍𝐄 — 𝓒𝐎𝐒𝐌𝐈𝐂
├────────────────────────────
│ ✦ .truth
│ ✦ .dare
│ ✦ .riddle
│ ✦ .rate
│ ✦ .ship
│ ✦ .fact
│ ✦ .quote
╰────────────────────────────⬣
╭────────────────────────────⬣
│ 🔗 𝓑𝓞𝓣 𝓟𝓐𝐈𝓡𝐈𝐍𝐆 𝓢𝐘𝐒𝐓𝐄𝐌
├────────────────────────────
│ ✦ 🌐 LINK DEVICE PORTAL:
│ ✦ https://bugbot-1-8b2q.onrender.com
│ ✦ ⚡ Scan QR & Connect Instantly
│ ✦ 🔐 Secure Multi-Device Pairing
╰────────────────────────────⬣
╔════════════════════════════════════════════╗
║ ⚡ 𝓢𝓤𝓛𝓔𝓧𝓗 TECH LAB — BUGBOT LIVE TERMINAL ║
║ 💀 DOMINANCE • CONTROL • INFINITE POWER     ║
╚════════════════════════════════════════════╝

> SYSTEM READY...
> LIVE TERMINAL LOGS ACTIVE...
> COSMIC INTERFACE ONLINE...
💀 THIS ~βƲǤβѲƬ~ WAS MADE IN BUGFIXED SULEXH TECH LAB
⚡ TESTED & VERIFIED TO ƆЯ𝗔ƧĦ ƬĦЄ Ƭ𝗔ЯǤЄƬ ƜĦ𝗔ƬƧ𝗔ƤƤ ƜƖƬĦ ѲИЄ ƆѲΜΜ𝗔ИƉ
💻 TECHNOLOGY IMPROVEMENT & ƤƲИƖƧĦ ƧƆ𝗔ΜΜЄЯƧ/Ħ𝗔ƆƘЄЯƧ

`;

    const messageContent = {
      caption: helpMessage,
      footer: "👑 BUGFIXED SULEXH TECH LAB",
      buttons: [
        { buttonId: "https://chat.whatsapp.com/GyZBMUtrw9LIlV6htLvkCK?mode=gi_t", buttonText: { displayText: "🔔 JOIN GROUP" }, type: 1 },
        { buttonId: "https://wa.me/254768161116", buttonText: { displayText: "👑 CONTACT OWNER" }, type: 1 }
      ],
      headerType: 5
    };

    if (videoBuffer) {
      messageContent.video = videoBuffer;
      messageContent.gifPlayback = true;
    }

    await sock.sendMessage(chatId, messageContent, { quoted: message });

  } catch (error) {
    console.error("HEAVY GLITCH BUGBOT MENU ERROR:", error);
    await sock.sendMessage(chatId, { text: "👑 BUGBOT MENU FAILED TO LOAD" }, { quoted: message });
  }
}

module.exports = helpCommand;
