const axios = require("axios");

async function hadithCommand(sock, chatId, message) {
  try {
    const rawText =
      message.message?.conversation ||
      message.message?.extendedTextMessage?.text ||
      "";
    const input = rawText.replace(/\.hadith\s*/i, "").trim();

    if (!input) {
      await sock.sendMessage(chatId, {
        text: "📖 *Hadith Command Usage*\n\n" +
              "*Method 1 - By Keyword:*\n" +
              ".hadith bukhari knowledge\n" +
              ".hadith muslim patience\n" +
              ".hadith abudawud prayer\n\n" +
              "*Method 2 - By Number:*\n" +
              ".hadith bukhari 1\n" +
              ".hadith muslim 5\n\n" +
              "*Available Collections:*\n" +
              "• bukhari • muslim • abudawud\n" +
              "• tirmidhi • ibnmajah • nasai\n" +
              "• muwatta"
      });
      return;
    }

    const parts = input.split(/\s+/);
    const collection = parts[0].toLowerCase();
    const query = parts.slice(1).join(" ").toLowerCase();

    if (!query) {
      await sock.sendMessage(chatId, {
        text: "⚠️ *Invalid Format*\n\n" +
              "Please provide collection and keyword/number.\n\n" +
              "*Examples:*\n" +
              ".hadith bukhari knowledge\n" +
              ".hadith muslim 5"
      });
      return;
    }

    // Validate collection
    const validCollections = ["bukhari", "muslim", "abudawud", "tirmidhi", "ibnmajah", "nasai", "muwatta"];
    if (!validCollections.includes(collection)) {
      await sock.sendMessage(chatId, {
        text: `❌ *Invalid Collection*\n\n` +
              `"${collection}" is not recognized.\n\n` +
              `*Valid collections:*\n` +
              validCollections.map(c => `• ${c}`).join("\n")
      });
      return;
    }

    // Check if query is a number or keyword
    const isNumber = !isNaN(query);

    if (isNumber) {
      // Search by hadith number
      await searchByNumber(sock, chatId, collection, query);
    } else {
      // Search by keyword
      await searchByKeyword(sock, chatId, collection, query);
    }

  } catch (err) {
    console.error("Hadith Command Error:", err.message);
    try {
      await sock.sendMessage(chatId, {
        text: "⚠️ *Error*\n\n" +
              "Could not retrieve hadith. Please try again later."
      });
    } catch (e) {
      console.error("Failed to send error message:", e.message);
    }
  }
}

// Search hadith by number
async function searchByNumber(sock, chatId, collection, hadithNumber) {
  try {
    await sock.sendMessage(chatId, { text: "⏳ Searching hadith #" + hadithNumber + " from " + collection + "..." });

    const apis = [
      {
        name: "Primary API",
        url: `https://api.hadith.gading.dev/${collection}/${hadithNumber}`,
        parser: (data) => data
      },
      {
        name: "Hadith API Pages",
        url: `https://hadithapi.pages.dev/api/${collection}/${hadithNumber}`,
        parser: (data) => data
      }
    ];

    let hadithData = null;
    let successApi = null;

    for (const api of apis) {
      try {
        const response = await axios.get(api.url, { timeout: 10000 });
        if (response.data) {
          hadithData = api.parser(response.data);
          successApi = api.name;
          if (hadithData.englishText || hadithData.text) {
            break;
          }
        }
      } catch (err) {
        console.log(`${api.name} failed:`, err.message);
      }
    }

    if (!hadithData || (!hadithData.englishText && !hadithData.text)) {
      await sock.sendMessage(chatId, {
        text: `❌ *Hadith Not Found*\n\n` +
              `No hadith found with number ${hadithNumber} in ${collection}.`
      });
      return;
    }

    await sendFormattedHadith(sock, chatId, hadithData, collection, hadithNumber, successApi);

  } catch (err) {
    console.error("Error searching by number:", err.message);
    await sock.sendMessage(chatId, { text: "⚠️ Error retrieving hadith by number." });
  }
}

// Search hadith by keyword
async function searchByKeyword(sock, chatId, collection, keyword) {
  try {
    await sock.sendMessage(chatId, { text: "⏳ Searching for '" + keyword + "' in " + collection + "..." });

    // Fetch the entire collection and filter by keyword
    const apis = [
      `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-${collection}.json`,
      `https://api.hadith.gading.dev/${collection}`
    ];

    let allHadiths = null;

    for (const apiUrl of apis) {
      try {
        const response = await axios.get(apiUrl, { timeout: 15000 });
        if (response.data && Array.isArray(response.data)) {
          allHadiths = response.data;
          break;
        }
      } catch (err) {
        console.log(`API ${apiUrl} failed:`, err.message);
      }
    }

    if (!allHadiths) {
      await sock.sendMessage(chatId, {
        text: `❌ *Unable to search*\n\nCould not access ${collection} database.`
      });
      return;
    }

    // Filter hadiths by keyword
    const matches = allHadiths.filter(h => {
      const searchText = (
        (h.englishText || h.text || h.body || "") +
        (h.arabicText || "") +
        (h.bookName || h.book || "") +
        (h.chapterName || h.chapter || "")
      ).toLowerCase();
      return searchText.includes(keyword);
    });

    if (matches.length === 0) {
      await sock.sendMessage(chatId, {
        text: `❌ *No Results*\n\n` +
              `No hadiths found matching "${keyword}" in ${collection}.`
      });
      return;
    }

    // Show top 3 results
    const topMatches = matches.slice(0, 3);
    let resultText = `✅ *Found ${matches.length} result(s) for "${keyword}"*\n\n`;

    for (let i = 0; i < topMatches.length; i++) {
      const h = topMatches[i];
      resultText += `*Result ${i + 1}:*\n`;
      resultText += `🔢 Hadith #: ${h.hadithNumber || "N/A"}\n`;
      resultText += `📖 Chapter: ${h.chapterName || h.chapter || "Unknown"}\n`;
      resultText += `📝 Text: ${(h.englishText || h.text || h.body || "").substring(0, 150)}...\n\n`;
    }

    resultText += `━━━━━━━━━━━━━━━━━━\n`;
    resultText += `💡 To see full details, use:\n`;
    resultText += `_.hadith ${collection} ${topMatches[0].hadithNumber}_`;

    await sock.sendMessage(chatId, { text: resultText });

  } catch (err) {
    console.error("Error searching by keyword:", err.message);
    await sock.sendMessage(chatId, { text: "⚠️ Error searching by keyword. Try a different search term." });
  }
}

// Send formatted hadith response
async function sendFormattedHadith(sock, chatId, hadithData, collection, hadithNumber, successApi) {
  try {
    let text = `🕌 *${collection.toUpperCase()}*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    if (hadithData.bookName || hadithData.book) {
      text += `📚 *Book*: ${hadithData.bookName || hadithData.book}\n`;
    }

    if (hadithData.chapterName || hadithData.chapter) {
      text += `📖 *Chapter*: ${hadithData.chapterName || hadithData.chapter}\n`;
    }

    if (hadithData.hadithNumber || hadithNumber) {
      text += `🔢 *Hadith #*: ${hadithData.hadithNumber || hadithNumber}\n`;
    }

    if (hadithData.englishNarrator || hadithData.narrator) {
      text += `👤 *Narrator*: ${hadithData.englishNarrator || hadithData.narrator}\n`;
    }

    if (hadithData.englishGrade || hadithData.grade) {
      text += `⭐ *Grade*: ${hadithData.englishGrade || hadithData.grade}\n`;
    }

    const mainText = hadithData.englishText || hadithData.text || hadithData.body || "No text available";
    text += `\n📝 *English Text*:\n`;
    text += `${mainText}\n`;

    if (hadithData.arabicText || hadithData.hadith_ar) {
      text += `\n🌙 *Arabic Text*:\n`;
      text += `${hadithData.arabicText || hadithData.hadith_ar}\n`;
    }

    text += `\n━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `✅ Source: ${successApi || "Hadith API"}`;

    await sock.sendMessage(chatId, { text });

  } catch (err) {
    console.error("Error formatting hadith:", err.message);
    await sock.sendMessage(chatId, { text: "⚠️ Error formatting response." });
  }
}

module.exports = hadithCommand;
