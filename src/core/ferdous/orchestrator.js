/**
 * MULTI-OUTPUT ORCHESTRATION
 * 
 * ONE prompt can generate:
 * - Image
 * - Video
 * - Social content
 * - Website
 * 
 * Modular, expandable, non-breaking
 */
// brain is not needed here - executionPlan is passed in
const imageStudio = require("../studios/image");
const videoStudio = require("../studios/video");
const websiteStudio = require("../studios/website");
const socialStudio = require("../studios/social");

/**
 * Execute multi-output plan from FERDOUS BRAIN
 */
async function executePlan(userId, executionPlan, userLanguage = "ar") {
  const results = [];
  const errors = [];

  for (const output of executionPlan.outputs || []) {
    try {
      let result = null;

      switch (output.studio) {
        case "image":
          result = await imageStudio.generate(userId, output.prompt, output.config, userLanguage);
          break;
        case "video":
          result = await videoStudio.generate(userId, output.prompt, output.config, userLanguage);
          break;
        case "website":
        case "saas":
          result = await websiteStudio.generate(userId, output.prompt, output.config, userLanguage);
          break;
        case "social":
          result = await socialStudio.generate(userId, output.prompt, output.config, userLanguage);
          break;
        default:
          console.warn(`[Orchestrator] Unknown studio: ${output.studio}`);
          continue;
      }

      if (result && result.ok) {
        results.push({
          type: output.type,
          studio: output.studio,
          ...result
        });
      } else {
        errors.push({ studio: output.studio, error: result?.error || "Generation failed" });
      }
    } catch (err) {
      console.error(`[Orchestrator] Error in ${output.studio}:`, err);
      errors.push({ studio: output.studio, error: err.message });
    }
  }

  return {
    ok: results.length > 0,
    results,
    errors: errors.length > 0 ? errors : undefined,
    totalOutputs: executionPlan.outputs?.length || 0,
    successful: results.length
  };
}

module.exports = {
  executePlan
};
