/**
 * FERDOUS BRAIN - Intent Engine
 * 
 * Understands natural language intent and auto-selects:
 * - Output type (image, video, website, SaaS, social, multi)
 * - Style, preset, format, engines
 * - Produces structured EXECUTION PLAN (JSON)
 * 
 * Philosophy: User describes → Brain decides everything → System executes
 */
const openai = require("../../utils/openai");

const SYSTEM_PROMPT = `You are FERDOUS BRAIN, an advanced AI Intent Engine. Your job is to understand what the user wants and create a complete execution plan.

Analyze the user's prompt and determine:
1. PRIMARY OUTPUT TYPE: image | video | website | saas | social | multi
2. If multi, list all output types needed
3. Auto-select optimal settings (style, duration, format, language, etc.)
4. Generate a structured JSON execution plan

Rules:
- NEVER ask the user for configuration
- ALWAYS auto-select the best options
- Think like a professional designer/developer
- Consider context and intent deeply

Return ONLY valid JSON in this structure:
{
  "intent": "clear description of what user wants",
  "outputType": "image|video|website|saas|social|multi",
  "outputs": [
    {
      "type": "image|video|website|saas|social",
      "studio": "image|video|audio|website|social",
      "config": {
        "style": "realistic|cinematic|cartoon|anime|digital_art|...",
        "duration": 5|10|20|30 (for video),
        "format": "16:9|9:16|1:1",
        "voiceLanguage": "ar|en|fr|...",
        "bgMusic": "none|cinematic|upbeat|lofi",
        "autoAudioSync": true|false,
        "voiceOver": true|false,
        "category": "business|kids|animals|fantasy|...",
        "theme": "dark|light",
        "layout": "landing|dashboard|saas|ecommerce|banking" (for website)
      },
      "prompt": "enhanced prompt for this specific output"
    }
  ],
  "preset": "kids_cartoon|cinematic_story|business_explainer|none",
  "estimatedCredits": number,
  "reasoning": "brief explanation of decisions"
}`;

async function understandIntent(userPrompt, userLanguage = "ar") {
  const lang = userLanguage === "he" ? "en" : userLanguage; // Use English for Hebrew prompts to OpenAI
  const prompt = `User prompt (${lang}): ${userPrompt}\n\nAnalyze intent and create execution plan.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const raw = completion.choices?.[0]?.message?.content || "{}";
    const plan = JSON.parse(raw);

    // Validate and normalize
    if (!plan.outputType) plan.outputType = "website";
    if (!Array.isArray(plan.outputs)) plan.outputs = [{ type: plan.outputType, studio: plan.outputType, config: {}, prompt: userPrompt }];
    if (!plan.preset) plan.preset = "none";
    if (typeof plan.estimatedCredits !== "number") plan.estimatedCredits = 10;

    return {
      ok: true,
      plan
    };
  } catch (err) {
    console.error("[FERDOUS BRAIN] Error:", err);
    // Fallback to simple website generation
    return {
      ok: true,
      plan: {
        intent: userPrompt,
        outputType: "website",
        outputs: [{
          type: "website",
          studio: "website",
          config: {
            style: "realistic",
            theme: "dark",
            layout: "landing",
            category: "general"
          },
          prompt: userPrompt
        }],
        preset: "none",
        estimatedCredits: 10,
        reasoning: "Fallback: default website generation"
      }
    };
  }
}

/**
 * Quick Start Presets
 * Auto-configures everything for common use cases
 */
const PRESETS = {
  kids_cartoon: {
    outputType: "video",
    config: {
      style: "3d_cartoon",
      duration: 20,
      format: "16:9",
      voiceLanguage: "ar",
      bgMusic: "upbeat",
      autoAudioSync: true,
      voiceOver: true,
      category: "kids"
    }
  },
  cinematic_story: {
    outputType: "video",
    config: {
      style: "cinematic",
      duration: 30,
      format: "16:9",
      voiceLanguage: "ar",
      bgMusic: "cinematic",
      autoAudioSync: true,
      voiceOver: true,
      category: "story"
    }
  },
  business_explainer: {
    outputType: "video",
    config: {
      style: "realistic",
      duration: 30,
      format: "16:9",
      voiceLanguage: "ar",
      bgMusic: "none",
      autoAudioSync: false,
      voiceOver: true,
      category: "business"
    }
  }
};

function applyPreset(presetId, basePrompt) {
  const preset = PRESETS[presetId];
  if (!preset) return null;

  return {
    ok: true,
    plan: {
      intent: basePrompt,
      outputType: preset.outputType,
      outputs: [{
        type: preset.outputType,
        studio: preset.outputType,
        config: { ...preset.config },
        prompt: basePrompt
      }],
      preset: presetId,
      estimatedCredits: 50,
      reasoning: `Applied preset: ${presetId}`
    }
  };
}

module.exports = {
  understandIntent,
  applyPreset,
  PRESETS
};
