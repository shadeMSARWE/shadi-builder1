import { register } from "@/system/registry";
import { generate } from "./controller";

register({
  id: "social",
  name: "AI Social Engine",
  credits: 5,
  controller: { generate },
});
