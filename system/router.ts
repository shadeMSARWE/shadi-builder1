/**
 * FERDOUS AI OS - Router
 * Routes prompts to correct engine
 */
import type { EngineId } from "./registry";

export function route(prompt: string): EngineId {
  const p = prompt.toLowerCase();
  if (/store|shop|ecommerce|product|cart|checkout/.test(p)) return "store";
  if (/saas|dashboard|subscription|billing/.test(p)) return "saas";
  if (/app|mobile|react native/.test(p)) return "app";
  if (/game|2d|3d|webgl/.test(p)) return "game";
  if (/video|film|movie/.test(p)) return "video";
  if (/image|picture|photo|upscale/.test(p)) return "image";
  if (/voice|audio|tts|podcast/.test(p)) return "voice";
  if (/social|post|instagram|tiktok|caption|hashtag/.test(p)) return "social";
  return "website";
}
