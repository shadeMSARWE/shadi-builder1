import { register } from "@/system/registry";
import { generate } from "./controller";

register({
  id: "game",
  name: "AI Game Builder",
  credits: 75,
  controller: { generate },
});
