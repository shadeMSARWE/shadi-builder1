/**
 * AI RECOMMENDATION ENGINE
 * 
 * After EVERY generation, analyzes output and suggests:
 * - Missing sections
 * - UX improvements
 * - Conversion improvements
 * - SEO improvements
 * - Content gaps
 * 
 * Buttons: [Auto Improve] [Generate Missing Parts]
 */
const openai = require("../../utils/openai");

const RECOMMENDATION_SYSTEM = `You are FERDOUS Recommendation Engine. Analyze generated content and suggest improvements.

For WEBSITES:
- Missing sections (CTA, pricing, testimonials, FAQ, contact)
- UX/UI improvements (contrast, spacing, navigation)
- Conversion optimization (clear CTAs, trust signals)
- SEO gaps (meta tags, headings, alt text)
- Content quality (clarity, relevance)

For VIDEOS:
- Missing elements (intro, outro, captions, transitions)
- Visual quality (lighting, composition, pacing)
- Audio improvements (sync, clarity, music choice)
- Engagement (hook, story arc, call-to-action)

For IMAGES:
- Composition improvements
- Style consistency
- Missing elements
- Quality enhancements

Return JSON:
{
  "recommendations": [
    {
      "type": "missing_section|ux_improvement|conversion|seo|content",
      "priority": "high|medium|low",
      "title": "Short title",
      "description": "Detailed explanation",
      "action": "add_cta|improve_contrast|add_pricing|..."
    }
  ],
  "autoImproveAvailable": true|false,
  "missingParts": ["section1", "section2"]
}`;

async function analyzeAndRecommend(outputType, generatedContent, userPrompt, userLanguage = "ar") {
  const lang = userLanguage === "he" ? "en" : userLanguage;
  const prompt = `Output Type: ${outputType}\nUser Request: ${userPrompt}\nGenerated Content Preview: ${typeof generatedContent === "string" ? generatedContent.substring(0, 1000) : JSON.stringify(generatedContent).substring(0, 1000)}\n\nAnalyze and recommend improvements.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: RECOMMENDATION_SYSTEM },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4
    });

    const raw = completion.choices?.[0]?.message?.content || "{}";
    const result = JSON.parse(raw);

    if (!Array.isArray(result.recommendations)) result.recommendations = [];
    if (typeof result.autoImproveAvailable !== "boolean") result.autoImproveAvailable = result.recommendations.length > 0;
    if (!Array.isArray(result.missingParts)) result.missingParts = [];

    return {
      ok: true,
      ...result
    };
  } catch (err) {
    console.error("[Recommendation] Error:", err);
    return {
      ok: true,
      recommendations: [],
      autoImproveAvailable: false,
      missingParts: []
    };
  }
}

/**
 * Auto-improve based on recommendations
 * Returns enhanced content or execution plan
 */
async function autoImprove(outputType, currentContent, recommendations, userLanguage = "ar") {
  const highPriority = recommendations.filter((r) => r.priority === "high").slice(0, 3);
  if (highPriority.length === 0) return { ok: false, error: "No high-priority improvements" };

  const lang = userLanguage === "he" ? "en" : userLanguage;
  const prompt = `Output Type: ${outputType}\nCurrent Content: ${typeof currentContent === "string" ? currentContent.substring(0, 2000) : JSON.stringify(currentContent).substring(0, 2000)}\n\nImprovements to apply:\n${highPriority.map((r) => `- ${r.title}: ${r.description}`).join("\n")}\n\nGenerate improved version.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `You are FERDOUS Auto-Improve. Apply the requested improvements to the content. Return improved ${outputType === "website" ? "HTML/CSS/JS" : outputType === "video" ? "video description and settings" : "content"}.` },
        { role: "user", content: prompt }
      ],
      temperature: 0.5
    });

    const improved = completion.choices?.[0]?.message?.content || "";

    return {
      ok: true,
      improved,
      appliedRecommendations: highPriority.map((r) => r.title)
    };
  } catch (err) {
    console.error("[Auto-Improve] Error:", err);
    return { ok: false, error: "Auto-improve failed" };
  }
}

module.exports = {
  analyzeAndRecommend,
  autoImprove
};
