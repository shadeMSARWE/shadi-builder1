/**
 * 🔊 Audio Studio
 * Voice generation, multi-language, emotion/tone, subtitles auto-generated
 */
const path = require("path");
const fs = require("fs");
const { GENERATED_DIR } = require("../../config/paths");
const credits = require("../credits/service");

const CREDITS_PER_AUDIO_MINUTE = 15;

async function generate(userId, text, config = {}, userLanguage = "ar") {
  const language = config.language || userLanguage;
  const emotion = config.emotion || "neutral";
  const tone = config.tone || "professional";
  const durationMinutes = Math.ceil((text.length / 150) || 1); // Rough estimate

  const cost = durationMinutes * CREDITS_PER_AUDIO_MINUTE;
  const userCredits = await credits.getCredits(userId).catch(() => 0);
  if (userCredits < cost) {
    return { ok: false, error: "Not enough credits", required: cost };
  }

  // Generate audio (placeholder - connect to ElevenLabs, etc.)
  const audioId = `audio_${Date.now()}_${userId.slice(0, 8)}`;
  const audioDir = path.join(GENERATED_DIR, "_audio");
  if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

  const meta = {
    id: audioId,
    userId,
    text,
    language,
    emotion,
    tone,
    durationMinutes,
    status: "pending",
    createdAt: new Date().toISOString(),
    outputUrl: null,
    subtitles: null
  };

  const jobDir = path.join(audioDir, audioId);
  fs.mkdirSync(jobDir, { recursive: true });
  fs.writeFileSync(path.join(jobDir, "meta.json"), JSON.stringify(meta, null, 2), "utf8");
  fs.writeFileSync(path.join(jobDir, "text.txt"), text, "utf8");

  // TODO: Connect to ElevenLabs or similar for actual voice generation
  // TODO: Auto-generate subtitles

  // Deduct credits
  await credits.deductVideoByAmount(userId, cost).catch(() => {});

  return {
    ok: true,
    audioId,
    previewUrl: null,
    message: "Audio generation job created. Connect ElevenLabs for actual voice generation."
  };
}

module.exports = {
  generate,
  CREDITS_PER_AUDIO_MINUTE
};
