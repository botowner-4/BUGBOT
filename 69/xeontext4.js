/**
 * xeontext4.js – Final High-Coverage QA Generator (STABLE)
 * ✅ Multi-script + rare Unicode
 * ✅ Invisible + combining mix
 * ✅ RTL/LTR safe interleave
 * ✅ Emoji ZWJ sequences
 * ✅ Font fallback stress
 * ✅ Compatible with bugconfig.js
 */

// ================= BASE =================

const BASE = [
  // Lao
  ..."ກຂຄງຈຊຍດຕນບປຜຝພຟມຢຣລວສຫອຮ",

  // Myanmar
  ..."ကခဂငစဆဇညဋဌဍဎဏတထဒဓနပဖဗဘမယရလဝသဟအ",

  // Tibetan
  ..."ཀཁགངཅཆཇཉཏཐདནཔཕབམཙཚཛཝཞཟའཡརལཤསཧཨ",

  // CJK (your added)
  "頂","夜","嗶","漢","字","語","文",

  // Latin
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",

  // Emoji & symbols
  "😔","😴","😭","☠️","😒","🔥","💥","✨","✓","§","©","®"
];

// Rare / fallback (font stress)
const RARE = [
  "𠀀","𠜎","𡃁","𡈽",
  "ꙮ","Ꚛ","Ꙩ",
  "𓀀","𓂀","𓃀",
  "🜁","🜂","🜃","🜄",
  "𐍈","𐌰","𐌱"
];

BASE.push(...RARE);

// ================= COMPLEXITY =================

// Combining marks
const CM = [
  "\u0300","\u0301","\u0302","\u0303","\u0304","\u0305",
  "\u0306","\u0307","\u0308","\u0309","\u0310","\u0311",
  "\u0312","\u0313","\u0314","\u0315","\u031A","\u0323",
  "\u0324","\u0325","\u0326","\u0327","\u0328","\u0330",
  "\u0331","\u0332","\u0333","\u0334","\u0335","\u0336",
  "\u034F","\u035C","\u0360","\u0361","\u0362"
];

// Invisible
const INVIS = [
  "\u200B","\u200C","\u200D","\u2060","\u2062","\u2063","\uFEFF"
];

// Emoji ZWJ (sticker-like)
const ZWJ = [
  "👩‍👩‍👧‍👧","👨‍👩‍👦","👨‍👨‍👧",
  "👩‍💻","🧑‍🚀","🧑‍🔧","🧑‍🎨","🧑‍🍳","🧑‍⚕️"
];

// Symbols
const SYMBOLS = [
  "€","£","¥","₿","₹",
  "±","≈","≠","≤","≥","∞",
  "→","←","↑","↓","↔",
  "■","●","▲","◆","★"
];

// Bidi
const BIDI = {
  RTL: "\u202E",
  LTR: "\u202D",
  POP: "\u202C"
};

const rand = n => Math.floor(Math.random() * n);

// ================= GENERATORS =================

function invisibleMix(n = 30) {
  let s = "";
  for (let i = 0; i < n; i++) {
    s += INVIS[rand(INVIS.length)];
  }
  return s;
}

function grapheme() {
  let ch;

  // 30% CJK bias
  if (Math.random() > 0.7) {
    const CJK = ["頂","夜","嗶","漢","字"];
    ch = CJK[rand(CJK.length)];
  } else {
    ch = BASE[rand(BASE.length)];
  }

  // combining marks
  const m = 1 + rand(4);
  for (let i = 0; i < m; i++) {
    ch += CM[rand(CM.length)];
  }

  // emoji
  if (Math.random() > 0.85) {
    ch += ZWJ[rand(ZWJ.length)];
  }

  // symbols
  if (Math.random() > 0.85) {
    ch += SYMBOLS[rand(SYMBOLS.length)];
  }

  // invisible
  if (Math.random() > 0.7) {
    ch += invisibleMix(1 + rand(2));
  }

  return ch;
}

function complexUnicode(n = 800) {
  let out = "";
  for (let i = 0; i < n; i++) {
    out += grapheme();
  }
  return out;
}

// RTL/LTR mixing
function bidiInterleave(text) {
  const mid = Math.floor(text.length / 2);

  return (
    BIDI.RTL + text.slice(0, mid) + BIDI.POP +
    invisibleMix(10) +
    BIDI.LTR + text.slice(mid) + BIDI.POP
  );
}

// Font fallback stress line
function fallbackStress() {
  return [
    "ABC",
    "頂夜",
    "𠀀𠜎",
    "👩‍💻",
    "ꙮ",
    "🜁",
    "ཧ",
    "ျ",
    "ລ"
  ].join("");
}

// Structured block
function structuredBlock() {
  return [
    "START",
    bidiInterleave("BUGCODE RECIEVED"),
    invisibleMix(1000),
    complexUnicode(2000),
    ZWJ.join(" "),
    SYMBOLS.join(" "),
    "END"
  ].join("\n");
}

// ================= FINAL PAYLOAD =================

const xeontext4 =
  structuredBlock() + "\n" +
  fallbackStress() + "\n" +
  complexUnicode(10000) + "\n" +
  invisibleMix(5000) + "\n" +
  bidiInterleave(complexUnicode(8000)) + "\n" +
  ZWJ.join(" ") + "\n" +
  SYMBOLS.join(" ") + "\n" +
  complexUnicode(5000);

// ================= EXPORT =================

module.exports = { xeontext4 };
