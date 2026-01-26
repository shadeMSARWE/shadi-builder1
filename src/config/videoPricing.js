/**
 * Video pricing by duration and style – Production-ready for Railway
 * Duration in seconds; style multipliers; voice-over fixed add-on.
 */
const DURATIONS_SEC = [5, 10, 20, 30];
const STYLES = [
  { id: "realistic", nameEn: "Realistic", nameAr: "واقعي", creditMultiplier: 1 },
  { id: "cinematic", nameEn: "Cinematic", nameAr: "سینمائي", creditMultiplier: 1.2 },
  { id: "3d_cartoon", nameEn: "3D Cartoon", nameAr: "كرتون 3D", creditMultiplier: 1.3 },
  { id: "anime", nameEn: "Anime", nameAr: "أنمي", creditMultiplier: 1.25 },
  { id: "digital_art", nameEn: "Digital Art", nameAr: "فن رقمي", creditMultiplier: 1.15 },
];
const BASE_CREDITS_PER_10_SEC = 40;
const VOICEOVER_CREDITS = 25;

function getBaseCredits(durationSeconds) {
  return Math.ceil((durationSeconds / 10) * BASE_CREDITS_PER_10_SEC);
}

function getVideoCost(durationSeconds, styleId, voiceOver) {
  const base = getBaseCredits(durationSeconds);
  const style = STYLES.find((s) => s.id === styleId) || STYLES[0];
  const amount = Math.ceil(base * style.creditMultiplier) + (voiceOver ? VOICEOVER_CREDITS : 0);
  return amount;
}

module.exports = {
  DURATIONS_SEC,
  STYLES,
  VOICEOVER_CREDITS,
  getBaseCredits,
  getVideoCost,
};
