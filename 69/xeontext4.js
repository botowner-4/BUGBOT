/**
 * xeontext4.js – Maximal QA Payload Generator (FIXED)
 * ✅ EXPORTS AS TEXT STRING (compatible with bugconfig.js)
 */

const USER_SPECIAL_CHARS = [
  "ລັ້ວ່ັໃ້້ົັໍໝ້້້",           // Lao
  "ျှျှျှျှျှျှ",                // Myanmar
  "ཧྷྐྵྨྭྺྻྜྩྣྡྦྫྷྰྴྵ"     // Tibetan
].join(" ");

const UNICODE_EDGE_CASES = [
  '\u202E',      // RTL override
  '\u200B',      // Zero-width space
  '\uFFFC',      // Object replacement
  '👩‍👩‍👧‍👧',     // ZWJ emoji
  '\u0338',      // Overlays
  '\uFFFDbad_string'
].join(' ');

// Combined unicode block
const unicodeBlock = "ລັ້ວ່ັໃ້້ົັໍໝ້້້" + "ျှျBeverly" + "ཧྷྐྵྨྭྺྻྜྩྣྡྦྫྷྰྴྵ";

// Zalgo/combining-marks generator
function zalgo(str, layers = 10) {
  const combining = ['\u0300', '\u0317', '\u0323', '\u035B', '\u0361', '\u0362'];
  let out = str;
  for (let l = 0; l < layers; l++) {
    for (let i = 0; i < combining.length; i++) out += combining[i];
  }
  return out;
}

// Big QA string generator
function bigQAString() {
  return Array(2000).fill(unicodeBlock).join("") + "💥".repeat(10000) + "\u202E" + "\u200B".repeat(1000);
}

// ✅ BUILD XEONTEXT4 AS A SINGLE TEXT STRING (not an object)
// This is what bugconfig.js expects to send as a message
const xeontext4 = 
  USER_SPECIAL_CHARS + "\n" +
  UNICODE_EDGE_CASES + "\n" +
  zalgo("QA!🔥", 18) + "\n" +
  "💥".repeat(3000) + "\n" +
  bigQAString() + "\n" +
  "A".repeat(7000) + "\n" +
  zalgo(USER_SPECIAL_CHARS, 10) + "\n" +
  USER_SPECIAL_CHARS + "\n" +
  UNICODE_EDGE_CASES;

// ✅ EXPORT AS STRING (matches bugconfig.js expectation)
module.exports = { xeontext4 };
