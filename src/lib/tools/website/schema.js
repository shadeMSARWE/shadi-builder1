/**
 * FERDOUS AI OS - Website Tool JSON Output Schema
 */
const WEBSITE_SCHEMA = {
  type: "object",
  required: ["type", "config", "sections", "assets", "files", "dependencies"],
  properties: {
    type: { type: "string", enum: ["website", "saas", "landing"] },
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
        required: ["id", "type", "content", "order"],
        properties: {
          id: { type: "string" },
          type: { type: "string" },
          content: { type: "object" },
          order: { type: "number" }
        }
      }
    },
    assets: { type: "array" },
    files: { type: "array" },
    dependencies: { type: "array" }
  }
};

function validate(data) {
  if (!data || typeof data !== "object") return { valid: false, error: "Invalid data" };
  if (!data.type) data.type = "website";
  if (!Array.isArray(data.sections)) data.sections = [];
  if (!Array.isArray(data.assets)) data.assets = [];
  if (!Array.isArray(data.files)) data.files = [];
  if (!Array.isArray(data.dependencies)) data.dependencies = [];
  if (!data.config) data.config = {};
  return { valid: true, data };
}

module.exports = {
  WEBSITE_SCHEMA,
  validate
};
