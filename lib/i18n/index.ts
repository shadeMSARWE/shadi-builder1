import { strings, getDirection } from "./strings";

export function t(key: string, lang: string = "en"): string {
  return strings[lang]?.[key] || strings.en?.[key] || key;
}

export { getDirection, strings };
