const settings = require('../settings');

async function helpCommand(sock, chatId, message) {
  try {
    const imageURL = "https://i.imgur.com/MJIZMZT.jpg"; // banner

    const helpMessage = `
╭═══════════════════════════╮
💀 ⚡ HEAVY BUGBOT XMD ACTIVE ⚡ 💀
────────────────────────────
╭───〔 🤖 ${settings.botName || "BUGBOT XMD"} 〕───⬣
│ 👤 User : ${message.pushName || "User"}
│ ⚡ Mode : ${settings.mode || "Public"}
│ ⏱ Uptime : ${process.uptime().toFixed(0)}s
│ 🔥 SYSTEM SCAN : ACTIVE
╰────────────────────────────

╭────────────────────────────⬣
│ ░█▀▀█ ░█▀▀▀ ░█▀▄▀█ ░█▀▀█ ░█▀▀▀
│ ░█─── ░█▀▀▀ ░█░█░█ ░█▀▀▄ ░█▀▀▀
│ ░█▄▄█ ░█▄▄▄ ░█──░█ ░█▄▄█ ░█▄▄▄
│
│ ★̷ ✨̷ | ⭐̷ | ✨̷ | ⭐̷ | ✨̷
│ ★̷ ✨̷ | ⭐̷ | ✨̷ | ⭐̷
│ ★̷ ✨̷ | ⭐̷ | ✨̷
│ ★̷ ✨̷ | ⭐̷
│ ★̷ ✨̷

│ ⭐◇GENERAL◇⭐
│──────────────
│ ★̷ .help
│ ★̷ .menu
│ ★̷ .alive
│ ★̷ .ping
│ ★̷ .owner
│ ★̷ .fact
│ ★̷ .joke
│ ★̷ .quote
│ ★̷ .weather <city>
│ ★̷ .news
│ ★̷ .tts <text>
│ ★̷ .attp <text>
│ ★̷ .lyrics <song>
│ ★̷ .8ball <question>
│ ★̷ .groupinfo
│ ★̷ .staff
│ ★̷ .admins
│ ★̷ .vv
│ ★̷ .v
│ ★̷ .trt <text> <lang>
│ ★̷ .ss <link>
│ ★̷ .jid
│ ★̷ .url
│ ★̷ .quran menu
│ ★̷ .bugmenu(hidden from premium users only)
╰────────────────────────────⬣

╭────────────────────────────⬣
│ ★̷ ✨̷ | ⭐̷ | ✨̷ | ⭐̷ | ✨̷
│ ★̷ ✨̷ | ⭐̷ | ✨̷ | ⭐̷
│ ★̷ ✨̷ | ⭐̷ | ✨̷
│ ★̷ ✨̷ | ⭐̷
│ ★̷ ✨̷

│ ⭐◇ADMIN◇⭐
│──────────────
│ ★̷ .ban @user
│ ★̷ .promote @user
│ ★̷ .demote @user
│ ★̷ .mute <minutes>
│ ★̷ .unmute
│ ★̷ .delete
│ ★̷ .del
│ ★̷ .kick @user
│ ★̷ .warnings @user
│ ★̷ .warn @user
│ ★̷ .antilink
│ ★̷ .antibadword
│ ★̷ .clear
│ ★̷ .tag <message>
│ ★̷ .tagall
│ ★̷ .tagnotadmin
│ ★̷ .hidetag <message>
│ ★̷ .chatbot
│ ★̷ .resetlink
│ ★̷ .antitag on/off
│ ★̷ .welcome on/off
│ ★̷ .goodbye on/off
│ ★̷ .setgdesc
│ ★̷ .setgname
│ ★̷ .setgpp
╰────────────────────────────⬣

╭────────────────────────────⬣
│ ★̷ ✨̷ | ⭐̷ | ✨̷ | ⭐̷ | ✨̷
│ ★̷ ✨̷ | ⭐̷ | ✨̷ | ⭐̷
│ ★̷ ✨̷ | ⭐̷ | ✨̷
│ ★̷ ✨̷ | ⭐̷
│ ★̷ ✨̷

│ ⭐◇OWNER◇⭐
│──────────────
│ ★̷ .mode public
│ ★̷ .mode private
│ ★̷ .clearsession
│ ★̷ .antidelete
│ ★̷ .cleartmp
│ ★̷ .update
│ ★̷ .settings
│ ★̷ .setpp
│ ★̷ .autoreact
│ ★̷ .autostatus
│ ★̷ .autostatus react
│ ★̷ .autotyping
│ ★̷ .autorecording
│ ★̷ .alwaysonline
│ ★̷ .autoread
│ ★̷ .anticall
│ ★̷ .pmblocker
│ ★̷ .pmblocker setmsg
│ ★̷ .setmention
│ ★̷ .mention
╰────────────────────────────⬣

╭────────────────────────────⬣
│ ★̷ ✨̷ | ⭐̷ | ✨̷ | ⭐̷ | ✨̷
│ ★̷ ✨̷ | ⭐̷ | ✨̷ | ⭐̷
│ ★̷ ✨̷ | ⭐̷ | ✨̷
│ ★̷ ✨̷ | ⭐̷
│ ★̷ ✨̷

│ ⭐◇BUGFIXED◇⭐
│──────────────
│ ★̷ .pair <number>
│ ★̷ .user
│ ★̷ .depair <number>
╰────────────────────────────⬣

╭────────────────────────────⬣
│ ★̷ ✨̷ | ⭐̷ | ✨̷ | ⭐̷ | ✨̷
│ ★̷ ✨̷ | ⭐̷ | ✨̷ | ⭐̷
│ ★̷ ✨̷ | ⭐̷ | ✨̷
│ ★̷ ✨̷ | ⭐̷
│ ★̷ ✨̷

│ ⭐◇IMAGE LAB◇⭐
│──────────────
│ ★̷ .sticker
│ ★̷ .simage
│ ★̷ .blur
│ ★̷ .removebg
│ ★̷ .remini
│ ★̷ .crop
│ ★̷ .meme
│ ★̷ .take <packname>
│ ★̷ .emojimix
│ ★̷ .tgsticker
│ ★̷ .igs
│ ★̷ .igsc
╰────────────────────────────⬣

╭────────────────────────────⬣
│ ★̷ ✨̷ | ⭐̷ | ✨̷ | ⭐̷ | ✨̷
│ ★̷ ✨̷ | ⭐̷ | ✨̷ | ⭐̷
│ ★̷ ✨̷ | ⭐̷ | ✨̷
│ ★̷ ✨̷ | ⭐̷
│ ★̷ ✨̷

│ ⭐◇DOWNLOAD◇⭐
│──────────────
│ ★̷ .play <song>
│ ★̷ .song <song>
│ ★̷ .spotify
│ ★̷ .instagram
│ ★̷ .facebook
│ ★̷ .tiktok
│ ★̷ .video
│ ★̷ .ytmp4
│ ★̷ .mediafire
│ ★̷ .apk
╰────────────────────────────⬣

╭────────────────────────────⬣
│ ★̷ ✨̷ | ⭐̷ | ✨̷ | ⭐̷ | ✨̷
│ ★̷ ✨̷ | ⭐̷ | ✨̷ | ⭐̷
│ ★̷ ✨̷ | ⭐̷ | ✨̷
│ ★̷ ✨̷ | ⭐̷
│ ★̷ ✨̷

│ ⭐◇FUN◇⭐
│──────────────
│ ★̷ .truth
│ ★̷ .dare
│ ★̷ .riddle
│ ★̷ .rate
│ ★̷ .ship
│ ★̷ .fact
│ ★̷ .quote
╰────────────────────────────⬣

💀 THIS BUGBOT WAS MADE IN BUGFIXED SULEXH TECH LAB
⚡ TESTED & VERIFIED TO CRASH WHATSAPP SAFELY
💻 TECHNOLOGY IMPROVEMENT & PUNISH SCAMMERS/HACKERS
`;

    await sock.sendMessage(chatId, {
      image: { url: imageURL },
      caption: helpMessage,
      footer: "👑 BUGFIXED SULEXH TECH LAB",
      buttons: [
        {
          buttonId: "https://chat.whatsapp.com/GyZBMUtrw9LIlV6htLvkCK?mode=gi_t",
          buttonText: { displayText: "🔔 JOIN GROUP" },
          type: 1
        },
        {
          buttonId: "https://wa.me/254768161116",
          buttonText: { displayText: "👑 CONTACT OWNER" },
          type: 1
        }
      ],
      headerType: 4
    }, { quoted: message });

  } catch (error) {
    console.error("HEAVY GLITCH BUGBOT MENU ERROR:", error);
    await sock.sendMessage(chatId, { text: "👑 BUGBOT MENU FAILED TO LOAD" }, { quoted: message });
  }
}

module.exports = helpCommand;
