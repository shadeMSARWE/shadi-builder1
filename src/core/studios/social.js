/**
 * 📢 Social Studio
 * Social posts (text + image + video)
 * Platform-aware: TikTok, YouTube, Instagram, Facebook
 * Ad copy generation
 */
const path = require("path");
const fs = require("fs");
const { GENERATED_DIR } = require("../../config/paths");
const credits = require("../credits/service");
const openai = require("../../utils/openai");

const CREDITS_PER_POST = 8;

async function generate(userId, prompt, config = {}, userLanguage = "ar") {
  const platform = config.platform || "instagram";
  const includeImage = config.includeImage !== undefined ? config.includeImage : true;
  const includeVideo = config.includeVideo !== undefined ? config.includeVideo : false;

  const cost = CREDITS_PER_POST + (includeImage ? 5 : 0) + (includeVideo ? 30 : 0);
  const userCredits = await credits.getCredits(userId).catch(() => 0);
  if (userCredits < cost) {
    return { ok: false, error: "Not enough credits", required: cost };
  }

  // Generate social post content
  const lang = userLanguage === "he" ? "en" : userLanguage;
  const systemPrompt = `You are a social media content creator. Generate engaging ${platform} content based on the user's prompt. Return JSON:
{
  "text": "post caption",
  "hashtags": ["tag1", "tag2"],
  "callToAction": "CTA text",
  "imagePrompt": "description for image generation",
  "videoPrompt": "description for video generation (if needed)"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const content = JSON.parse(completion.choices?.[0]?.message?.content || "{}");

    // Save social post
    const postId = `social_${Date.now()}_${userId.slice(0, 8)}`;
    const socialDir = path.join(GENERATED_DIR, "_social");
    if (!fs.existsSync(socialDir)) fs.mkdirSync(socialDir, { recursive: true });

    const meta = {
      id: postId,
      userId,
      platform,
      prompt,
      content,
      includeImage,
      includeVideo,
      createdAt: new Date().toISOString()
    };

    const jobDir = path.join(socialDir, postId);
    fs.mkdirSync(jobDir, { recursive: true });
    fs.writeFileSync(path.join(jobDir, "meta.json"), JSON.stringify(meta, null, 2), "utf8");
    fs.writeFileSync(path.join(jobDir, "content.json"), JSON.stringify(content, null, 2), "utf8");

    // Deduct credits
    await credits.deductVideoByAmount(userId, cost).catch(() => {});

    return {
      ok: true,
      postId,
      platform,
      content,
      imagePrompt: includeImage ? content.imagePrompt : null,
      videoPrompt: includeVideo ? content.videoPrompt : null
    };
  } catch (err) {
    console.error("[Social Studio] Error:", err);
    return { ok: false, error: "Social post generation failed" };
  }
}

module.exports = {
  generate,
  CREDITS_PER_POST
};
