/**
 * FERDOUS AI OS - Tool Registry
 * Dynamic registration of AI tools. No hardcoded switch.
 */
const tools = new Map();

function register(toolId, module) {
  if (!module || typeof module.generate !== "function") {
    throw new Error(`Tool ${toolId} must export generate()`);
  }
  tools.set(toolId, module);
}

function get(toolId) {
  return tools.get(toolId);
}

function list() {
  return Array.from(tools.entries()).map(([id, m]) => ({
    id,
    name: m.name || id,
    description: m.description || "",
    credits: m.credits || 10
  }));
}

function has(toolId) {
  return tools.has(toolId);
}

// Auto-register built-in tools
try {
  const websiteTool = require("./website");
  register("website", websiteTool);
  register("saas", websiteTool);
  register("landing", websiteTool);
} catch (e) {
  console.warn("[Registry] Website tool not loaded:", e.message);
}

module.exports = {
  register,
  get,
  list,
  has
};
