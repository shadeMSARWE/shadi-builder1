/**
 * 🎥 Video Studio
 * Text → Video | Image → Video
 * Styles: Cartoon, Cinematic, Documentary, Animals, Kids, Business, Abstract
 * Full audio control: voice-over, music, auto-sync, formats
 */
const videos = require("../videos/service");
const credits = require("../credits/service");
const pricing = require("../../config/videoPricing");

async function generate(userId, prompt, config = {}, userLanguage = "ar") {
  const duration = config.duration || 10;
  const style = config.style || "realistic";
  const voiceOver = config.voiceOver !== undefined ? config.voiceOver : true;
  const voiceLanguage = config.voiceLanguage || userLanguage;
  const bgMusic = config.bgMusic || "none";
  const autoAudioSync = config.autoAudioSync !== undefined ? config.autoAudioSync : false;
  const format = config.format || "16:9";

  const cost = pricing.getVideoCost(duration, style, voiceOver, {
    voiceLanguage,
    bgMusic,
    autoAudioSync,
    format
  });

  const userCredits = await credits.getCredits(userId).catch(() => 0);
  if (userCredits < cost) {
    return { ok: false, error: "Not enough credits", required: cost };
  }

  const result = videos.createVideoJob(userId, {
    description: prompt,
    durationSeconds: duration,
    style: style,
    voiceOver: voiceOver,
    voiceLanguage: voiceLanguage,
    bgMusic: bgMusic,
    autoAudioSync: autoAudioSync,
    format: format
  });

  if (!result.ok) {
    return result;
  }

  const deducted = await credits.deductVideoByAmount(userId, cost).catch(() => false);
  if (!deducted) {
    return { ok: false, error: "Credit deduction failed", required: cost };
  }

  return {
    ok: true,
    videoId: result.videoId,
    previewUrl: result.previewUrl,
    status: result.status
  };
}

module.exports = {
  generate
};
