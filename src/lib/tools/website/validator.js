/**
 * FERDOUS AI OS - Website Tool Validation Layer
 */
const schema = require("./schema");

function validate(data) {
  return schema.validate(data);
}

function ensureRequiredSections(data) {
  const types = (data.sections || []).map(s => s.type);
  const required = ["navbar", "hero", "footer"];
  for (const r of required) {
    if (!types.includes(r)) {
      data.sections = data.sections || [];
      data.sections.push({
        id: r,
        type: r,
        content: { title: r, subtitle: "" },
        order: data.sections.length + 1
      });
    }
  }
  data.sections.sort((a, b) => (a.order || 0) - (b.order || 0));
  return data;
}

module.exports = {
  validate,
  ensureRequiredSections
};
