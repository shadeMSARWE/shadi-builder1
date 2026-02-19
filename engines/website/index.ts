/**
 * WEBSITE_ENGINE_PRO
 */
import { register } from "@/system/registry";
import { generate } from "./controller";

register({
  id: "website",
  name: "AI Website Builder",
  credits: 15,
  controller: { generate },
});
