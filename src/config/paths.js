/**
 * مسارات الحفظ الموحدة – تجنب 404 وتضارب المسارات
 * كل الملفات المُولَّدة (مواقع، فيديوهات) تُحفظ تحت جذر المشروع في مجلد generated
 */
const path = require("path");

// من src/config -> جذر المشروع = ../..
const PROJECT_ROOT = path.resolve(__dirname, "..", "..");
const GENERATED_DIR = path.join(PROJECT_ROOT, "generated-projects");
const GENERATED_LEGACY = path.join(PROJECT_ROOT, "generated");

module.exports = {
  PROJECT_ROOT,
  GENERATED_DIR,
  GENERATED_LEGACY
};
