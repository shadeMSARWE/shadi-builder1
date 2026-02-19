/**
 * 🖼 Image Studio
 * Text → Image
 * Categories: Cartoon, Anime, Cinematic, Realistic, Animals, Kids, Business, Fantasy, Sci-Fi
 */
const path = require("path");
const fs = require("fs");
const { GENERATED_DIR } = require("../../config/paths");
const credits = require("../credits/service");

const CREDITS_PER_IMAGE = 5;

async function generate(userId, prompt, config = {}, userLanguage = "ar") {
  const style = config.style || "realistic";
  const category = config.category || "general";

  // Check credits
  const userCredits = await credits.getCredits(userId).catch(() => 0);
  if (userCredits < CREDITS_PER_IMAGE) {
    return { ok: false, error: "Not enough credits for image generation" };
  }

  // Deduct credits
  const deducted = await credits.deductVideoByAmount(userId, CREDITS_PER_IMAGE).catch(() => false);
  if (!deducted) {
    return { ok: false, error: "Credit deduction failed" };
  }

  // Generate image (placeholder - connect to DALL-E, Stable Diffusion, etc.)
  const imageId = `img_${Date.now()}_${userId.slice(0, 8)}`;
  const imagesDir = path.join(GENERATED_DIR, "_images");
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

  const meta = {
    id: imageId,
    userId,
    prompt,
    style,
    category,
    status: "pending",
    createdAt: new Date().toISOString(),
    outputUrl: null
  };

  const jobDir = path.join(imagesDir, imageId);
  fs.mkdirSync(jobDir, { recursive: true });
  fs.writeFileSync(path.join(jobDir, "meta.json"), JSON.stringify(meta, null, 2), "utf8");
  fs.writeFileSync(path.join(jobDir, "prompt.txt"), prompt, "utf8");

  // TODO: Connect to actual image generation API (DALL-E, Stable Diffusion, etc.)
  // For now, return placeholder
  return {
    ok: true,
    imageId,
    previewUrl: null,
    message: "Image generation job created. Connect DALL-E/Stable Diffusion for actual generation."
  };
}

module.exports = {
  generate,
  CREDITS_PER_IMAGE
};
