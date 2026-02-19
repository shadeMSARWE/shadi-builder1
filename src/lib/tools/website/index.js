/**
 * FERDOUS AI OS - Website Builder Tool Module
 * Complete module: Prompt, Schema, Renderer, File Generator, Validation
 */
const prompt = require("./prompt");
const schema = require("./schema");
const validator = require("./validator");
const renderer = require("./renderer");
const fileGenerator = require("./fileGenerator");

const CREDITS_PER_SITE = 10;

function getPrompt(input, options = {}) {
  return {
    system: prompt.SYSTEM_PROMPT,
    user: prompt.buildUserPrompt(input, options)
  };
}

function getSchema() {
  return schema.WEBSITE_SCHEMA;
}

async function generate(output, options = {}) {
  const validation = validator.validate(output);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  const validated = validator.ensureRequiredSections(validation.data);
  const projectId = (options.projectId || Date.now()).toString();
  return fileGenerator.generate(projectId, validated, options);
}

module.exports = {
  name: "AI Website Builder",
  description: "Generate full professional websites from text prompts",
  credits: CREDITS_PER_SITE,
  getPrompt,
  getSchema,
  generate,
  renderer,
  fileGenerator,
  validator,
  CREDITS_PER_SITE
};
