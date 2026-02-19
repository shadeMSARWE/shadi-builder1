/**
 * FERDOUS AI OS - Structured Output Schema
 * All AI responses MUST follow this schema. No raw text.
 */
const OUTPUT_SCHEMA = {
  type: "object",
  required: ["type", "config", "sections", "assets", "files", "dependencies"],
  properties: {
    type: { type: "string", enum: ["website", "saas", "landing", "react", "express", "nextjs", "video", "image", "social", "marketing"] },
    config: {
      type: "object",
      properties: {
        theme: { type: "string", enum: ["dark", "light"] },
        layout: { type: "string", enum: ["landing", "dashboard", "saas", "ecommerce", "banking"] },
        category: { type: "string" },
        style: { type: "string" },
        language: { type: "string" }
      }
    },
    sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          type: { type: "string" },
          content: { type: "object" },
          order: { type: "number" }
        }
      }
    },
    assets: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string" },
          url: { type: "string" },
          alt: { type: "string" }
        }
      }
    },
    files: {
      type: "array",
      items: {
        type: "object",
        properties: {
          path: { type: "string" },
          content: { type: "string" },
          type: { type: "string" }
        }
      }
    },
    dependencies: {
      type: "array",
      items: { type: "string" }
    }
  }
};

function validateOutput(data) {
  if (!data || typeof data !== "object") return { valid: false, error: "Invalid output: not an object" };
  if (!data.type) return { valid: false, error: "Missing required field: type" };
  if (!Array.isArray(data.sections)) data.sections = [];
  if (!Array.isArray(data.assets)) data.assets = [];
  if (!Array.isArray(data.files)) data.files = [];
  if (!Array.isArray(data.dependencies)) data.dependencies = [];
  if (!data.config || typeof data.config !== "object") data.config = {};
  return { valid: true, data };
}

module.exports = {
  OUTPUT_SCHEMA,
  validateOutput
};
