/**
 * Video pricing by duration + style + audio + format
 * (Manus-like controls: short-form video engine)
 */
const DURATIONS_SEC = [5, 10, 20, 30];
const FORMATS = [
  { id: "16:9", nameEn: "16:9 (YouTube)", nameAr: "16:9 (يوتيوب)" },
  { id: "9:16", nameEn: "9:16 (Reels/TikTok)", nameAr: "9:16 (ريلز/تيك توك)" }
];

const STYLES = [
  { id: "realistic", nameEn: "Realistic", nameAr: "واقعي", creditMultiplier: 1.0 },
  { id: "cinematic", nameEn: "Cinematic", nameAr: "سينمائي", creditMultiplier: 1.2 },
  { id: "3d_cartoon", nameEn: "3D Cartoon", nameAr: "كرتون 3D", creditMultiplier: 1.3 },
  { id: "anime", nameEn: "Anime", nameAr: "أنمي", creditMultiplier: 1.25 },
  { id: "digital_art", nameEn: "Digital Art", nameAr: "فن رقمي", creditMultiplier: 1.15 },
];

const MUSIC = [
  { id: "none", nameEn: "None", nameAr: "بدون", credits: 0 },
  { id: "cinematic", nameEn: "Cinematic", nameAr: "سينمائية", credits: 12 },
  { id: "upbeat", nameEn: "Upbeat", nameAr: "حماسية", credits: 10 },
  { id: "lofi", nameEn: "Lo‑fi", nameAr: "لوفاي", credits: 8 },
];

// 10+ voice-over languages (ISO 639‑1 codes)
const VOICE_LANGS = [
  { id: "ar", nameEn: "Arabic", nameAr: "العربية", credits: 0 },
  { id: "en", nameEn: "English", nameAr: "English", credits: 0 },
  { id: "fr", nameEn: "French", nameAr: "Français", credits: 0 },
  { id: "de", nameEn: "German", nameAr: "Deutsch", credits: 0 },
  { id: "es", nameEn: "Spanish", nameAr: "Español", credits: 0 },
  { id: "it", nameEn: "Italian", nameAr: "Italiano", credits: 0 },
  { id: "pt", nameEn: "Portuguese", nameAr: "Português", credits: 0 },
  { id: "tr", nameEn: "Turkish", nameAr: "Türkçe", credits: 0 },
  { id: "ru", nameEn: "Russian", nameAr: "Русский", credits: 0 },
  { id: "ja", nameEn: "Japanese", nameAr: "日本語", credits: 0 },
  { id: "ko", nameEn: "Korean", nameAr: "한국어", credits: 0 },
];

const BASE_CREDITS_PER_10_SEC = 40;
const VOICEOVER_CREDITS = 25;
const AUTO_SYNC_CREDITS = 10;

function getBaseCredits(durationSeconds) {
  return Math.ceil((durationSeconds / 10) * BASE_CREDITS_PER_10_SEC);
}

function getVideoCost(durationSeconds, styleId, voiceOver, options = {}) {
  const base = getBaseCredits(durationSeconds);
  const style = STYLES.find((s) => s.id === styleId) || STYLES[0];
  const music = MUSIC.find((m) => m.id === (options.bgMusic || "none")) || MUSIC[0];
  const format = FORMATS.find((f) => f.id === (options.format || "16:9")) || FORMATS[0];
  const voiceLang = VOICE_LANGS.find((l) => l.id === (options.voiceLanguage || "ar")) || VOICE_LANGS[0];
  const autoSync = !!options.autoAudioSync;

  // format currently doesn't change cost, but kept for extensibility
  void format;
  void voiceLang;

  const amount =
    Math.ceil(base * style.creditMultiplier) +
    (voiceOver ? VOICEOVER_CREDITS : 0) +
    (autoSync ? AUTO_SYNC_CREDITS : 0) +
    (music.credits || 0);
  return amount;
}

module.exports = {
  DURATIONS_SEC,
  FORMATS,
  STYLES,
  MUSIC,
  VOICE_LANGS,
  VOICEOVER_CREDITS,
  AUTO_SYNC_CREDITS,
  getBaseCredits,
  getVideoCost,
};
