/**
 * FERDOUS AI OS - Central AI Router
 * Responsibilities:
 * - Detect requested tool
 * - Load correct prompt template
 * - Enforce structured JSON output
 * - Validate output schema
 * - Send to file generator
 */
const toolRegistry = require("../tools/registry");
const { validateOutput } = require("../schemas/output");
const openai = require("../../utils/openai");

async function route(toolId, input, options = {}) {
  const { userId, language = "ar" } = options;
  const tool = toolRegistry.get(toolId);
  if (!tool) {
    return { ok: false, error: `Unknown tool: ${toolId}` };
  }

  const prompt = tool.getPrompt(input, options);
  const schema = tool.getSchema();

  const completion = await openai.chat.completions.create({
    model: options.model || "gpt-4o-mini",
    messages: [
      { role: "system", content: prompt.system },
      { role: "user", content: prompt.user }
    ],
    response_format: { type: "json_object" },
    temperature: options.temperature ?? 0.3
  });

  const raw = completion.choices?.[0]?.message?.content || "{}";
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return { ok: false, error: "AI returned invalid JSON", raw };
  }

  const validation = validateOutput(parsed);
  if (!validation.valid) {
    return { ok: false, error: validation.error, raw: parsed };
  }

  const validated = validation.data;
  const generated = await tool.generate(validated, { userId, language });

  return {
    ok: true,
    output: validated,
    generated,
    toolId
  };
}

function detectToolFromIntent(intent) {
  const intentLower = (intent || "").toLowerCase();
  if (intentLower.includes("saas") || intentLower.includes("dashboard") || intentLower.includes("app")) return "saas";
  if (intentLower.includes("landing") || intentLower.includes("صفحة هبوط")) return "landing";
  if (intentLower.includes("website") || intentLower.includes("موقع") || intentLower.includes("موقع ويب")) return "website";
  return "website";
}

module.exports = {
  route,
  detectToolFromIntent
};
