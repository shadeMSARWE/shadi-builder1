/**
 * FERDOUS i18n Service
 * Centralized language management with RTL/LTR auto-switch
 */
const strings = require("./strings");

const RTL_LANGS = ["ar", "he"];
const SUPPORTED_LANGS = ["ar", "he", "en"];

function getDirection(lang) {
  return RTL_LANGS.includes(lang) ? "rtl" : "ltr";
}

function t(key, lang = "ar") {
  const s = strings[lang] || strings.ar;
  return s[key] || key;
}

function getStrings(lang = "ar") {
  return strings[lang] || strings.ar;
}

module.exports = {
  RTL_LANGS,
  SUPPORTED_LANGS,
  getDirection,
  t,
  getStrings
};
