/**
 * FERDOUS AI OS - Website Tool Controller
 * Orchestrates: prompt → AI → validate → render → file generator
 */
const toolRegistry = require("../registry");
const aiRouter = require("../../ai/router");
const validator = require("./validator");
const fileGenerator = require("./fileGenerator");
const credits = require("../../../core/credits/service");

const CREDITS_PER_SITE = 10;

async function handle(request, context = {}) {
  const { userId, prompt, language = "ar", layout, theme } = request;

  const canGenerate = await credits.canGenerateSite(userId).catch(() => false);
  if (!canGenerate) {
    return { ok: false, error: "Not enough credits for website generation" };
  }

  const toolId = layout === "saas" ? "saas" : layout === "landing" ? "landing" : "website";
  const result = await aiRouter.route(toolId, prompt, {
    userId,
    language,
    layout,
    theme
  });

  if (!result.ok) {
    return result;
  }

  const validated = validator.ensureRequiredSections(result.output);
  const generated = result.generated;

  await credits.deductSite(userId).catch(() => {});

  return {
    ok: true,
    projectId: generated.projectId,
    previewUrl: generated.previewUrl,
    type: "website",
    output: validated,
    generated
  };
}

module.exports = {
  handle,
  CREDITS_PER_SITE
};
